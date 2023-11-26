// Модуль выбора файла для предварительного просмотра и редактирования перед загрузкой


// Опредяляем допустимые типы файлов фото
const FILE_TYPES = ['jpg', 'jpeg', 'png'];
// Находим элемент расположения скрытого поля выбора файла для загрузки
const fileChooser = document.querySelector('.img-upload__input');
// Находим элемент расположения файла для предварительного просмотра
const uploadPreview = document.querySelector('.img-upload__preview img');
// Находим форму загрузки модального окна публикации фото
const uploadForm = document.querySelector('.img-upload__form');
// Находим иконки эффектов
const effectsPreviews = uploadForm.querySelectorAll('.effects__preview');

// Добавляем обработчик события change на кнопку Загрузить
fileChooser.addEventListener('change', () => {
  // И в случае нажатия записываем первый выбранный файл в виде объекта массива
  const file = fileChooser.files[0];
  // Находим в объекте имя загружаемого файла и переводим его в нижний регистр для унификации
  const fileName = file.name.toLowerCase();
  // Проверяем тип выбранного файла через сравнение окончания имени с массивом допустимых окончаний, итерированного методом some
  const matches = FILE_TYPES.some((value) => fileName.endsWith(value));
  // Если тип верен
  if (matches) {
    // Заменяем в DOM путь дефолтного файла для предварительного просмотра на путь к выбранному файлу методом createObjectURL, применённый к встроенному в браузер  объекту URL
    uploadPreview.src = URL.createObjectURL(file);
    //Проходим по иконкам эффектов
    effectsPreviews.forEach((preview) => {
      //Заменяем фото в иконках на выбранный к загрузке фыйл через стилизацию и добавление фонового изображения
      preview.style.backgroundImage = `url('${uploadPreview.src}')`;
    });
  }
});
