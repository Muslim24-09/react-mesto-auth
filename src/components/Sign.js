import React from "react";

export const Sign = ({ title, buttonText, isValid=true, onSubmit, messageIsRegistered, children }) => {
	return (
		<form
			noValidate
			onSubmit={onSubmit}
		>
			<h2>
				{title}
			</h2>
			{children}
			<button
				type="submit"
				disabled={!isValid}
			>
				{buttonText}
			</button>
			{messageIsRegistered && messageIsRegistered}
		</form>
	)
}