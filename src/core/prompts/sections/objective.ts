import { renderTemplate } from "../template-loader"
import * as vscode from "vscode"

export function getObjectiveSection(extensionContext: vscode.ExtensionContext): Promise<string> {
	return renderTemplate("objective", {}, extensionContext)
}
