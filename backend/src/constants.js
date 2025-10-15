// MongoDB database name
export const DB_NAME = "eduone";

// Pre-built subject collections
export const SUBJECT_COLLECTIONS = {
    DSA: 'dsa_collection',
    OS: 'os_collection',
    DBMS: 'dbms_collection',
    CN: 'cn_collection',
    // Add more subjects as needed
};

// Temporary upload collection
export const TEMP_COLLECTION = 'temp_uploads';

// Create prompt template for RAG:- PDF-QA feature
export const QA_PROMPT = {
    system: 'You are a helpful assistant answering questions based on provided context. If the answer is not in the context, say so.',
    human: (contextText) =>
        `Context: \n${contextText} \n\n
        Question: {query} \n\n
        Answer:
        `
}

