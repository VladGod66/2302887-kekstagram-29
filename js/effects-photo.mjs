// Модуль применения эффектов к предварительному просмотру фото перед публикацией

// Определяем массив объектов, описывающих параметры эффектов по ТЗ для применения в noUiSlider
const Effects = [
  {
    NAME: 'none',
    FILTER: 'none',
    RANGE: {min: 0, max: 100},
    STEP: 1.00,
    UNIT : ''
  },
  {
    NAME: 'chrome',
    FILTER: 'grayscale',
    RANGE: {min: 0, max: 1.00},
    STEP: 0.10,
    UNIT : ''
  },
  {
    NAME: 'sepia',
    FILTER: 'sepia',
    RANGE: {min: 0, max: 1.00},
    STEP: 0.10,
    UNIT : ''
  },
  {
    NAME: 'marvin',
    FILTER: 'invert',
    RANGE: {min: 0, max: 100},
    STEP: 1.00,
    UNIT : '%'
  },
  {
    NAME: 'phobos',
    FILTER: 'blur',
    RANGE: {min: 0, max: 3},
    STEP: 0.10,
    UNIT : 'px'
  },
  {
    NAME: 'heat',
    FILTER: 'brightness',
    RANGE: {min: 1.00, max: 3},
    STEP: 0.10,
    UNIT : ''
  }
];

// Создаём объект эффекта по умолчанию
const DEFAULT_EFFECT = Effects[0];
// Присваиваем текущему объекту эффект по умолчанию
let currentEffect = DEFAULT_EFFECT;

// Находим изображение в элементе предварительного просмотра фото
const previewImage = document.querySelector('.img-upload__preview img');
// Находим форму, содержащую наложение эффектов
const effectsContainer = document.querySelector('.img-upload__effects');
// Находим элемент будущего расположения движка слайдера
const effectSlider = document.querySelector('.effect-level__slider');
// Находим элемент содержащий атрибут уровня эффекта
const effectValue = document.querySelector('.effect-level__value');
// Находим элемент содержащий поле слайдера
const effectLevel = document.querySelector('.img-upload__effect-level');

// Функция перевключения слайдера с другим эффектом

const updateSlider = () => {
  // Переприсваеваем параметры слайдера на выбранный эффект с помощью метода updateOptions библиотеки noUiSlider
  effectSlider.noUiSlider.updateOptions({
    range: currentEffect.RANGE,
    step: currentEffect.STEP,
    start: currentEffect.RANGE.max,
  });
  // Если выбранный эффект - отсутвие эффектов, то скрываем слайдер
  if (currentEffect === DEFAULT_EFFECT) {
    effectLevel.classList.add('hidden');
    //В противном случае показываем слайдер
  } else {
    effectLevel.classList.remove('hidden');
  }
};

// Функция вызова слайдера с другим  эффектом

const onEffectChange = (evt) => {
  // При целевом событии определяем тип эффекта и находим объект с параметрами эффекта
  currentEffect = Effects.find((effect) => effect.NAME === evt.target.value);
  // Меняем имя класса элемента предварительного просмотра фото для применеия выбранного эффекта
  previewImage.className = `effects__preview--${currentEffect.NAME}`;
  // Перевключаем слайдер эффектов с новыми параметрами для выбранного эффекта
  updateSlider();
};

// Функция определения текущей позиции ручки слайлдера

const onSliderUpdate = () => {
  // Считываем текущее значение уровня эффекта слайдера методом get внешней библиотеки noUiSlider
  const sliderValue = effectSlider.noUiSlider.get();
  // Сохраняем текущее значение в атрибуте value элемента поля ввода
  effectValue.value = sliderValue;
  // Если эффектов нет, задаём слайдеру параметры эффекта по умолчанию
  if (currentEffect === DEFAULT_EFFECT) {
    previewImage.style.filter = DEFAULT_EFFECT.FILTER;
    // Если эффект выбран, записываем текущие париметры слайдера, включая позицию ручки
  } else {
    previewImage.style.filter = `${currentEffect.FILTER}(${sliderValue}${currentEffect.UNIT})`;
  }
};

// Функция сброса эффекта

const resetEffect = () => {
  // Переприсваеваем параметры текущего эффекта на параметры с отсутвием эффектов
  currentEffect = DEFAULT_EFFECT;
  // Перевключаем слайдер с отсутствием эффектов
  updateSlider();
};

// Создаём слайдер через обращенике к внешней библиотеке noUiSlider

noUiSlider.create(effectSlider, {
  // Задаём параметры слайдера из объекта массива параметров эффектов по умолчанию, т.е. без эффекта
  // Диапазон слайдера
  range: DEFAULT_EFFECT.RANGE,
  // Шаг слайдера
  step: DEFAULT_EFFECT.STEP,
  // Начальная позиция ручки слайдера
  start: DEFAULT_EFFECT.RANGE.max,
  // Область пдкрашивания (слева от ручки)
  connect: 'lower',
  // Формат вывода значений
  format: {
    // В слайдере
    to: function (value) {
      if (Number.isInteger(value)) {
        // Если число целое выводим 2 знака после запятой (при 0 автотест e2e выдвёт ошибку)
        return value.toFixed(2);
      }// Если дробное выводим 2 знака после запятой
      return value.toFixed(2);
    },// Из слайдера
    from: function (value) {
      return parseFloat(value);
    },
  },
});
// Скрываем слайдер, т.к. эффект пока не задан
effectLevel.classList.add('hidden');

// Обращаемся к методу on библиотеки noUiSlider и при событии update (перемещение ручки слайдера пользователем) вызываем функцию определения позиции ручки слайдера
effectSlider.noUiSlider.on('update', onSliderUpdate);
// Добавляем обработчик события change на контейнер с эффектами
effectsContainer.addEventListener('change', onEffectChange);

export {resetEffect};
