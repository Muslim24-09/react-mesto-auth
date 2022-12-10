import React from "react";

import successIcon from "../images/success.svg";
import failIcon from "../images/fail.svg";

export const InfoToolTip = ({ isOpen, onClose, isSuccess }) => {
  return (
    <div className={isOpen ? 'popup popup_opened' : 'popup'} >
      <div className="popup__container popup__tooltip">
        <button className="popup__close-button" title='Закрыть попап' onClick={onClose}></button>
        {isSuccess ? (
          <>
            <img
              src={`${successIcon}`}
              alt="Регистрация прошла успешно."
              className="popup__tooltip_image"
            />
            <p className="popup__tooltip_message">
              Вы успешно зарегистрировались!
            </p>
          </>
        ) : (
          <>
            <img
              src={`${failIcon}`}
              alt="Регистрация не была выполнена."
              className="popup__tooltip_image"
            />
            <p className="popup__tooltip_message">
              Что-то пошло не так. Попробуйте ещё раз!
            </p>
          </>
        )}
      </div>
    </div>
  );
}





