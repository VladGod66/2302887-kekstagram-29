// Модуль публикации нового фото

import { resetScale } from './zoom-foto.mjs';
import { resetEffect } from './effects-photo.mjs';
import {sendData} from './creates-api.mjs';
import {showSuccessPopup , showErrorPopup} from './opens-popup.mjs';

// Определяем допустимое количество хэштэгов
const MAX_HASHTAGS_COUNT = 5;
// Определяем правило написания хэштэга через регулярное выражение
const HASHTAGS_RULES = /^#[a-zа-яё0-9]{1,19}$/i;
// Определяем тексты сообщений об ошибке записи хэштэгов
const UNUNIQUE_TAGS_ERROR_TEXT = 'Ошибка хэштэга: повторяющийся хэштэг - уберите повтор в любом регистре !';
const INVALID_CONTENT_ERROR_TEXT = 'Ошибка хэштэга: неверное содержимое хэштэга - начать с #, плюс от 1  до 19 символов a-z,а-я, 0-9';
const INVALID_COUNT_ERROR_TEXT = 'Ошибка хэштэга: превышено допустимое количество хэштэгов - не более 5 !';
// Определяем текст кнопки Опубликовать в процессе и после загрузки файла фото на сервер
const SUBMIT_BUTTON_TEXT_SENDING = 'Публикую...';
const SUBMIT_BUTTON_TEXT = 'Опубликовать';


// Находим body элемент страницы
const body = document.querySelector('body');
// Находим форму редактирования публикуемого фото
const uploadOverlay = document.querySelector('.img-upload__overlay');
// Находим форму загрузки модального окна публикации фото
const uploadForm = document.querySelector('.img-upload__form');
// Находим окно выбора фото для загрузки в стандартном окне поиска ОС
const fileField = document.querySelector('#upload-file');
// Находим поле хэштэгов к фото
const hashtagField = document.querySelector('.text__hashtags');
// Находим поле комментариев к фото
const descriptionField = document.querySelector('.text__description');
// Находим кнопку Закрыть модального окна публикации фото (крест)
const cancelCross = document.querySelector('#upload-cancel');
// Находим кнопку Опубликовать фото с комментариями
const buttonSubmit = document.querySelector('#upload-submit');


// Функция подключения и настройки внешней библиотеки валидации форм Pristine

const pristine = new Pristine(uploadForm, {
  // Задаём класс элемента, содержащего валидируемые поля формы (обязательная настройка)
  classTo: 'img-upload__field-wrapper',
  // Задаём класс элемента вывода сообщений об ошибках валидации (обязательная настройка)
  errorTextParent: 'img-upload__field-wrapper',
  // Задаём дополнительный класс для стилизации вывода текста ошибки валидации (необязательная настройка)
  errorTextClass: 'img-upload__error'
});

// Функция операций при открытии модального окна публикации фото

const showModal = () => {
  // Добавляем/удаляем нужные классы
  uploadOverlay.classList.remove('hidden');
  body.classList.add('modal-open');
  // Добавляем обработчик события нажатия любой кнопки при окрытом окне для его закрытия
  document.addEventListener('keydown', onDocumentEscKeydown);
  // Добавляем обработчик события keyup любой кнопки в поле добавления хэштэгов для блокировки отправки данных при невалидном поле хэштэгов
  hashtagField.addEventListener('keyup', onTextKeyUp);
  // Добавляем обработчик события keyup любой кнопки в поле добавления комментариев для блокировки отправки данных при невалидном поле комментария
  descriptionField.addEventListener('keyup', onTextKeyUp);
};

// Функция операций при закрытии модального окна публикации фото

const hideModal = () => {
  // Очищаем возможное содержимое полей формы от предыдущих заполнений
  uploadForm.reset();
  // Сбрасываем масштаб до начального масштаба
  resetScale();
  // Сбрасываем эффекты фильтров до оригинального фото
  resetEffect();
  // Сбрасываем возможные ошибки Pristine от предыдущих заполнений формы
  pristine.reset();
  // Добавляем/удаляем нужные классы и удаляем обработчики событий, связанных с открытым окном
  uploadOverlay.classList.add('hidden');
  body.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentEscKeydown);
  hashtagField.removeEventListener('keyup', onTextKeyUp);
  descriptionField.removeEventListener('keyup', onTextKeyUp);
};

// Функция условия блокирования закрытия модального окна публикации при активном фокусе на поле хэштэга или комментария через свойство activeElement

const blockingСonditionOnFocus = () =>
  document.activeElement === hashtagField || document.activeElement === descriptionField;

// Функция закрытия модального окна публикации фото при нажатии Escape и невыполнении условия блокировки закрытия

function onDocumentEscKeydown(evt) {
  if (evt.key === 'Escape' && !blockingСonditionOnFocus()) {
    evt.preventDefault();
    hideModal();
  }
}
// Функция исполнения открытия модального окна публикации фото

const onOpenFileChange = () => {
  showModal();
};
// Функция исполнения закрытия модального окна публикации фото при нажатии на кнопку Крест

const onCancelCrossClick = () => {
  hideModal();
};

// Функция нормализации строки хэштэгов (обрезаем пробелы в начале и конце, разделяем на массив подстрок по пробелу и удаляем пустые подстроки)

const normalizeTags = (tagString) => tagString.trim().split(' ').filter((tag) => Boolean(tag.length));

// Подфункция валидации правильности написания хэштэга

const isValidTag = (value) => normalizeTags(value).every((tag) => HASHTAGS_RULES.test(tag));

// Подфункция валидации допустимого количество хэштэгов

const hasValidCount = (value) => normalizeTags(value).length <= MAX_HASHTAGS_COUNT;

// Подфункция валидации отсутствия одинаковых хэштэгов

const hasUniqueTags = (value) => {
  // Приводим хэштэг к нижнему регистру
  const lowerCaseTags = normalizeTags(value).map((tag) => tag.toLowerCase());
  // Сравниваем длину массива хэштэгов с длиной созданной коллекции Set (которая не сохраняет повторяющиеся элементы в массиве)
  // Возвращает true, если длины равны, т.е.повторы в изначальном массиве хэштэгов отсутствуют
  return lowerCaseTags.length === new Set(lowerCaseTags).size;
};

// Функция валидации отсутствия повторяющихся хэштэгов

pristine.addValidator(
  // Определяем поле подлежащее валидации
  hashtagField,
  // Вызыв функции необходимой собственной валидации поля хэштэгов
  hasUniqueTags,
  // Сообщение, выводимое Pristine при возникновении этой ошибки валидации поля хэштэгов
  UNUNIQUE_TAGS_ERROR_TEXT, 1, true
);

// Функция валидации символов хэштэга

pristine.addValidator(
  // Определяем поле подлежащее валидации
  hashtagField,
  // Вызыв функции необходимой собственной валидации поля хэштэгов
  isValidTag,
  // Сообщение, выводимое Pristine при возникновении этой ошибки валидации поля хэштэгов
  INVALID_CONTENT_ERROR_TEXT, 2, true
);

// Функция валидации максимального количества хэштэгов

pristine.addValidator(
  // Определяем поле подлежащее валидации
  hashtagField,
  // Вызыв функции необходимой собственной валидации поля хэштэгов
  hasValidCount,
  // Сообщение, выводимое Pristine при возникновении этой ошибки валидации поля хэштэгов
  INVALID_COUNT_ERROR_TEXT, 3, true
);

// Функция блокирования кнопки Опубликовать, если валидация полей хэштэгов или комментариев не пройдена

function onTextKeyUp() {
  // Если все функции валидации выдают true
  if (hasUniqueTags(hashtagField.value) && isValidTag(hashtagField.value) && hasValidCount(hashtagField.value) && descriptionField.value.length < 141 && descriptionField.value.length > 4) {
    // Кнопку Опубликовать не блокируем
    buttonSubmit.disabled = false;
    // В противном случае кнопку блокируем добавляя свойство css disabled элементу кнопки
  } else {
    buttonSubmit.disabled = true;
  }
}

// Функция блокировки кнопки Опубликовать

const blockSubmitButton = () => {
  buttonSubmit.disabled = true;
  buttonSubmit.textContent = SUBMIT_BUTTON_TEXT_SENDING;
};


// Функция разблокировки кнопки Опубликовать

const unblockSubmitButton = () => {
  buttonSubmit.disabled = false;
  buttonSubmit.textContent = SUBMIT_BUTTON_TEXT;
};

// Функция проверки валидности и отправки формы публикации фото на сервер
const userFotoFormSubmit = () => {
  // Добавляем обработчик события submit на кнопке Опубликовать формы публикации нового фото
  uploadForm.addEventListener('submit', (evt) => {
    // Отменяем действие браузера по умолчанию
    evt.preventDefault();
    // Если содержимое полей формы валидно
    if (pristine.validate()) {
      // Блокируем кнопку Опубликовать для предотвращения повторных нажатий в процессе публикации
      blockSubmitButton();
      // Отправляем данные о фото на сервер через вызов функции отправки данных c аргументом в виде объекта FormData с данными формы публикации фото
      sendData(new FormData(evt.target))
      // Вызываем промис, который при переходе в состояние fulfilled (успешный ответ получен)
        .then((response) => {
          // Проверяем свойство объекта ответа сервера .ок и если оно false
          if (!response.ok) {
          // Бросаем ошибку запроса (исключение) к серверу с сообщением и переходим в секцию catch
            throw new Error(`Ошибка сервера: ${response.status} - ${response.statusText} попробуйте позже`);
          }
          // Закрываем модальное окно загрузки фото
          hideModal();
          // Показываем попап с сообщением об успешной публикации фото
          showSuccessPopup();
        })
        // В случае прихода ошибки с сервера (или перехода в состояние  rejected из-за сверхлимитной задержки ответа сервера) вызываем метод catch
        .catch(() => {
          // Показываем попап с сообщением об ошибке при загрузке фото на сервер
          showErrorPopup();
        })
        // По окончании любого варианта выполнения промиса разблокируем кнопку Опубликовать
        .finally(unblockSubmitButton);
    }
  });
};

// Добавляем обработчик события change на кнопку Открыть фото в модальном окне
fileField.addEventListener('change', onOpenFileChange);
// Добавляем обработчик события click на кнопку Закрыть окно (крест) в модальном окне
cancelCross.addEventListener('click', onCancelCrossClick);

export {userFotoFormSubmit, onDocumentEscKeydown};
