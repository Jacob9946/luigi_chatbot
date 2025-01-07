const PromptSugestionButton = ({text, onClick}) => {
    return (
        <button 
            className="btn btn-primary prompt-sugestion-button"
            onClick={onClick}
            >
             {text}
        </button>
    );
}
export default PromptSugestionButton;