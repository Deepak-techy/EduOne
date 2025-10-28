import { QdrantClient } from '@qdrant/js-client-rest';
import axios from 'axios';

export const qdrantClient = new QdrantClient({
    url: process.env.QDRANT_URL || 'http://localhost:6333',
    timeout: 60000,
    checkCompatibility: false
});

// Test Qdrant connection and display status
export const connectQdrant = async () => {
    try {
        // Use axios to check Qdrant health
        const response = await axios.get(`${process.env.QDRANT_URL || 'http://localhost:6333'}`);

        const info = await qdrantClient.getCollections();

        if (response.data && response.data.version) {
            const host = (process.env.QDRANT_URL || 'http://localhost:6333')
                .replace('http://', '')
                .replace('https://', '');

            console.log(`✅ QDRANT Connected !! Host: ${host}`);
            console.log("Access web UI at http://127.0.0.1:6333/dashboard")
            console.log(`   Version: ${response.data.version} | Title: ${response.data.title}`);
            console.log(`   Collections: ${info.collections.length} found`);
            return true;
        }
    } catch (error) {
        console.log('❌ QDRANT Connection Failed !!');
        console.log(`   Error: ${error.message}`);
        console.log('⚠️  Please start Qdrant by running: qdrant');
        console.log(`   Expected at: ${process.env.QDRANT_URL || 'http://localhost:6333'}`);
        return false;
    }
};