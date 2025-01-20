import defaultShell from "default-shell"
import os from "os"
import osName from "os-name"
import { renderTemplate } from "../template-loader"

export async function getSystemInfoSection(cwd: string): Promise<string> {
	return renderTemplate("system-info", {
		osName: osName(),
		defaultShell,
		homeDirectory: os.homedir().toPosix(),
		cwd: cwd.toPosix(),
	})
}
