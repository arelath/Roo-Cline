import { renderTemplate } from "../template-loader"
import { PromptContext } from "../system"
import * as vscode from "vscode"

export function getObjectiveSection(
	extensionContext: vscode.ExtensionContext,
	context: PromptContext,
): Promise<string> {
	return renderTemplate("objective", context, extensionContext)
}
