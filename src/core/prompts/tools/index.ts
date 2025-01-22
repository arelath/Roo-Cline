import { renderTemplate } from "../template-loader"
import { getReadFileDescription } from "./read-file"
import { getWriteToFileDescription } from "./write-to-file"
import { getSearchFilesDescription } from "./search-files"
import { getListFilesDescription } from "./list-files"
import { getListCodeDefinitionNamesDescription } from "./list-code-definition-names"
import { getBrowserActionDescription } from "./browser-action"
import { getAskFollowupQuestionDescription } from "./ask-followup-question"
import { getAttemptCompletionDescription } from "./attempt-completion"
import { getUseMcpToolDescription } from "./use-mcp-tool"
import { getAccessMcpResourceDescription } from "./access-mcp-resource"
import { DiffStrategy } from "../../diff/DiffStrategy"
import { McpHub } from "../../../services/mcp/McpHub"
import { Mode, ToolName, getModeConfig, isToolAllowedForMode } from "../../../shared/modes"
import { ToolArgs } from "./types"
import * as vscode from "vscode"

// Map of tool names to their description functions
const toolDescriptionMap: Record<string, (args: ToolArgs) => string | Promise<string> | undefined> = {
	execute_command: async (args) => renderTemplate("tools.execute_command", args),
	read_file: (args) => renderTemplate("tools.read_file", args),
	write_to_file: (args) => renderTemplate("tools.write_to_file", args),
	search_files: (args) => renderTemplate("tools.search_files", args),
	list_files: (args) => renderTemplate("tools.list_files", args),
	list_code_definition_names: (args) => renderTemplate("tools.list_code_definition_names", args),
	browser_action: (args) => renderTemplate("tools.browser_action", args),
	ask_followup_question: (args) => renderTemplate("tools.ask_followup_question", args),
	attempt_completion: (args) => renderTemplate("tools.attempt_completion", args),
	use_mcp_tool: (args) => renderTemplate("tools.use_mcp_tool", args),
	access_mcp_resource: (args) => renderTemplate("tools.access_mcp_resource", args),
	apply_diff: (args) =>
		args.diffStrategy ? args.diffStrategy.getToolDescription({ cwd: args.cwd, toolOptions: args.toolOptions }) : "",
}

export function getToolDescriptionsForMode(context: ToolArgs): string {
	const config = getModeConfig(context.mode)

	// Map tool descriptions in the exact order specified in the mode's tools array
	const descriptions = config.tools.map(([toolName, toolOptions]) => {
		const descriptionFn = toolDescriptionMap[toolName]
		if (!descriptionFn || !isToolAllowedForMode(toolName as ToolName, context.mode)) {
			return undefined
		}

		context.toolOptions = toolOptions

		return descriptionFn(context)
	})

	return `# Tools\n\n${descriptions.filter(Boolean).join("\n\n")}`
}

// Export individual description functions for backward compatibility
export {
	getReadFileDescription,
	getWriteToFileDescription,
	getSearchFilesDescription,
	getListFilesDescription,
	getListCodeDefinitionNamesDescription,
	getBrowserActionDescription,
	getAskFollowupQuestionDescription,
	getAttemptCompletionDescription,
	getUseMcpToolDescription,
	getAccessMcpResourceDescription,
}
