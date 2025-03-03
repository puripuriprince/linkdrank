const { HfInference } = require('@huggingface/inference');

// Initialize Hugging Face client
const hf = new HfInference(process.env.HF_ACCESS_TOKEN);
const MODEL_ID = process.env.HF_MODEL_ID || 'sentence-transformers/all-mpnet-base-v2';

/**
 * Generate embedding vector for a given text
 * @param {string} text - Text to vectorize
 * @returns {Promise<Array<number>>} - Vector representation
 */
async function generateEmbedding(text) {
  try {
    // Ensure the text isn't too long for the model
    const processedText = text.slice(0, 8000);
    // Get embedding from Hugging Face
    const response = await hf.featureExtraction({ model: MODEL_ID, inputs: processedText });
    return Array.isArray(response) ? response : response.tolist();
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw new Error('Failed to generate text embedding');
  }
}

module.exports = { generateEmbedding };
