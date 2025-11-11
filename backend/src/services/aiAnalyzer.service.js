import { ChatPromptTemplate } from '@langchain/core/prompts';

import { geminiModel } from '../config/gemini.config.js';
import { ANALYZE_RESUME_PROMPT } from '../constants.js';

const analyzeResume = async (resumeText, fullName, jobRole, experienceLevel, jobDescription) => {
    try {
        const prompt = ChatPromptTemplate.fromMessages([
            ['system', ANALYZE_RESUME_PROMPT.system],
            ['human', ANALYZE_RESUME_PROMPT.human],
        ])

        const chain = prompt.pipe(geminiModel);
        const response = await chain.invoke({
            resumeText,
            fullName,
            jobRole,
            experienceLevel,
            jobDescription
        })

        // Extract and parse JSON response
        let analysisResult;
        try {
            // Remove markdown code blocks if present
            // let cleanedResponse = response.content.trim() ?? response.trim();
            // cleanedResponse = cleanedResponse.replace(/``````\n?/g, '');
            
            let cleanedResponse =
                typeof response.content === "string"
                    ? response.content.trim()
                    : Array.isArray(response.content)
                        ? response.content[0]?.text?.trim()
                        : response.trim();

            cleanedResponse = cleanedResponse.replace(/```(?:json)?/g, '').trim();
            analysisResult = JSON.parse(cleanedResponse);
        } catch (parseError) {
            throw new Error(`Failed to parse AI response: ${parseError.message}`);
        }

        return analysisResult;
    } catch (error) {
        throw new Error(`AI analysis failed: ${error.message}`);
    }
}

export { analyzeResume };