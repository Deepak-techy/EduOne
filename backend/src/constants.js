// MongoDB database name
export const DB_NAME = "eduone";

// Pre-built subject collections
export const SUBJECT_COLLECTIONS = {
    DSA: 'dsa_collection',
    OS: 'os_collection',
    DBMS: 'dbms_collection',
    CN: 'cn_collection',
    ML: 'ml_collection',
    CP: 'cp_collection',
    NN_DL: 'nn_dl_collection',
    NLP: 'nlp_collection',
    OOPS: 'oops_collection',
    AI: 'ai_collection',
};

// Pre-built subject list
export const SUBJECT_LIST = [
    { code: 'DSA', name: 'Data Structures & Algorithms' },
    { code: 'OS', name: 'Operating Systems' },
    { code: 'DBMS', name: 'Database Management Systems' },
    { code: 'CN', name: 'Computer Networks' },
    { code: 'ML', name: 'Machine Learning' },
    { code: 'CP', name: 'C Programming' },
    { code: 'NN', name: 'Neural Networks And Deep Learning' },
    { code: 'NLP', name: 'Natural Language Processing' },
    { code: 'OOPS', name: 'Object Oriented Programming' },
    { code: 'AI', name: 'Artificial Intelligence' },
];

// Temporary upload collection
export const TEMP_COLLECTION = 'temp_uploads';

// Session timeout for temporary uploads
export const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

// Create prompt template for RAG:- PDF-QA feature
// export const QA_PROMPT = {
//     system: 'You are a helpful assistant answering questions based on provided context. If the answer is not in the context, say so.',
//     human: (contextText) =>
//         `Context: \n{contextText} \n\n
//         Question: {query} \n\n
//         Answer:
//         `
// }
export const QA_PROMPT = {
    system: `You are a helpful assistant that answers questions based on the provided context.
Your responses must always be formatted in **Markdown** for clean rendering in React Markdown.
Use appropriate Markdown elements such as:
- Headings (##)
- Code blocks ( \`\`\`language ... \`\`\` )
- Bullet or numbered lists
- Bold and italic text
If the answer is not present in the context, clearly say: "The answer is not available in the provided context."`,

    human: (contextText) => `
### 📘 Context:
{contextText}

---

### ❓ Question:
{query}

---

### 💡 Answer (in Markdown):
`
};

