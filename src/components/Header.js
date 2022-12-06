import { NavLink } from "react-router-dom"

export const Header = ({userEmail}) => {
	const navToolbar = [
		{
			id: 1,
			to: '/',
			name: 'Home'
		},
		{
			id: 2,
			to: '/sign-up',
			name: 'Регистрация'
		},
		{
			id: 3,
			to: '/sign-in',
			name: 'Войти'
		},
	]
	return (
		<header className="header">
			<div className="header__logo"></div>
			<div>
				<ul>
					{navToolbar.map((link) => (
						<li key={link.id}>
							<NavLink to={link.to}>{link.name}</NavLink>
						</li>
					))}
					<p>{userEmail}</p>
				</ul>
			</div>
		</header>
	)
}