import { renderTemplate } from "../template-loader"

export function getObjectiveSection(): Promise<string> {
	return renderTemplate("objective", {})
}
