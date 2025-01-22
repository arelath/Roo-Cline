import defaultShell from "default-shell"
import os from "os"
import osName from "os-name"
import { renderTemplate } from "../template-loader"
import { ToolArgs } from "../tools/types"

export async function getSystemInfoSection(context: ToolArgs): Promise<string> {
	return renderTemplate("system-info", context)
}
