import defaultShell from "default-shell"
import os from "os"
import osName from "os-name"
import { renderTemplate } from "../template-loader"
import { PromptContext } from "../system"
import * as vscode from "vscode"

export async function getSystemInfoSection(
	extensionContext: vscode.ExtensionContext,
	context: PromptContext,
): Promise<string> {
	return renderTemplate("system-info", context, extensionContext)
}
