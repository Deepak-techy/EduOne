import fs from 'fs';
import pdf from 'pdf-parse';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

// Extract text from PDF file
export const extractTextFromPDF = async (filePath) => {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
};

// Split text into chunks for better retrieval
// RecursiveCharacterTextSplitter ensures semantic coherence
export const chunkText = async (text) => {
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1500,
        chunkOverlap: 300,
    });

    const chunks = await splitter.splitText(text);
    return chunks;
};
