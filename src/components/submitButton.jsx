

const SubmitButton = ({ disabled, value, formSubmitFunction }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        formSubmitFunction();
    }

	return (
        <div className="buttonCenter">
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