import React, { useEffect, useState } from "react";
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
import { login, register, checkToken } from "../utils/auth";


export const App = () => {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false)
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false)
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false)
  const [isPopupDeleteCardOpen, setIsPopupDeleteCardOpen] = useState(false)
  const [selectedCard, setSelectedCard] = useState({})
  const [currentUser, setCurrentUser] = useState({})
  const [cards, setCards] = useState([])
  const [itemToDelete, setItemToDelete] = useState({})

  const [isSuccessRegister, setIsSuccessRegister] = useState(false)
  const [isSuccessLoggedIn, setIsSuccessLoggedIn] = useState(false)
  const [email, setEmail] = useState('')

  const navigate = useNavigate();

  // useEffect(() => {
  //   api.getAddingPictures()
  //     .then(res => setCards(res))
  //     .then(res=>console.log('cards', res))
  //     .catch((err) => console.log(err))
  // }, [])

  // useEffect(() => {
  //   api.getUserInfo()
  //     .then(res => setCurrentUser(res))
  //     .catch((err) => console.log(err))
  // }, [])

  useEffect(() => {
    Promise.all([api.getAddingPictures(), api.getUserInfo()])
    .then(([cardsInfo, userInfo]) => {
      setCurrentUser(userInfo)
      setCards(cardsInfo)
    })
    .catch((err) => console.log(err))
  })

  useEffect(() => {
    const token = localStorage.getItem("jwt")
    if (token) {
      checkToken(token)
      .then((res) => {
        setIsSuccessLoggedIn(true);
        setEmail(res.data.email)
        navigate('/')
      })
      .catch((err) => {
        if (err.status === 401) {
          console.log("401 — Токен не передан или передан не в том формате");
        }
        console.log("401 — Переданный токен некорректен");
      });
    }
  }, [navigate])

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

  const handleRegisterSubmit = (userData) => {
    console.log(33333, 'register --', userData);
    register(userData)
    .then(
      () => {
        setIsSuccessRegister(true);
        //handleInfoTooltipPopupOpen();
        navigate('/sign-in')
        console.log('потом переместить tooltip', isSuccessRegister);
      })
      .catch((err) => {
        if (err.status === 400) {
          console.log("400 - некорректно заполнено одно из полей");
        }
        // setInfoToolTipPopupOpen(true);
        setIsSuccessRegister(false);
      });
  }
  
  const handleLoginSubmit = (userData) => {
    console.log(22222,'login --', userData);
    login(userData).then(
      (res) => {
        console.log(44444, res);
        setIsSuccessLoggedIn(true);
        localStorage.setItem('jwt', res.token);
        setEmail(userData.email)
        console.log(444, isSuccessLoggedIn);
        navigate('/');
      })
      .catch((err) => {
        if (err.status === 400) {
          console.log("400 - не передано одно из полей");
        } else if (err.status === 401) {
          console.log("401 - пользователь с email не найден");
        }
      });
  }




  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <div className="page__container" onKeyDown={closeAllPopupsEsc} >
        {/* path="/"   */}
            <Header userEmail={email}/>
            <Routes>
              <Route path="/sign-up" element={<Register onRegister={handleRegisterSubmit} />}></Route>
              <Route path="/sign-in" element={<Login onLogin={handleLoginSubmit}/>}></Route>
              <Route path='/' element={<ProtectedRoute
                path="/main"
                component={<Main />}
                //component={Main}
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleAddPlaceClick}
                onEditAvatar={handleEditAvatarClick}
                onCardClick={handleCardClick}
                cards={cards}
                onCardLike={handleCardLike}
                onDeleteCard={handlePopupSubmitOpen}
                isLoggedIn={isSuccessLoggedIn}
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
