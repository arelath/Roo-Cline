import { DiffStrategy } from "../../diff/DiffStrategy"
import { renderTemplate } from "../template-loader"
import fs from "fs/promises"
import path from "path"
import { PromptContext } from "../system"
import * as vscode from "vscode"

export async function getRulesSection(
	extensionContext: vscode.ExtensionContext,
	context: PromptContext,
): Promise<string> {
	// First, check for a custom rules file
	const customRulesPath = path.join(context.cwd, ".clinerules-rules")
	try {
		const customRules = await fs.readFile(customRulesPath, "utf-8")
		if (customRules.trim()) {
			return customRules.trim()
		}
	} catch (err) {
		// Silently ignore if file doesn't exist or can't be read
		if ((err as NodeJS.ErrnoException).code !== "ENOENT") {
			console.warn(`Error reading custom rules file: ${err}`)
		}
	}

	// If no custom rules, fall back to template
	return renderTemplate("rules", context, extensionContext)
}
