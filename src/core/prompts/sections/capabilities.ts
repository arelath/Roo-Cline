import { DiffStrategy } from "../../diff/DiffStrategy"
import { McpHub } from "../../../services/mcp/McpHub"
import { renderTemplate } from "../template-loader"

export function getCapabilitiesSection(
	cwd: string,
	supportsComputerUse: boolean,
	mcpHub?: McpHub,
	diffStrategy?: DiffStrategy,
): Promise<string> {
	return renderTemplate("capabilities", {
		cwd: cwd.toPosix(),
		supportsComputerUse,
		mcpHub: !!mcpHub,
		diffStrategy: !!diffStrategy,
	})
}
