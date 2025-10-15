import pdf from 'pdf-parse';
import fs from 'fs/promises';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

// Extract text from PDF file
export const extractTextFromPDF = async (filePath) => {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
};

// Split text into chunks for better retrieval
// RecursiveCharacterTextSplitter ensures semantic coherence
export const chunkText = async (text) => {
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    });

    const chunks = await splitter.splitText(text);
    return chunks;
};
