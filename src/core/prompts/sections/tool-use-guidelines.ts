import { renderTemplate } from "../template-loader"

export function getToolUseGuidelinesSection(): Promise<string> {
	return renderTemplate("tool-use-guidelines", {})
}
