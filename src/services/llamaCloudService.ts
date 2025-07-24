/**
 * @fileOverview Service for interacting with the LlamaParse and LlamaCloud Extraction Agent API.
 */

const LLAMA_CLOUD_API_KEY = process.env.LLAMACLOUD_API_KEY;
const LLAMA_AGENT_NAME = process.env.LLAMACLOUD_AGENT_NAME;
const BASE_URL = "https://api.cloud.llamaindex.ai/api/v1";

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
 * Uploads a file to LlamaCloud.
 * @param document The document to upload, as a data URI.
 * @returns The file ID from LlamaCloud.
 */
async function uploadFile(document: string): Promise<string> {
    console.log("Uploading file to LlamaCloud...");
    const blob = dataURIToBlob(document);
    const formData = new FormData();
    formData.append('upload_file', blob, 'document_to_extract.pdf'); // Changed 'file' to 'upload_file'

    const response = await fetch(`${BASE_URL}/files`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${LLAMA_CLOUD_API_KEY}`,
        },
        body: formData,
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`LlamaCloud file upload failed with status ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log(`File uploaded successfully. File ID: ${result.id}`);
    return result.id;
}

/**
 * Starts an extraction job with a specific agent.
 * @param fileId The ID of the uploaded file.
 * @returns The job ID.
 */
async function startExtractionJob(fileId: string): Promise<string> {
    console.log(`Starting extraction job for file ${fileId} with agent ${LLAMA_AGENT_NAME}...`);
    const response = await fetch(`${BASE_URL}/extractors/${LLAMA_AGENT_NAME}/jobs`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${LLAMA_CLOUD_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ file_id: fileId }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to start LlamaCloud extraction job with status ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log(`Extraction job started successfully. Job ID: ${result.id}`);
    return result.id;
}


/**
 * Polls the extraction job status until it's completed or fails.
 * @param jobId The ID of the extraction job.
 * @returns A promise that resolves with the final job status object.
 */
async function pollJobStatus(jobId: string): Promise<any> {
    const maxRetries = 30; // Poll for up to 90 seconds
    const delay = 3000; // 3 seconds

    for (let i = 0; i < maxRetries; i++) {
        console.log(`Polling job status for job ID: ${jobId} (Attempt ${i + 1}/${maxRetries})`);
        const response = await fetch(`${BASE_URL}/extractors/${LLAMA_AGENT_NAME}/jobs/${jobId}`, {
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
        if (result.status === 'SUCCESS' || result.status === 'PARTIAL_SUCCESS') {
            console.log(`Job completed with status: ${result.status}`);
            return result;
        }
         if (result.status === 'ERROR' || result.status === 'FAILED') {
            throw new Error(`Extraction job failed with message: ${result.message || 'Unknown error'}`);
        }

        await new Promise(resolve => setTimeout(resolve, delay));
    }
    throw new Error('Extraction job timed out.');
}

/**
 * Gets the final result of a completed extraction job.
 * @param jobId The ID of the completed job.
 * @returns The extracted data.
 */
async function getJobResult(jobId: string): Promise<any> {
    console.log(`Fetching result for job ID: ${jobId}`);
    const response = await fetch(`${BASE_URL}/extractors/${LLAMA_AGENT_NAME}/jobs/${jobId}/result`, {
        headers: {
            'Authorization': `Bearer ${LLAMA_CLOUD_API_KEY}`,
            'Accept': 'application/json',
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get LlamaCloud job result with status ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log("Job result fetched successfully.");
    return result.data;
}


/**
 * Calls the LlamaCloud extraction agent to extract structured data from a document.
 * @param document The document to analyze, as a base64 data URI.
 * @returns A promise that resolves to the extracted structured data.
 */
export async function callLlamaCloudExtractor(document: string): Promise<any> {
    if (!LLAMA_CLOUD_API_KEY || !LLAMA_AGENT_NAME) {
        const errorMessage = "LlamaCloud API key or Agent Name not found. Please configure them in the .env file.";
        console.error(errorMessage);
        throw new Error(errorMessage);
    }

    try {
        // Step 1: Upload the file
        const fileId = await uploadFile(document);

        // Step 2: Start the extraction job
        const jobId = await startExtractionJob(fileId);

        // Step 3: Poll for job completion
        await pollJobStatus(jobId);
        
        // Step 4: Get the final result
        const data = await getJobResult(jobId);

        return data;

    } catch (error) {
        console.error("Error calling LlamaCloud extractor service:", error);
        if (error instanceof Error) {
            throw new Error(`An error occurred while communicating with LlamaCloud: ${error.message}`);
        }
        throw new Error(`An unknown error occurred while communicating with LlamaCloud.`);
    }
}