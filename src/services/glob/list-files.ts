import * as vscode from "vscode"
import { globby, Options, isGitIgnored, GitignoreOptions } from "globby"
import os from "os"
import * as path from "path"
import { arePathsEqual } from "../../utils/path"

export async function listFilesInWorkspace(
	recursive: boolean,
	limit: number,
	dirPath?: string,
): Promise<[string[], boolean]> {
	/*const folders = vscode.workspace.workspaceFolders;
	if (!folders) {
		return [[], false]
	}*/

	const ignorePattern =
		"**/+(" +
		[
			"node_modules",
			"__pycache__",
			"env",
			"venv",
			"target/dependency",
			"build/dependencies",
			"dist",
			"out",
			"bundle",
			"vendor",
			"tmp",
			"temp",
			"deps",
			"pkg",
			"Pods",
			".*", // '!**/.*' excludes hidden directories, while '!**/.*/**' excludes only their contents. This way we are at least aware of the existence of hidden directories.
		].join("|") +
		")/**"

	var searchPath = dirPath ? dirPath + "/" : ""
	searchPath = searchPath || ""

	const cwd = vscode.workspace.workspaceFolders?.at(0)?.uri.fsPath
	var relativePath = cwd ? path.relative(cwd, dirPath || "") : ""
	if (relativePath.length > 0) relativePath += "/"
	relativePath += recursive ? "**/*" : "*"
	relativePath = relativePath.toPosix()

	// TODO: use the folder parameter to limit the search to a specific workspace folder
	//var files = await vscode.workspace.findFiles(`**/*`, ignorePattern, limit)
	var files = await vscode.workspace.findFiles(relativePath, ignorePattern, limit)

	var filePaths = files.map((file) => file.fsPath)

	//const isIgnored = await isGitIgnored({cwd: cwd})
	//filePaths = filePaths.filter((filePath) => !isIgnored(filePath))

	return [filePaths, true]
}

export async function listFiles(dirPath: string, recursive: boolean, limit: number): Promise<[string[], boolean]> {
	const absolutePath = path.resolve(dirPath)
	// Do not allow listing files in root or home directory, which cline tends to want to do when the user's prompt is vague.
	const root = process.platform === "win32" ? path.parse(absolutePath).root : "/"
	const isRoot = arePathsEqual(absolutePath, root)
	if (isRoot) {
		return [[root], false]
	}
	const homeDir = os.homedir()
	const isHomeDir = arePathsEqual(absolutePath, homeDir)
	if (isHomeDir) {
		return [[homeDir], false]
	}

	return listFilesInWorkspace(recursive, limit, dirPath)

	const dirsToIgnore = [
		"node_modules",
		"__pycache__",
		"env",
		"venv",
		"target/dependency",
		"build/dependencies",
		"dist",
		"out",
		"bundle",
		"vendor",
		"tmp",
		"temp",
		"deps",
		"pkg",
		"Pods",
		".*", // '!**/.*' excludes hidden directories, while '!**/.*/**' excludes only their contents. This way we are at least aware of the existence of hidden directories.
	].map((dir) => `**/${dir}/`)

	const options = {
		cwd: dirPath,
		dot: true, // do not ignore hidden files/directories
		absolute: true,
		markDirectories: true, // Append a / on any directories matched (/ is used on windows as well, so dont use path.sep)
		gitignore: recursive, // globby ignores any files that are gitignored
		ignore: recursive ? dirsToIgnore : undefined, // just in case there is no gitignore, we ignore sensible defaults
		onlyFiles: false, // true by default, false means it will list directories on their own too
	}
	// * globs all files in one dir, ** globs files in nested directories
	const files = recursive ? await globbyLevelByLevel(limit, options) : (await globby("*", options)).slice(0, limit)
	return [files, files.length >= limit]
}

/*
Breadth-first traversal of directory structure level by level up to a limit:
   - Queue-based approach ensures proper breadth-first traversal
   - Processes directory patterns level by level
   - Captures a representative sample of the directory structure up to the limit
   - Minimizes risk of missing deeply nested files

- Notes:
   - Relies on globby to mark directories with /
   - Potential for loops if symbolic links reference back to parent (we could use followSymlinks: false but that may not be ideal for some projects and it's pointless if they're not using symlinks wrong)
   - Timeout mechanism prevents infinite loops
*/
async function globbyLevelByLevel(limit: number, options?: Options) {
	let results: Set<string> = new Set()
	let queue: string[] = ["*"]

	const globbingProcess = async () => {
		while (queue.length > 0 && results.size < limit) {
			const pattern = queue.shift()!
			const filesAtLevel = await globby(pattern, options)

			for (const file of filesAtLevel) {
				if (results.size >= limit) {
					break
				}
				results.add(file)
				if (file.endsWith("/")) {
					queue.push(`${file}*`)
				}
			}
		}
		return Array.from(results).slice(0, limit)
	}

	// Timeout after 10 seconds and return partial results
	const timeoutPromise = new Promise<string[]>((_, reject) => {
		setTimeout(() => reject(new Error("Globbing timeout")), 100_000)
	})
	try {
		return await Promise.race([globbingProcess(), timeoutPromise])
	} catch (error) {
		console.warn("Globbing timed out, returning partial results")
		return Array.from(results)
	}
}
