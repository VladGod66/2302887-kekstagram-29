// Модуль показа инфо попапа с результатами попытки отправки публикуемого фото на сервер

import {onDocumentEscKeydown} from './upload-form.mjs';

// Находим шаблон и получаем содержимое шаблона попапа с сообщением об успешной публикации фото
const successTemplate = document.querySelector('#success').content.querySelector('.success');
// Клонируем шаблон с сообщением об успешной публикации фото во внутреннюю переменную функции
const successPopup = successTemplate.cloneNode(true);
// Находим содержимое попапа об успешной публикации фото
const successInner = successPopup.querySelector('.success__inner');
// Находим текст сообщения об успешной публикации фото
const successTitle = successPopup.querySelector('.success__title');
// Находим кнопку закрытия инфо попапа с сообщением об успешной публикации фото
const successButton = successPopup.querySelector('.success__button');
// Находим шаблон и получаем содержимое шаблона попапа с сообщением об ошибке загрузки файла
const errorTemplate = document.querySelector('#error').content.querySelector('.error');
// Клонируем шаблон с сообщением об ошибке загрузки файла во внутреннюю переменную функции
const errorPopup = errorTemplate.cloneNode(true);
// Находим кнопку закрытия инфо попапа с сообщением об ошибке загрузки файла
const errorButton = errorPopup.querySelector('.error__button');
// Находим содержимое попапа об ошибке загрузки файла
const errorInner = errorPopup.querySelector('.error__inner');
// Находим текст сообщения об ошибке загрузки файла
const errorTitle = errorPopup.querySelector('.error__title');


// Функция операций при закрытии инфо попапа с с сообщением об успешной публикацией фото

const closeSuccessPopup = () => {
  // Удаляем элемент попапа из DOM
  successPopup.remove();
  // Удаляем обработчик события keydown на нажатие кнопки Esc
  document.removeEventListener('keydown', onSuccessKeydown);
  // Удаляем обработчик события click на любой области вне попапа
  document.removeEventListener('click', onSuccessClick);
  // Удаляем обработчик событие keydown на кнопку Esc для закрытия модального окна публикации фото
  document.removeEventListener('keydown', onDocumentEscKeydown);
};

// Функция показа инфо попапа с сообщением об успешной публикацией фото

const showSuccessPopup = () => {
  // Добавляем элемент с попапом в конец body
  document.body.append(successPopup);
  // Добавляем обработчик события click на кнопку закрытия попапа
  successButton.addEventListener('click', () => {
    // При наступлении события вызываем функцию закрытия попапа
    closeSuccessPopup();
  });
  // Добавляем обработчик события keydown на нажатие кнопки Esc
  document.addEventListener('keydown', onSuccessKeydown);
  // Добавляем обработчик события click на любой области вне попапа
  document.addEventListener('click', onSuccessClick);
  // Удаляем обработчик событие keydown на кнопку Esc для закрытия модального окна публикации фото
  document.removeEventListener('keydown', onDocumentEscKeydown);
};

// Функция закрытия инфо попапа с сообщением об успешной публикации фото при нажатии кнопки ESC

function onSuccessKeydown (evt) {
  // Если нажата кнопка Esc
  if (evt.key === 'Escape') {
    // Вызваем функцию закрытия попапа
    closeSuccessPopup();
  }
}

// Функция закрытия инфо попапа с сообщением об успешной публикации фото кликом по любой области вне попапа

function onSuccessClick (evt) {
  // Если click произошёл по любой области вне попапа и его текста
  if (evt.target !== successInner && evt.target !== successTitle) {
    // Вызываем функцию закрытия попапа
    closeSuccessPopup();
  }
}

// Функция операций при закрытии инфо попапа с сообщением об ошибке загрузки файла

const closeErrorPopup = () => {
  // Удаляем элемент попапа из DOM
  errorPopup.remove();
  // Удаляем обработчик события keydown на нажатие кнопки Esc
  document.removeEventListener('keydown', onErrorKeydown);
  // Удаляем обработчик события click на любой области вне попапа
  document.removeEventListener('click', onErrorClick);
  // Добавляем обработчик событие keydown на кнопку Esc для закрытия модального окна публикации фото
  document.addEventListener('keydown', onDocumentEscKeydown);
};

// Функция показа инфо попапа с сообщением об ошибке

const showErrorPopup = () => {
  // Добавляем элемент с попапом в конец body
  document.body.append(errorPopup);
  // Добавляем обработчик события click на кнопку закрытия попапа
  errorButton.addEventListener('click', () => {
    // При наступлении события вызываем функцию закрытия попапа
    closeErrorPopup();
  });
  // Добавляем обработчик события keydown на нажатие кнопки Esc
  document.addEventListener('keydown', onErrorKeydown);
  // Добавляем обработчик события click на любой области вне попапа
  document.addEventListener('click', onErrorClick);
  // Удаляем обработчик событие keydown на кнопку Esc для закрытия модального окна публикации фото
  document.removeEventListener('keydown', onDocumentEscKeydown);
};

// Функция закрытие инфо попапа с сообщением об ошибке при нажатии кнопки Esc

function onErrorKeydown (evt) {
  // Если нажата кнопка Esc
  if (evt.key === 'Escape') {
    // Отменяем действия браузера по умолчанию
    evt.preventDefault();
    // Вызываем функцию закрытия попапа
    closeErrorPopup();
  }
}

// Функция закрытия инфо попапа с сообщением об ошибке кликом по любой области вне попапа

function onErrorClick (evt) {
  // Если click произошёл по любой области вне попапа и его текста
  if (evt.target !== errorInner && evt.target !== errorTitle) {
    // Вызываем функцию закрытия попапа
    closeErrorPopup();
  }
}

export {showSuccessPopup , showErrorPopup};
