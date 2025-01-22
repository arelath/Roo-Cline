import { renderTemplate } from "../template-loader"
import { ToolArgs } from "../tools/types"

export function getObjectiveSection(context: ToolArgs): Promise<string> {
	return renderTemplate("objective", context)
}
