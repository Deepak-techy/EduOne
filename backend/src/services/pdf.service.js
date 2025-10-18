import { createRequire } from 'module';
import fs from 'fs/promises';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');

// Extract text from PDF file
export const extractTextFromPDF = async (filePath) => {
    const loader = new PDFLoader(filePath);
    const docs = await loader.load();

    // Combine all pages into single text
    const text = docs.map(doc => doc.pageContent).join('\n\n');
    return text;
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
