import OpenAI from "openai"
import { OpenAIStream, StreamingTextResponse } from "ai-stream-experimental";
import { DataAPIClient } from "@datastax/astra-db-ts"

const{ 
    ASTRA_DB_NAMESPACE, 
    ASTRA_DB_COLLECTION, 
    ASTRA_DB_API_ENDPOINT, 
    ASTRA_DB_APPLICATION_TOKEN, 
    OPENAI_API_KEY 
} = process.env

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY
})

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN)
const db = client.db(ASTRA_DB_API_ENDPOINT, {namespace: ASTRA_DB_NAMESPACE})

export async function POST(req: Request) {
    try{
        const{messages} = await req.json()
        const latestMessage = messages[messages.length - 1]?.content

        let docContext = ""
        const embedding = await openai.embeddings.create({
            model: "text-embedding-ada-002",
            input: latestMessage,
            encoding_format: "float"
        })
        try{
            const collection = await db.collection(ASTRA_DB_COLLECTION)
            const cursor = collection.find(null, {
                sort: {
                    $vector: embedding.data[0].embedding,
                },
                limit: 10
        })

        const documents = await cursor.toArray()
        const docsMap = documents?.map(doc => doc.text)

        docContext = JSON.stringify(docsMap)
        
        }catch (err) {
            console.error("Error quering db:", err)
            docContext = ""
        }
        const template = {
            role: "system",
            content:`Your name is Luigi, I am a virtual somelier. You love to talk about wines and you take the opportunity to show off your wine knowledge. If the question or context is not enough to answer, you can ask a follow-up question. 
            You were built to advise on the selection of wines for different dishes and to tell interesting facts about wines. You are happy to answer questions about wines.
            --------------------------------
            START CONTEXT
            ${docContext}
            END CONTEXT
            --------------------------------
            QUESTION: ${latestMessage}
            --------------------------------
            `
        } 

const response = await openai.chat.completions.create({
    model: "gpt-4",
    stream: true,
    messages: [template, ...messages]
})

    const stream = OpenAIStream(response)
return new StreamingTextResponse(stream)
} catch (err) {
    if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Response error:', err.response.data);
    } else if (err.request) {
        // The request was made but no response was received
        console.error('Request error:', err.request);
    } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error:', err.message);
    }
    console.error('Config:', err.config);
    throw err; // Re-throw the error to ensure it is not silently ignored
}
}