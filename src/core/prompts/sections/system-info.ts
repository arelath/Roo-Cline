import defaultShell from "default-shell"
import os from "os"
import osName from "os-name"
import { renderTemplate } from "../template-loader"
import * as vscode from "vscode"

export async function getSystemInfoSection(extensionContext: vscode.ExtensionContext, cwd: string): Promise<string> {
	return renderTemplate(
		"system-info",
		{
			osName: osName(),
			defaultShell,
			homeDirectory: os.homedir().toPosix(),
			cwd: cwd.toPosix(),
		},
		extensionContext,
	)
}
