/**
 * @fileOverview Service for interacting with the LlamaCloud API.
 */

/**
 * Calls the LlamaCloud API to extract information from a document.
 *
 * @param query The user's query to send to the agent.
 * @returns A promise that resolves to the data extracted by LlamaCloud.
 */
export async function callLlamaCloud(query: string): Promise<string> {
  console.log(`Calling LlamaCloud with query: "${query}"`);

  const apiKey = process.env.LLAMACLOUD_API_KEY;

  if (!apiKey) {
    console.warn("LlamaCloud API key not found. Returning mock data.");
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
    return "No se ha encontrado la clave de la API de LlamaCloud. Por favor, configúrala en el archivo .env para conectar con el servicio.";
  }

  try {
    // This is an example endpoint. You might need to adjust it based on LlamaCloud's documentation.
    // LlamaParse is often used for document extraction.
    const response = await fetch('https://api.cloud.llamaindex.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      // The payload will vary depending on the specific LlamaCloud service (LlamaParse, etc.)
      // This is a generic chat completions payload.
      body: JSON.stringify({
        model: 'gpt-3.5-turbo', // Specify the model you want to use
        messages: [
            { 
                role: 'system', 
                content: 'You are a helpful assistant that extracts information from documents.' 
            },
            {
                role: 'user', 
                content: query 
            }
        ],
      })
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error(`LlamaCloud API error: ${response.status} ${response.statusText}`, errorBody);
        throw new Error(`Failed to fetch data from LlamaCloud. Status: ${response.status}`);
    }

    const data = await response.json();
    
    // The structure of the response might differ. Adjust according to the actual API response.
    if (data.choices && data.choices.length > 0 && data.choices[0].message) {
      return data.choices[0].message.content;
    } else {
      return "The LlamaCloud API returned an unexpected response structure.";
    }

  } catch (error) {
    console.error("Error calling LlamaCloud service:", error);
    // Provide a user-friendly error message
    return `An error occurred while communicating with LlamaCloud. Please check the server logs for details.`;
  }
}
