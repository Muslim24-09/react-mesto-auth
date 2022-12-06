import React, { useCallback, useEffect, useState } from "react";
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Main } from "./Main";
import { ImagePopup } from "./ImagePopup";
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { api } from "../utils/api";
import { EditProfilePopup } from "./EditProfilePopup";
import { EditAvatarPopup } from "./EditAvatarPopup";
import { AddPlacePopup } from "./AddPlacePopup";
import { PopupDeleteCard } from "./PopupDeleteCard";
import { ProtectedRoute } from "../HOC/ProtectedRoute";
import { Login } from "./Login";
import { Register } from "./Register";
import { auth } from "../utils/auth";


export const App = () => {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false)
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false)
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false)
  const [isPopupDeleteCardOpen, setIsPopupDeleteCardOpen] = useState(false)
  const [selectedCard, setSelectedCard] = useState({})
  const [currentUser, setCurrentUser] = useState({})
  const [cards, setCards] = useState([])
  const [itemToDelete, setItemToDelete] = useState({})

  const [isSuccessSignUp, setIsSuccessSignUp] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const [email, setEmail] = useState('')

  const navigate = useNavigate();

  useEffect(() => {
    api.getAddingPictures()
      .then(res => setCards(res))
      .catch((err) => console.log(err))
  }, [])

  useEffect(() => {
    api.getUserInfo()
      .then(res => setCurrentUser(res))
      .catch((err) => console.log(err))
  }, [])

  const closeAllPopups = () => {
    setIsEditAvatarPopupOpen(false)
    setIsEditProfilePopupOpen(false)
    setIsAddPlacePopupOpen(false)
    setIsPopupDeleteCardOpen(false)
    setSelectedCard({})
  }

  const closeAllPopupsEsc = (e) => {
    if (e.key === 'Escape') {
      closeAllPopups()
    }
  }
  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true)
  };

  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true)
  }

  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(true)
  }

  const handleCardClick = (card) => {
    setSelectedCard(card)
  }

  const handleUpdateUser = (user) => {
    api.updateUserInfo(user)
      .then(res => {
        setCurrentUser(res)
        closeAllPopups()
      })
      .catch((err) => console.log(err))
  }

  const handleUpdateAvatar = (url) => {
    api.updateUserAvatar(url)
      .then(res => {
        setCurrentUser(res);
        closeAllPopups()
      })
      .catch((err) => console.log(err))

  }

  const handleCardLike = (card) => {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some(i => i._id === currentUser._id);

    // Отправляем запрос в API и получаем обновлённые данные карточки
    api.changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c))
      })
      .catch((err) => console.log(err))
  }

  const handleAddPlaceSubmit = (card) => {
    api.addItem(card)
      .then(res => {
        setCards([res, ...cards])
        closeAllPopups()
      })
      .catch((err) => console.log(err))
    card.name = ''

  }

  const handleCardDelete = () => {
    api.removeItem(itemToDelete._id)
      .then(() => {
        setCards(cards.filter((item) => item._id !== itemToDelete._id))
        closeAllPopups()
      })
      .catch((err) => console.log(err))
  }

  const handlePopupSubmitOpen = (card) => {
    setItemToDelete(card)
    setIsPopupDeleteCardOpen(true)
  }

  // onRegister() , onLogin() , и onSignOut()
  const onRegister = (userData) => {
    console.log(33333, userData);
    auth.register(userData)
    .then(
      (userData) => {
        setIsSuccessSignUp(true);
        console.log(333, isSuccessSignUp);
        //handleInfoTooltipPopupOpen();
        navigate.push('/sign-in')
      },
      (err) => {
        console.log(err);
        setIsSuccessSignUp(false);
        //handleInfoTooltipPopupOpen();
      })
  }
  
  const onLogin = (userData) => {
    console.log(22222, userData);
    auth.authorize(userData).then(
      (userData) => {
        console.log(44444, userData);
        setLoggedIn(true);
        localStorage.setItem('jwt', userData.token);
        console.log(444, loggedIn);
        navigate.push('/');
      },
      (err) => {
        console.log(err);
      }
    )
    
  }

  const handleCheckToken = useCallback(
    () => {
      const token = localStorage.getItem('jwt');
      auth.checkToken(token)
        .then(
          (data) => {
            setEmail(data.data.email);
            setLoggedIn(true);
            navigate.push('/');
          },
          (err) => {
            console.log(err);
          }
        )

    },
    [navigate],
  )

  useEffect(() => {
    const token = localStorage.getItem('jwt');

    if (token) {
      handleCheckToken();
    }
  }, [handleCheckToken])

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <div className="page__container" onKeyDown={closeAllPopupsEsc} >
        {/* path="/"   */}
            <Header userEmail={email}/>
            <Routes>
              <Route path="/sign-up" element={<Register onRegister={onRegister} />}></Route>
              <Route path="/sign-in" element={<Login onLogin={onLogin} onCheckToken={handleCheckToken}/>}></Route>
              <Route path="/" element={<ProtectedRoute
                // path="/"
                component={<Main />}
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleAddPlaceClick}
                onEditAvatar={handleEditAvatarClick}
                onCardClick={handleCardClick}
                cards={cards}
                onCardLike={handleCardLike}
                onDeleteCard={handlePopupSubmitOpen}
              />}></Route>
            </Routes>
            <Footer />
          <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser} />
          <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar} />
          <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace={handleAddPlaceSubmit} />
          <ImagePopup card={selectedCard} onClose={closeAllPopups} />
          <PopupDeleteCard
            isOpen={isPopupDeleteCardOpen}
            onClose={closeAllPopups}
            onDeleteCard={handleCardDelete}
            cardToDelete={itemToDelete} />
        </div>
      </div>
    </CurrentUserContext.Provider>
  );
}
