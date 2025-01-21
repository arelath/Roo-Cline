import { DiffStrategy } from "../../diff/DiffStrategy"
import { McpHub } from "../../../services/mcp/McpHub"
import { renderTemplate } from "../template-loader"
import * as vscode from "vscode"
import { PromptContext } from "../system"

export function getCapabilitiesSection(
	extensionContext: vscode.ExtensionContext,
	context: PromptContext,
): Promise<string> {
	return renderTemplate("capabilities", context, extensionContext)
}
