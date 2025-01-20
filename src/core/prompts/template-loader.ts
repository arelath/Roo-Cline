import * as Handlebars from "handlebars"
import * as fs from "fs/promises"
import * as path from "path"

export interface TemplateCache {
	[key: string]: Handlebars.TemplateDelegate
}

const templateCache: TemplateCache = {}

export async function loadTemplate(templateName: string): Promise<Handlebars.TemplateDelegate> {
	if (templateCache[templateName]) {
		return templateCache[templateName]
	}

	const templatePath = path.join(__dirname, "templates", `${templateName}.hbs`)
	try {
		const templateContent = await fs.readFile(templatePath, "utf-8")
		const template = Handlebars.compile(templateContent)
		templateCache[templateName] = template
		return template
	} catch (error) {
		console.error(`Error loading template ${templateName}:`, error)
		throw error
	}
}

export async function renderTemplate(templateName: string, context: object): Promise<string> {
	const template = await loadTemplate(templateName)
	return template(context)
}
