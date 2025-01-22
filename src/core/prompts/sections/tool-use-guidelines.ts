import { renderTemplate } from "../template-loader"
import { ToolArgs } from "../tools/types"

export function getToolUseGuidelinesSection(context: ToolArgs): Promise<string> {
	return renderTemplate("tool-use-guidelines", context)
}
