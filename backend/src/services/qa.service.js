import { ChatPromptTemplate } from '@langchain/core/prompts';

import { geminiModel } from '../config/gemini.config.js';
import { QA_PROMPT } from '../constants.js';

// Generate contextual answer from retrieved documents
// Uses Gemini API via LangChain's ChatGoogleGenerativeAI
export const generateAnswer = async (query, context) => {
    const contextText = context.map(doc => doc.pageContent).join('\n\n');

    const prompt = new ChatPromptTemplate.fromMessages([
        ['system', QA_PROMPT.system],
        ['human', QA_PROMPT.human(contextText)],
    ])

    const chain = prompt.pipe(geminiModel);
    const response = await chain.invoke({ query });

    return response.content;
};
