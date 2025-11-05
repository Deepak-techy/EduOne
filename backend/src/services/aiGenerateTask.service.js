import { ChatPromptTemplate } from '@langchain/core/prompts';

import { geminiModel } from "../config/gemini.config.js";
import { ACADEMIC_TASK_PRIORITIZER_PROMPT } from "../constants.js";

const generateAIBasedDailyPriorities = async (tasks) => {
    try {
        // Format tasks for AI analysis
        const taskDetails = tasks.map(task => ({
            subject: task.subject,
            task: task.task,
            deadline: task.dueDate,
            priority: task.priority,
            daysRemaining: Math.ceil((new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24))
        }));

        const prompt = ChatPromptTemplate.fromMessages([
            ['system', ACADEMIC_TASK_PRIORITIZER_PROMPT.system],
            ['human', ACADEMIC_TASK_PRIORITIZER_PROMPT.human],
        ])

        const chain = prompt.pipe(geminiModel);
        const response = await chain.invoke({
            taskDetails: JSON.stringify(taskDetails, null, 2),
        });

        // Parse AI response to get task indices
        const selectedIndices = JSON.parse(response.content ?? response);

        // Return the top 5 tasks based on AI selection
        return selectedIndices
            .slice(0, 5)
            .map(index => tasks[index])
            .filter(task => task);

    } catch (error) {
        console.error('AI Service Error:', error);

        // Fallback: return tasks sorted by priority and deadline
        return tasks
            .sort((a, b) => {
                const priorityOrder = { High: 3, Medium: 2, Low: 1 };
                const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
                if (priorityDiff !== 0) return priorityDiff;
                return new Date(a.dueDate) - new Date(b.dueDate);
            })
            .slice(0, 5);
    }
}

export { generateAIBasedDailyPriorities }