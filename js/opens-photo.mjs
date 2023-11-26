// Модуль открытия модального окна для полноэкранного показа фото с информацией и комментариями

// Определяем порцию выводимых комментариев
const DISPLAY_COMMENTS = 5;

// Находим элемент отображения модального окна в DOMе
const modalOpenElement = document.querySelector('.big-picture');
const commentElement = modalOpenElement.querySelector('.comments-shown');
// Находим элемент отображения количества комментариев к фото
const commentCountElement = modalOpenElement.querySelector('.comments-count');
// Находим элемент отображения комментариев к фото
const commentListElement = modalOpenElement.querySelector('.social__comments');
// Находим элемент отображения кнопки для загрузки новой порции комментариев
const commentsLoaderElement = modalOpenElement.querySelector('.comments-loader');
// Находим body элемент страницы
const bodyElement = document.querySelector('body');
// Находим элемент отображения кнопки для выхода из полноэкранного просмотра изображения
const cancelButtonElement = modalOpenElement.querySelector('.big-picture__cancel');
// Находим и получаем содержимое шаблона и записываем в переменную-объект
const commentTemplate = document.querySelector('.big-picture__social').querySelector('.social__comment');

// Объявляем переменную количества отображаемых комментариев
let commentsShown = 0;
// Объявляем массив комментариев
let comments = [];

// Функция создания одного комментария

// В параметрах функции деструктурируем нужные поля массива комментариев
const createComment = ({ avatar, name, message }) => {
  // Клонируем объект во внутреннюю переменную
  const comment = commentTemplate.cloneNode(true);
  // Находим поле ссылки на фото в клоне  и записываем туда ссылку на аватарку комментатора
  comment.querySelector('.social__picture').src = avatar;
  // Находим поле ссылки на имя в клоне  и записываем туда имя комментатора
  comment.querySelector('.social__picture').alt = name;
  // Находим поле ссылки на комментарий в клоне  и записываем туда текст комментария
  comment.querySelector('.social__text').textContent = message;

  return comment;
};

// Функция вывода комментариев к открытой в модальном окне фотографии

const renderComments = () => {
  // Обновляем количество выводимых комментариев
  commentsShown += DISPLAY_COMMENTS;
  // Проверяем необходимость показа кнопки Показать ещё (комментарии)
  if (commentsShown >= comments.length) {
    // Если все комментарии показаны, скрываем кнопку
    commentsLoaderElement.classList.add('hidden');
    // Увиличиваем счётчик показанных комментариев до конца
    commentsShown = comments.length;
  } else {
    // Иначе показывам кнопку
    commentsLoaderElement.classList.remove('hidden');
  }
  // Создаем фрагмент для вывода пакета комментариев
  const fragment = document.createDocumentFragment();
  //Проходим по нужной части массива фото
  for (let i = 0; i < commentsShown; i++) {
    // Формируем объект одного комментария вызовом функции создания комментария
    const comment = createComment(comments[i]);
    // Добавляем объект с комментарием в фрагмент с массивом комментариев
    fragment.append(comment);
  }
  // Очищаем массив комментариев от предыдущих открытий модального окна
  commentListElement.innerHTML = '';
  // Добавляем в DOM содержимое фрагмента с комментариями
  commentListElement.append(fragment);
  // Добавляем в DOM выведенное количество комментариев в окне
  commentElement.textContent = commentsShown;
  // Добавляем в DOM общее количество комментариев к открытому фото
  commentCountElement.textContent = comments.length;
};

// Функция операций при закрытии модального окна

const closeModal = () => {
  // Добавляем класс скрытия окна
  modalOpenElement.classList.add('hidden');
  // Удалям класс открытия окна
  bodyElement.classList.remove('modal-open');
  // Удалям обработчик события нажатия кнопки Escape
  document.removeEventListener('keydown', onDocumentKeydown);
  // Обнуляем счётчик показанных комментариев
  commentsShown = 0;
};

// Функция закрытия модального окна при нажатии кнопки Escape

function onDocumentKeydown(evt) {
  // Если нажата кнопка Escape
  if (evt.key === 'Escape') {
    // Отменяем действия браузера по умолчанию
    evt.preventDefault();
    // Вызываем функцию закрытия модального окна
    closeModal();
  }
}

// Функция исполнения закрытия модального окна

const onCancelButtonClick = () => closeModal();

// Функция исполнения загрузки порции комментариев

const onCommentsLoaderClick = () => renderComments();

// Функция заполнения свойств элемента информацией об открываемой в модальном окне фотографии

// Принимает объект с инфомацией об изображении и деструктурирует нужные поля
const renderPicturesDetalis = ({ url, likes, description }) => {
  // Находим элемент ссылки на фото в DOM и записываем туда реальную ссылку на фото
  modalOpenElement.querySelector('.big-picture__img img').src = url;
  // Находим элемент количества лайков в DOM и записываем туда количество лайков к открытому фото
  modalOpenElement.querySelector('.likes-count').textContent = likes;
  // Находим элемент описания фото в DOM и записываем туда описание открытого фото
  modalOpenElement.querySelector('.social__caption').textContent = description;
  // Находим элемент альтернативного описания открытого фото в DOM и записываем туда описание
  modalOpenElement.querySelector('.big-picture__img img').alt = description;
};

// Функция открытия модального окна

const openModal = (data) => {
  // Удаляем класс скрытия окна
  modalOpenElement.classList.remove('hidden');
  // Добавляем класс открытия окна
  bodyElement.classList.add('modal-open');
  // Добавляем обработчик события нажатия кнопки Escape для закрытия окна
  document.addEventListener('keydown', onDocumentKeydown);
  // Вызываем функцию заполнения свойств элемента информацией об открываемой в модальном окне фотографии
  renderPicturesDetalis(data);
  // Записываем в обявленный массив данные из массива комментариев открытого в окне фото
  comments = data.comments;
  // Если комментарии имеются, вызываем функцию вывода комментариев в окно
  if (comments.length > 0) {
    renderComments();
  }
};

// Добавляет обработчик события click на кнопку закрытия модального окна
cancelButtonElement.addEventListener('click', onCancelButtonClick);
// Добавляет обработчик события click на кнопку Загрузить ещё (порцию комментариев)
commentsLoaderElement.addEventListener('click', onCommentsLoaderClick);

export { openModal };
