import { Mode, modes, CustomPrompts, PromptComponent, getRoleDefinition, defaultModeSlug } from "../../shared/modes"
import { DiffStrategy } from "../diff/DiffStrategy"
import { McpHub } from "../../services/mcp/McpHub"
import { getToolDescriptionsForMode } from "./tools"
import {
	getRulesSection,
	getSystemInfoSection,
	getObjectiveSection,
	getSharedToolUseSection,
	getMcpServersSection,
	getToolUseGuidelinesSection,
	getCapabilitiesSection,
} from "./sections"
import fs from "fs/promises"
import path from "path"
import * as vscode from "vscode"

export type PromptContext = {
	cwd: string
	supportsComputerUse: boolean
	mode: Mode
	mcpHub?: McpHub
	diffStrategy?: DiffStrategy
	browserViewportSize?: string
	promptComponent?: PromptComponent
}

async function loadRuleFiles(cwd: string, mode: Mode): Promise<string> {
	let combinedRules = ""

	// First try mode-specific rules
	const modeSpecificFile = `.clinerules-${mode}`
	try {
		const content = await fs.readFile(path.join(cwd, modeSpecificFile), "utf-8")
		if (content.trim()) {
			combinedRules += `\n# Rules from ${modeSpecificFile}:\n${content.trim()}\n`
		}
	} catch (err) {
		// Silently skip if file doesn't exist
		if ((err as NodeJS.ErrnoException).code !== "ENOENT") {
			throw err
		}
	}

	// Then try generic rules files
	const genericRuleFiles = [".clinerules"]
	for (const file of genericRuleFiles) {
		try {
			const content = await fs.readFile(path.join(cwd, file), "utf-8")
			if (content.trim()) {
				combinedRules += `\n# Rules from ${file}:\n${content.trim()}\n`
			}
		} catch (err) {
			// Silently skip if file doesn't exist
			if ((err as NodeJS.ErrnoException).code !== "ENOENT") {
				throw err
			}
		}
	}

	return combinedRules
}

interface State {
	customInstructions?: string
	customPrompts?: CustomPrompts
	preferredLanguage?: string
}

export async function addCustomInstructions(state: State, cwd: string, mode: Mode = defaultModeSlug): Promise<string> {
	const ruleFileContent = await loadRuleFiles(cwd, mode)
	const allInstructions = []

	if (state.preferredLanguage) {
		allInstructions.push(`You should always speak and think in the ${state.preferredLanguage} language.`)
	}

	if (state.customInstructions?.trim()) {
		allInstructions.push(state.customInstructions.trim())
	}

	const customPrompt = state.customPrompts?.[mode]
	if (typeof customPrompt === "object" && customPrompt?.customInstructions?.trim()) {
		allInstructions.push(customPrompt.customInstructions.trim())
	}

	if (ruleFileContent && ruleFileContent.trim()) {
		allInstructions.push(ruleFileContent.trim())
	}

	const joinedInstructions = allInstructions.join("\n\n")

	return joinedInstructions
		? `
====

USER'S CUSTOM INSTRUCTIONS

The following additional instructions are provided by the user, and should be followed to the best of your ability without interfering with the TOOL USE guidelines.

${joinedInstructions}`
		: ""
}

async function generatePrompt(extensionContext: vscode.ExtensionContext, context: PromptContext): Promise<string> {
	const basePrompt = `${context.promptComponent?.roleDefinition || getRoleDefinition(context.mode)}

${await getSharedToolUseSection(extensionContext, context)}

${getToolDescriptionsForMode(extensionContext, context)}

${await getToolUseGuidelinesSection(extensionContext, context)}

${await getMcpServersSection(extensionContext, context)}

${await getCapabilitiesSection(extensionContext, context)}

${await getRulesSection(extensionContext, context)}

${await getSystemInfoSection(extensionContext, context)}

${await getObjectiveSection(extensionContext, context)}`

	return basePrompt
}

export const SYSTEM_PROMPT = async (
	extensionContext: vscode.ExtensionContext,
	cwd: string,
	supportsComputerUse: boolean,
	mcpHub?: McpHub,
	diffStrategy?: DiffStrategy,
	browserViewportSize?: string,
	mode: Mode = defaultModeSlug,
	customPrompts?: CustomPrompts,
) => {
	const getPromptComponent = (value: unknown) => {
		if (typeof value === "object" && value !== null) {
			return value as PromptComponent
		}
		return undefined
	}

	// Use default mode if not found
	const currentMode = modes.find((m) => m.slug === mode) || modes[0]
	const promptComponent = getPromptComponent(customPrompts?.[currentMode.slug])

	const context: PromptContext = {
		cwd,
		supportsComputerUse,
		mode: currentMode.slug,
		mcpHub,
		diffStrategy,
		browserViewportSize,
		promptComponent,
	}

	return generatePrompt(extensionContext, context)
}
