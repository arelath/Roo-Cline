import { DiffStrategy } from "../../diff/DiffStrategy"
import { McpHub } from "../../../services/mcp/McpHub"
import * as vscode from "vscode"
import { Mode, PromptComponent } from "../../../shared/modes"

export type ToolArgs = {
	cwd: string
	supportsComputerUse: boolean
	extensionContext: vscode.ExtensionContext
	mode: Mode
	diffStrategy?: DiffStrategy
	browserViewportSize?: string
	mcpHub?: McpHub
	toolOptions?: any
	promptComponent?: PromptComponent
}
