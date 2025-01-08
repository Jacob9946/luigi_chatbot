import PromptSuggestionButton from "./PromptSugestionButton";

interface PromptSuggestionsRowProps {
    onPromptClick: (prompt: string) => void;
}

const PromptSuggestionsRow = ({ onPromptClick }: PromptSuggestionsRowProps) => {
    const prompts = [
        "Jakie wino pasuje najlepiej do mięsa?",
        "Jakie wino smakuje najlepiej do ryb?",
        "Jakie wino do deseru?",
        "W jakim kraju produkowane jest najlepsze wino?",
        "Jakie wino do sera?",
        "Gdzie produkuje się najwięcej wina?",
    ]

    return (
        <div className="prompt-suggestion-row">
            {prompts.map((prompt, index) => (
                <PromptSuggestionButton 
                    key={`suggestion-${index}`}
                    text={prompt}
                    onClick={() => onPromptClick(prompt)}
                />
            ))}
        </div>
    )
}

export default PromptSuggestionsRow
