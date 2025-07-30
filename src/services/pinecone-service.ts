
'use server';

import { Pinecone } from '@pinecone-database/pinecone';

let pinecone: Pinecone | null = null;

const getPineconeClient = (): Pinecone => {
  if (pinecone) {
    return pinecone;
  }

  const apiKey = process.env.PINECONE_API_KEY;
  const environment = process.env.PINECONE_ENVIRONMENT;

  if (!apiKey || !environment) {
    throw new Error('Pinecone API key or environment not set.');
  }

  pinecone = new Pinecone({
    apiKey,
  });
  
  console.log('Pinecone client initialized.');
  return pinecone;
};

export async function getPineconeIndex() {
    const client = getPineconeClient();
    const indexName = 'sailboat-listings'; // We can make this an env var later

    try {
        const index = client.index(indexName);
        // Optional: Check if the index exists and log its status
        // const description = await index.describeIndexStats();
        // console.log('Connected to Pinecone index:', description);
        return index;
    } catch (error) {
        console.error('Error connecting to Pinecone index:', error);
        throw new Error('Could not connect to Pinecone index.');
    }
}

// We will add more functions here to query, upsert, etc.
