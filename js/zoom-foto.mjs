// Модуль масштабирования предварительного просмотра фото перед публикацией

// Определяем начальный масштаб предварительного просмотра фото
const INITIAL_SCALE = 100;
// Определяем максимальный масштаб предварительного просмотра фото
const MAX_SCALE = 100;
// Определяем минимальный масштаб предварительного просмотра фото
const MIN_SCALE = 25;
// Определяем шаг изменения масштаба предварительного просмотра фото
const SCALE_STEP = 25;

// Находим кнопку уменьшения масштаба фото
const smallerButton = document.querySelector('.scale__control--smaller');
// Находим кнопку увеличения масштаба фото
const biggerButton = document.querySelector('.scale__control--bigger');
// Находим элемент отображения текущего масштаба фото
const scaleValue = document.querySelector('.scale__control--value');
// Находим изображение в элементе предварительного просмотра фото
const previewImage = document.querySelector('.img-upload__preview img');

// Функция масштабироваиня предварительного просмотра фото

const scaleImage = (value) => {
  // Добавляем свойство scale в стили класса элемента фото методом transform css и присваивает ему полученное значение в единицах масштаба
  previewImage.style.transform = `scale(${value / 100})`;
  // Изменяем значение свойства value элемента отображения текущего масштаба на полученное значение
  scaleValue.value = `${value}%`;
};

// Функция вызова функции scaleImage и уменьшения масштаба фото на один шаг вниз

const onSmallerButtonClick = () => {
  // Пребразуем строку с текущим масштабом с % в десятичное число
  const currentValue = parseInt(scaleValue.value, 10);
  // Опредялям новое значение текущего масштаба
  const newValue = currentValue - SCALE_STEP;
  // Если новое значение текущего масштаба больше или равно минимальному
  if (newValue >= MIN_SCALE) {
    // Вызываем функцию масштабирования с новым текущим значением масштаба
    scaleImage(newValue);
  }
};

// Функция вызова функции scaleImage и уменьшения масштаба фото на один шаг вверх

const onBiggerButtonClick = () => {
  // Пребразуем строку с текущим масштабом с % в десятичное число
  const currentValue = parseInt(scaleValue.value, 10);
  // Опредялям новое значение текущего масштаба
  const newValue = currentValue + SCALE_STEP;
  // Если новое значение текущего масштаба меньше или равно максимальному
  if (newValue <= MAX_SCALE) {
    // Вызываем функцию масштабирования с новым текущим значением масштаба
    scaleImage(newValue);
  }
};

// Функция сброса масштаба фото до начального масштаба

const resetScale = () => scaleImage(INITIAL_SCALE);

// Добавляем обработчик события click на кнопку уменьшения масштаба фото
smallerButton.addEventListener('click', onSmallerButtonClick);
// Добавляем обработчик события click на кнопку увеличения масштаба фото
biggerButton.addEventListener('click', onBiggerButtonClick);

export { resetScale };
