

const SubmitButton = ({ disabled, value, formSubmitFunction, cssClasses }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        formSubmitFunction();
    }

	return (
        <div className={cssClasses}>
            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        className="btn btn-primary"
                        type="submit"
                        value={value}
                        disabled={disabled} />
                </div>
            </form>
        </div>
	)
}

export { SubmitButton }