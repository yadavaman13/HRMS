import { ChatGoogle } from '@langchain/google';
import { ChatMistralAI, MistralAIEmbeddings } from '@langchain/mistralai';
import { createAgent, modelCallLimitMiddleware } from 'langchain';
import {
    emailTool,
    getCurrentDateTimeTool,
    searchInternetTool,
    createContextRetrieverTool,
} from './tools.ai.service.js';
import envConfig from '../../config/env.config.js';
import { DocumentSummaryStructure } from './response-structure.ai.service.js';
import { createHrmsTools } from './hrms-tools/index.js';

/**
 * System prompt for the tool-calling AI agents.
 * Outlines rules for tool usage, time/date queries, and uncertainty handling.
 */
const getToolAgentSystemPrompt = () => {
    const now = new Date();
    const dateString = now.toLocaleString('en-US', {
        timeZone: 'Asia/Kolkata',
        dateStyle: 'full',
    });
    return `You are an AI assistant that can use tools when needed.

Rules:

* If data is real-time, future, or uncertain → use tools
* Never guess unknown facts
* Never claim tool usage unless actually called
* If tool is needed → return ONLY tool call
* Otherwise → return final answer

Time Awareness:

* Today's date is: ${dateString}.
* Whenever the user asks for 'latest', 'current', 'today', 'recent', or 'this year', always treat the current year as 2026.
* If the user asks about current time, date, today, or now → MUST call the 'getCurrentDateTimeTool' tool
* Never guess current time or date
* Never answer time-related queries from memory
* Always rely on the tool for accurate time information

If unsure → use tools, not reasoning.`;
};

// ==========================================
// Google Gemini Models & Agent Factories
// ==========================================

/**
 * Primary Google GenAI Chat model.
 * Uses the high-capability 'gemma-4-31b-it' model.
 */
const geminiModel = new ChatGoogle({
    model: 'gemma-4-31b-it',
    apiKey: envConfig.GEMINI_API_KEY,
    maxConcurrency: 3,
    thinkingConfig: {
        includeThoughts: false,
    },
});

/**
 * Creates and configures a Gemini AI Agent instance scoped to a specific chat context.
 *
 * @param {string} [chatId] - The ID of the current chat session to scope search context.
 * @returns {import("langchain").Agent} Configured LangChain agent instance.
 */
export function getGeminiAgent(chatId) {
    const contextRetrieverToolForChat = createContextRetrieverTool(chatId);

    return createAgent({
        model: geminiModel,
        systemPrompt: getToolAgentSystemPrompt(),
        tools: [emailTool, searchInternetTool, getCurrentDateTimeTool, contextRetrieverToolForChat],
        middleware: [
            modelCallLimitMiddleware({
                runLimit: 5,
                exitBehavior: 'end',
            }),
        ],
    });
}

/**
 * Scopeless default Gemini agent instance.
 */
export const geminiAgent = getGeminiAgent();

/**
 * Fallback Gemini Chat model.
 * Uses the faster, highly-available 'gemini-1.5-flash' model.
 */
const geminiFallbackModel = new ChatGoogle({
    model: 'gemini-3.1-flash-lite',
    apiKey: envConfig.GEMINI_API_KEY,
    maxConcurrency: 5,
    thinkingConfig: {
        includeThoughts: false,
    },
});

/**
 * Creates and configures a Fallback Gemini AI Agent instance scoped to a specific chat context.
 *
 * @param {string} [chatId] - The ID of the current chat session to scope search context.
 * @returns {import("langchain").Agent} Configured LangChain fallback agent instance.
 */
export function getGeminiFallbackAgent(chatId) {
    const contextRetrieverToolForChat = createContextRetrieverTool(chatId);

    return createAgent({
        model: geminiFallbackModel,
        systemPrompt: getToolAgentSystemPrompt(),
        tools: [emailTool, searchInternetTool, getCurrentDateTimeTool, contextRetrieverToolForChat],
        middleware: [
            modelCallLimitMiddleware({
                runLimit: 5,
                exitBehavior: 'end',
            }),
        ],
    });
}

/**
 * Scopeless fallback Gemini agent instance.
 */
export const geminiFallbackAgent = getGeminiFallbackAgent();

/**
 * Model specifically configured for document summarization tasks.
 */
export const geminiSummariseModel = new ChatGoogle({
    model: 'gemini-3.1-flash-lite',
    apiKey: envConfig.GEMINI_API_KEY,
    maxConcurrency: 5,
    thinkingConfig: {
        includeThoughts: false,
    },
});

/**
 * Agent specialized in parsing and summarising documents into structured metadata.
 */
export const geminiSummariseAgent = createAgent({
    model: geminiSummariseModel,
    responseFormat: DocumentSummaryStructure,
});

// ==========================================
// Mistral AI Models & Agent Factories
// ==========================================

/**
 * Primary Mistral Chat model.
 * Uses the high-capability 'mistral-medium-latest' model.
 */
const mistralModel = new ChatMistralAI({
    model: 'mistral-medium-latest',
    apiKey: envConfig.MISTRAL_API_KEY,
    maxConcurrency: 3,
});

/**
 * Mistral Embedding model used for vector representations.
 */
const mistralEmbeddingModel = new MistralAIEmbeddings({
    apiKey: envConfig.MISTRAL_API_KEY,
    model: 'mistral-embed',
});

/**
 * Creates and configures a Mistral AI Agent instance scoped to a specific chat context.
 *
 * @param {string} [chatId] - The ID of the current chat session to scope search context.
 * @returns {import("langchain").Agent} Configured LangChain Mistral agent instance.
 */
export function getMistralAgent(chatId) {
    const contextRetrieverToolForChat = createContextRetrieverTool(chatId);

    return createAgent({
        model: mistralModel,
        systemPrompt: getToolAgentSystemPrompt(),
        tools: [emailTool, searchInternetTool, getCurrentDateTimeTool, contextRetrieverToolForChat],
        middleware: [
            modelCallLimitMiddleware({
                runLimit: 5,
                exitBehavior: 'end',
            }),
        ],
    });
}

/**
 * Scopeless default Mistral agent instance.
 */
export const mistralAgent = getMistralAgent();

export { geminiModel, mistralModel, mistralEmbeddingModel };

// ==========================================
// HRMS Dedicated Agent Factories & Prompt
// ==========================================

const getHrmsSystemPrompt = (hrmsContext) => {
    const tz = hrmsContext.organizationTimezone || 'Asia/Kolkata';
    const dateString = new Date().toLocaleString('en-US', {
        timeZone: tz,
        dateStyle: 'full',
        timeStyle: 'short',
    });
    return `You are Apex HR Copilot — an AI assistant for the Dayflow HRMS platform.

## Current Context
- Date/Time (org timezone ${tz}): ${dateString}
- Authenticated user role: ${hrmsContext.role}

## Tool Routing Rules (MANDATORY)
- Static/general question (e.g. "what is gross salary?") → answer directly, NO tool call
- Live HR data (e.g. "how many leaves do I have?") → use appropriate HRMS tool
- Company policy/document → use contextRetrieverTool
- External/real-time info → use searchInternetTool
- Date/time query → use getCurrentDateTimeTool
- Leave application → use create_leave_request (two-step: preview then confirm)

## Date Handling Policy
- Relative dates ("today", "this month", "last week") MUST use org timezone (${tz}).
- Call getCurrentDateTimeTool to get the accurate current date before time-sensitive queries.
- NEVER default to UTC or server timezone.

## Security Rules (never violate)
1. Never request or accept organizationId as a tool argument — it is resolved server-side.
2. Never expose bank account numbers, PAN, UAN, Aadhaar, or any private info fields.
3. If a tool returns FORBIDDEN, tell the user they lack access — do not retry.
4. For employee role: data is always scoped to the authenticated employee's own records.

## Mutation Confirmation
- Always show the full preview (dates, leave type, days, balance impact) before confirming.
- Ask explicitly: "Shall I submit this leave request?"
- Only call confirmed=true after the user gives explicit approval.

## Response Style
- Be concise and data-focused. Format amounts in ₹.
- If a tool returns an error, explain naturally without exposing raw error codes.`;
};

export function getHrmsAgent(chatId, hrmsContext) {
    const hrmsTools = createHrmsTools(hrmsContext);
    const contextRetrieverToolForChat = createContextRetrieverTool(chatId);
    return createAgent({
        model: geminiModel,
        systemPrompt: getHrmsSystemPrompt(hrmsContext),
        tools: [
            ...hrmsTools,
            emailTool,
            searchInternetTool,
            getCurrentDateTimeTool,
            contextRetrieverToolForChat,
        ],
        middleware: [modelCallLimitMiddleware({ runLimit: 10, exitBehavior: 'end' })],
    });
}

export function getHrmsFallbackAgent(chatId, hrmsContext) {
    const hrmsTools = createHrmsTools(hrmsContext);
    const contextRetrieverToolForChat = createContextRetrieverTool(chatId);
    return createAgent({
        model: geminiFallbackModel,
        systemPrompt: getHrmsSystemPrompt(hrmsContext),
        tools: [
            ...hrmsTools,
            emailTool,
            searchInternetTool,
            getCurrentDateTimeTool,
            contextRetrieverToolForChat,
        ],
        middleware: [modelCallLimitMiddleware({ runLimit: 10, exitBehavior: 'end' })],
    });
}
