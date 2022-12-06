//const authData = {
	//baseUrl: 'https://auth.nomoreparties.co',
	//headers: {
	//	'Content-Type': 'application/json',
	//}
//}

class Auth {
	_baseUrl;

	constructor({ baseUrl }) {
		this._baseUrl = baseUrl;

	}

	_checkResponse(res) {
		if (res.ok) {
			return res.json()
		} else {
			console.log(101010, res);
			return Promise.reject(`Ошибка: ${res.status}`)
		}
	}

	register(data) {
    return fetch(`${this._baseUrl}/signup`, {
      method: 'POST',
      //headers: this._headers,
			headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        password: data.password,
        email: data.email
      })
    }).then(this._checkResponse)
		.then((res) => console.log(999, res))
  }

	authorize(data) {
    return fetch(`${this._baseUrl}/signin`, {
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        password: data.password,
        email: data.email
      })
    }).then(this._checkResponse)
		.then((res) => console.log(888, res))
  }

  checkToken(token) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: 'GET',
      headers: {
				"Content-Type": "application/json",
				"Authorization" : `Bearer ${token}`
		} 
    }).then(this._checkResponse)
		.then((res) => console.log(777, res))
  }
}

export const auth = new Auth({
  baseUrl: 'https://auth.nomoreparties.co',
 // headers: {
  //  'Content-Type': 'application/json'
 // }
});