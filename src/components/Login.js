import React, { useState } from "react";
import { Sign } from "./Sign";

export const Login = ({onLogin, handleCheckToken }) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	// const [error, setError] = useState(false);

	const handleSubmit = (e) => {
		e.preventDefault()
		onLogin({email, password})
	}

	return(
		<Sign title={'Вход'} buttonText={'Войти'} onSubmit={handleSubmit} >
		<input type="email" value={email} onChange={(ev) => setEmail(ev.target.value)}/>
		<input type="password" value={password} onChange={(ev) => setPassword(ev.target.value)}/>
		</Sign>
	)
}