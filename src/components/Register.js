import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { Sign } from "./Sign";

export const Register = ({onRegister}) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	// const [error, setError] = useState(false);



	const messageIsRegistered = (
	<p>
		Уже зарегистрированы? <Link className="form__link" to="/sign-in">Войти</Link>
	</p>
	)


	const handleSubmit = (e) => {
		e.preventDefault()
		onRegister({email, password})
	}

	return (
		<Sign title={'Регистрация'} buttonText={'Зарегистрироваться'} onSubmit={handleSubmit} messageIsRegistered={messageIsRegistered} >
		<input type="email" value={email} onChange={(ev) => setEmail(ev.target.value)}/>
		<input type="password" value={password} onChange={(ev) => setPassword(ev.target.value)}/>
		</Sign>
	)
}