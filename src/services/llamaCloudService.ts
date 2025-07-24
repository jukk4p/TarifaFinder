/**
 * @fileOverview Service for interacting with the LlamaParse API.
 */

const LLAMA_CLOUD_API_KEY = process.env.LLAMACLOUD_API_KEY;
const BASE_URL = "https://api.cloud.llamaindex.ai/api/parsing";

// Helper to convert data URI to Blob
function dataURIToBlob(dataURI: string) {
    const splitDataURI = dataURI.split(',');
    const byteString = atob(splitDataURI[1]);
    const mimeString = splitDataURI[0].split(':')[1].split(';')[0];
    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], { type: mimeString });
}


/**
 * Polls the LlamaParse job status until it's completed.
 * @param jobId The ID of the parsing job.
 * @returns A promise that resolves when the job is complete.
 */
async function pollJobStatus(jobId: string): Promise<void> {
    const maxRetries = 20;
    const delay = 3000; // 3 seconds

    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await fetch(`${BASE_URL}/job/${jobId}`, {
                headers: {
                    'Authorization': `Bearer ${LLAMA_CLOUD_API_KEY}`,
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                console.warn(`Polling failed with status ${response.status}. Retrying...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                continue;
            }

            const result = await response.json();
            if (result.status === 'SUCCESS') {
                console.log('Parsing job completed successfully.');
                return;
            }
             if (result.status === 'ERROR') {
                throw new Error(`Parsing job failed with message: ${result.message}`);
            }

            console.log(`Job status: ${result.status}. Waiting...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        } catch (error) {
            console.error('Error during polling:', error);
             await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    throw new Error('Parsing job timed out.');
}


/**
 * Calls the LlamaParse API to extract markdown content from a document.
 * This involves three steps:
 * 1. Upload the document to start the parsing job.
 * 2. Poll the job status until it's complete.
 * 3. Fetch the parsed result as markdown.
 *
 * @param document The document to analyze, as a base64 data URI.
 * @returns A promise that resolves to the parsed markdown content.
 */
export async function callLlamaParse(document: string): Promise<string> {
    if (!LLAMA_CLOUD_API_KEY) {
        const errorMessage = "LlamaCloud API key not found. Please configure it in the .env file to connect to the service.";
        console.error(errorMessage);
        return errorMessage;
    }

    try {
        // Step 1: Upload the document
        console.log("Uploading document to LlamaParse...");
        const blob = dataURIToBlob(document);
        const formData = new FormData();
        formData.append('file', blob, 'document_to_parse');

        const uploadResponse = await fetch(`${BASE_URL}/upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${LLAMA_CLOUD_API_KEY}`,
                'Accept': 'application/json',
            },
            body: formData,
        });

        if (!uploadResponse.ok) {
            const errorText = await uploadResponse.text();
            throw new Error(`LlamaParse upload failed with status ${uploadResponse.status}: ${errorText}`);
        }

        const uploadResult = await uploadResponse.json();
        const jobId = uploadResult.id;
        console.log(`Started parsing job with ID: ${jobId}`);

        // Step 2: Poll for job completion
        await pollJobStatus(jobId);

        // Step 3: Fetch the parsed result
        console.log("Fetching parsed markdown result...");
        const resultResponse = await fetch(`${BASE_URL}/job/${jobId}/result/markdown`, {
            headers: {
                'Authorization': `Bearer ${LLAMA_CLOUD_API_KEY}`,
                'Accept': 'application/json',
            },
        });

        if (!resultResponse.ok) {
            const errorText = await resultResponse.text();
            throw new Error(`Failed to get LlamaParse result with status ${resultResponse.status}: ${errorText}`);
        }
        
        const resultData = await resultResponse.json();
        return resultData.markdown;

    } catch (error) {
        console.error("Error calling LlamaParse service:", error);
        if (error instanceof Error) {
            return `An error occurred while communicating with LlamaParse: ${error.message}`;
        }
        return `An unknown error occurred while communicating with LlamaParse.`;
    }
}
