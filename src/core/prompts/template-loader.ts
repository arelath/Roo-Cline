import * as Handlebars from "handlebars"
import * as fs from "fs/promises"
import * as path from "path"
import * as vscode from "vscode"
import { PromptContext } from "./system"

export interface TemplateCache {
	[key: string]: Handlebars.TemplateDelegate
}

const templateCache: TemplateCache = {}

export async function loadTemplate(
	templateName: string,
	extensionContext?: vscode.ExtensionContext,
	context?: PromptContext,
): Promise<Handlebars.TemplateDelegate> {
	// Check for local template override if context.cwd is provided
	if (context?.cwd) {
		const localTemplatePath = path.join(context.cwd, `.clinerules-${templateName}`)
		try {
			const templateContent = await fs.readFile(localTemplatePath, "utf-8")
			// Don't cache local template content since it may change
			return Handlebars.compile(templateContent)
		} catch (error) {
			// Local template not found, fall through to default template
		}
	}

	// Use cached default template if available
	if (templateCache[templateName]) {
		return templateCache[templateName]
	}

	// Load default template
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
		// Only cache default templates
		templateCache[templateName] = template
		return template
	} catch (error) {
		console.error(`Error loading template ${templateName} from ${templatePath}:`, error)
		throw error
	}
}

export async function renderTemplate(
	templateName: string,
	context: PromptContext,
	extensionContext: vscode.ExtensionContext,
): Promise<string> {
	const template = await loadTemplate(templateName, extensionContext, context)
	return template(context)
}
