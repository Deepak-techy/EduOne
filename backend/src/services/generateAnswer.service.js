import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

import { geminiModel } from '../config/gemini.config.js';
import { QA_PROMPT, GENERATE_TAGS_PROMPT } from '../constants.js';
import { searchSimilarContentInNotesCollection } from '../services/vector.service.js';

// Generate contextual answer from retrieved documents
// Uses Gemini API via LangChain's ChatGoogleGenerativeAI
export const generateAnswer = async (query, context) => {
    const contextText = context.map(doc => doc.pageContent).join('\n\n');

    const prompt = ChatPromptTemplate.fromMessages([
        ['system', QA_PROMPT.system],
        ['human', QA_PROMPT.human],
    ]);

    const chain = prompt.pipe(geminiModel);
    const response = await chain.invoke({
        query,
        contextText
    });

    return response.content;
};


// Answer user questions based on uploaded notes or documents
export const answerQuestionFromNotesDocument = async (question, collectionName, noteId) => {
    try {
        // Retrieve relevant chunks from Qdrant
        const searchResults = await searchSimilarContentInNotesCollection(collectionName, question, 5);

        // Filter only chunks related to this specific note
        const relevantChunks = searchResults
            .filter(result => {
                const noteIdField = result.payload?.noteId || result.metadata?.noteId;
                return noteIdField === noteId;
            })
            .map(result => ({
                pageContent: result.payload?.text || result.pageContent,
            }));

        // Handle case where no relevant content was found
        if (relevantChunks.length === 0) {
            return 'No relevant information found in the uploaded document for this question.';
        }

        // Use existing generateAnswer() to get contextual response
        const answer = await generateAnswer(question, relevantChunks);

        return answer;
    } catch (error) {
        console.error('Error answering question:', error);
        throw new Error('Failed to answer the question from document');
    }
};


// Generate AI-powered tags based on note content
export const generateAITags = async (content, subject) => {
    try {
        const prompt = ChatPromptTemplate.fromMessages([
            ["system", GENERATE_TAGS_PROMPT.system],
            ["human", GENERATE_TAGS_PROMPT.human],
        ]);

        // Build chain: prompt → model → string parser
        const chain = prompt.pipe(geminiModel).pipe(new StringOutputParser());
        const tagsString = await chain.invoke({
            subject: subject,
            content: content.substring(0, 1000), // Limit content length for efficiency
        });

        // Parse tags from response
        const tags = tagsString
            .split(',')
            .map((tag) => tag.trim().toLowerCase())
            .filter((tag) => tag.length > 0);

        return tags;
    } catch (error) {
        console.error('Error generating AI tags:', error);
        throw new Error('Failed to generate AI tags');
    }
};