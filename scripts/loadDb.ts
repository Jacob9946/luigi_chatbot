import { DataAPIClient } from "@datastax/astra-db-ts"
import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer"
import OpenAi from "openai"

import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"

type SimilarityMetric = "dot_product" | "cosine" | "euclidean"

import "dotenv/config"

const{ 
    ASTRA_DB_NAMESPACE, 
    ASTRA_DB_COLLECTION, 
    ASTRA_DB_API_ENDPOINT, 
    ASTRA_DB_APPLICATION_TOKEN, 
    OPENAI_API_KEY 
} = process.env

const openai = new OpenAi({ apiKey: OPENAI_API_KEY })
const wineData = [
    'https://en.wikipedia.org/wiki/Wine',
    'http://www.manufakturaciastek.pl/jak-dobrac-wino-do-potrawy/?print=pdf'
]
const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN)
const db = client.db(ASTRA_DB_API_ENDPOINT, {namespace: ASTRA_DB_NAMESPACE})

const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 512,
    chunkOverlap: 100
})

const createCollection = async (SimilarityMetric: SimilarityMetric = "cosine") => {
    const res = await db.createCollection(ASTRA_DB_COLLECTION, {
        vector: {
            dimension: 1536,
            metric: SimilarityMetric
        }

    })

    console.log(res)
}

    const loadSampleData = async () => {
        const collection = await db.collection(ASTRA_DB_COLLECTION)
        for await (const url of wineData) {
            const content = await scrapePage(url)
            const chunks = await splitter.splitText(content)
            for await (const chunk of chunks) {
                const embeddings = await openai.embeddings.create({
                    model: "text-embedding-ada-002",
                    input: chunk,
                    encoding_format: "float"
                })
                const vector = embeddings.data[0].embedding

                const res = await collection.insertOne({
                    $vector: vector,
                    text: chunk
            })
            console.log(res)
        }
        
    }
}
const scrapePage = async (url: string) => {
    const loader = new PuppeteerWebBaseLoader(url, {
        launchOptions: {
            headless: true
        },
        gotoOptions: {
            waitUntil: "domcontentloaded"
        },
        evaluate: async (pages, browser) => {
            const result = await pages.evaluate(() => document.body.innerText)
            await browser.close()
            return result
        }
        
    })
    return ( await loader.scrape())?.replace(/<[^>]*>?/gm,  '') 

}

createCollection().then(() => loadSampleData())