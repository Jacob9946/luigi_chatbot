"use client"
import Image from "next/image"
import logochatbot from "./assets/logochatbot.jpeg"
import { useChat } from "ai/react"
import { Message } from "ai"
import Bubble from "./components/Bubble"
import PromptSuggestionsRow from "./components/PromptSuggestionsRow"
import LoadingBubble from "./components/LoadingBubble"

const Home = () => {

    const { append, isLoading, messages, input, handleInputChange, handleSubmit} = useChat()

    const noMessages = true

  return (
    <main>
        <Image src={logochatbot} width="400" alt="Logo Chatbot" />
        <section className={noMessages ? "" : "chat-container-open"}>
            {noMessages ? (
                <>
                     <p className="stater-text">
                      Witaj u swojego wirtualnego someliera. Luigi chętnie odpowie na twoje pytania.
                    </p>
                    <br/>
                    {<PromptSuggestionsRow/>}
                </>
            ) : (
                <>
                    {messages.map((message, index) => <Bubble key={`message-${index}`} message={message}/>)}
                    {isLoading && <LoadingBubble/>}
                </>
            )}

        </section>
        <form onSubmit={handleSubmit}>
                <input className="question-box" onChange={handleInputChange} value={input} placeholder="Wpisz zapytanie.."/>
                <input type="submit" />
            </form>
    </main>
  )
}

export default Home;
