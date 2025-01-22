import { renderTemplate } from "../template-loader"
import { ToolArgs } from "../tools/types"

export async function getSharedToolUseSection(context: ToolArgs): Promise<string> {
	return renderTemplate("tool-use", context)
}
