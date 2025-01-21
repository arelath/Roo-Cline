import * as Handlebars from "handlebars"
import * as fs from "fs/promises"
import * as path from "path"
import * as vscode from "vscode"

export interface TemplateCache {
	[key: string]: Handlebars.TemplateDelegate
}

const templateCache: TemplateCache = {}

export async function loadTemplate(
	templateName: string,
	extensionContext?: vscode.ExtensionContext,
): Promise<Handlebars.TemplateDelegate> {
	if (templateCache[templateName]) {
		return templateCache[templateName]
	}

	let templatePath: string
	if (extensionContext) {
		// Use extension context to resolve path during runtime
		templatePath = path.join(
			extensionContext.extensionPath,
			"dist",
			"core",
			"prompts",
			"templates",
			`${templateName}.hbs`,
		)
	} else {
		// Fallback to __dirname for development
		templatePath = path.join(__dirname, "templates", `${templateName}.hbs`)
	}

	try {
		const templateContent = await fs.readFile(templatePath, "utf-8")
		const template = Handlebars.compile(templateContent)
		templateCache[templateName] = template
		return template
	} catch (error) {
		console.error(`Error loading template ${templateName} from ${templatePath}:`, error)
		throw error
	}
}

export async function renderTemplate(
	templateName: string,
	context: object,
	extensionContext: vscode.ExtensionContext,
): Promise<string> {
	const template = await loadTemplate(templateName, extensionContext)
	return template(context)
}
