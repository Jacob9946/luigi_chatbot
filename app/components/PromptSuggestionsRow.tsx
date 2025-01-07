import PromptSugestionButton from "./PromptSugestionButton";

const PromptSuggestionsRow = (onPromptClick) => {
    const prompts = [
        "Jakie wino do mięsa?",
        "Jakie wino do ryb?",
        "Jakie wino do deseru?",
        "W jakim kraju produkowane jest najlepsze wino?",
        "Jakie wino do sera?",
        "Gdzie produkuje się najwięcej wina?",
    ]
    return (
        <div className="prompt-sugestion-row">
            {prompts.map((prompt, index) => 
                <PromptSugestionButton 
                    key={`suggestion-${index}`}
                    text={prompt}
                    onClick={() => onPromptClick(prompt)}
        />)}
        </div> 
    )
} 
export default PromptSuggestionsRow;