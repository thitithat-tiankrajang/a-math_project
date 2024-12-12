import "./style/AppSubmit.css"

function AppSubmit({ boardState, onSubmitClick }) {
    return (
        <div className="app-submit">
            <div 
                className="submit-text"
                onClick={() => onSubmitClick()}
            > 
                SUBMIT
            </div>
        </div>
    );
}

export default AppSubmit;