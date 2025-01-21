import { renderTemplate } from "../template-loader"
import * as vscode from "vscode"
import { PromptContext } from "../system"

export function getToolUseGuidelinesSection(
	extensionContext: vscode.ExtensionContext,
	context: PromptContext,
): Promise<string> {
	return renderTemplate("tool-use-guidelines", context, extensionContext)
}
