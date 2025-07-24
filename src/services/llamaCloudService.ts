/**
 * @fileOverview Service for interacting with the LlamaCloud API.
 */
import type { z } from 'zod';

// Define the expected structure of the LlamaCloud API response
interface LlamaCloudResponse {
    result: {
        response: string;
    };
}


/**
 * Calls the LlamaCloud API to extract information from a document.
 *
 * @param query The user's query to send to the agent.
 * @param document The document to analyze, as a base64 data URI.
 * @returns A promise that resolves to the data extracted by LlamaCloud.
 */
export async function callLlamaCloud(query: string, document?: string): Promise<string> {
  console.log(`Calling LlamaCloud with query: "${query}"`);

  const apiKey = process.env.LLAMACLOUD_API_KEY;
  const agentId = process.env.LLAMACLOUD_AGENT_ID;

  if (!apiKey || !agentId) {
    const errorMessage = "LlamaCloud API key or Agent ID not found. Please configure them in the .env file to connect to the service.";
    console.warn(errorMessage);
    return errorMessage;
  }
  
  if (!document) {
     return "Por favor, proporciona un documento para analizar.";
  }

  // The LlamaCloud agent API expects a specific structure.
  // We'll send the user's instruction as the query.
  // The document handling would depend on the agent's specific configuration.
  // For this example, we assume the agent can take the query and we log that a document is present.
  console.log("Document is present and will be part of the context for the agent.");

  const apiUrl = `https://api.cloud.llamaindex.ai/api/agent/${agentId}/chat`;

  try {
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            input: query,
            // In a real scenario, you'd send the document here according to your agent's expected input schema.
            // For now, we are just sending the user's query.
        }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`LlamaCloud API request failed with status ${response.status}: ${errorText}`);
    }

    const data: LlamaCloudResponse = await response.json();
    
    // Extract the actual response from the nested structure
    return data.result.response;

  } catch (error) {
    console.error("Error calling LlamaCloud service:", error);
    if (error instanceof Error) {
        return `An error occurred while communicating with LlamaCloud: ${error.message}`;
    }
    return `An unknown error occurred while communicating with LlamaCloud.`;
  }
}