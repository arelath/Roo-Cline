import { renderTemplate } from "../template-loader"
import * as vscode from "vscode"

export function getToolUseGuidelinesSection(extensionContext: vscode.ExtensionContext): Promise<string> {
	return renderTemplate("tool-use-guidelines", {}, extensionContext)
}
