import { DiffStrategy } from "../../diff/DiffStrategy"
import { McpHub } from "../../../services/mcp/McpHub"
import { renderTemplate } from "../template-loader"
import { ToolArgs } from "../tools/types"

export function getCapabilitiesSection(context: ToolArgs): Promise<string> {
	return renderTemplate("capabilities", context)
}
