"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useChat } from "ai/react"
import logochatbot from "./assets/luigi-somelier.png"
import Bubble from "./components/Bubble"
import LoadingBubble from "./components/LoadingBubble"
import PromptSuggestionRow from "./components/PromptSuggestionsRow"

interface ChatMessage {
    content: string;
    role: 'user' | 'assistant';
}

export default function Page() {
    const [isMounted, setIsMounted] = useState(false)
    const { 
        append, 
        isLoading, 
        messages, 
        input, 
        handleInputChange, 
        handleSubmit, 
        error 
    } = useChat({
        api: '/api/chat',
        onError: (error) => {
            console.error('Chat error:', error);
        },
        onFinish: (message) => {
            console.log('Finished message:', message);
        },
    })
    
    const noMessage = !messages || messages.length === 0

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const handlePromptClick = async (promptText: string) => {
        try {
            await append({
                content: promptText,
                role: 'user' as ChatMessage['role'],
            });
        } catch (error) {
            console.error('Error in handlePromptClick:', error);
        }
    }

    if (!isMounted) {
        return null
    }

    return (
        <main>
            <Image className="main-img" src={logochatbot} width={350} alt="Chatbot Logo"/>
            <section className={noMessage ? "" : "populated"}>
                {noMessage ? (
                    <>
                        <p className="starter-text">
                            Witaj. Jestem Luigi, jestem wirtualnym sommelierem. Jak mogę Ci pomóc?
                        </p>
                        <br/>
                        <PromptSuggestionRow onPromptClick={handlePromptClick}/>
                    </>
                ) : (
                    <>
                        {messages.map((message, index) => (
                            <Bubble 
                                key={index}
                                message={{
                                    content: message.content,
                                    role: message.role as ChatMessage['role']
                                }}
                            />
                        ))}
                        {isLoading && <LoadingBubble/>}
                        {error && (
                            <div className="error-message">
                                An error occurred. Please try again.
                            </div>
                        )}
                    </>
                )}
            </section>
            <form onSubmit={handleSubmit}>
                <input 
                    className="question-box" 
                    onChange={handleInputChange} 
                    value={input} 
                    placeholder="Zadaj mi pytanie..."
                    type="text"
                />
                <input className="send-button" 
                    type="submit" 
                    disabled={isLoading}
                    value="Wyślij"
                />
            </form>
        </main>
    )
}