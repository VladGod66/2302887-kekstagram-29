// Модуль отрисовки фотоминиатюр на странице

// Находим шаблон и записываем его расположение в переменную
const pictureTemplate = document.querySelector('#picture');
// Получаем содержимое шаблона и записываем в переменную-объект
const photoTemplate = pictureTemplate.content.querySelector('.picture');

// Колбэкфункция создания одного элемента, содержащиего данные о реальном фото по шаблону

// В параметрах функции деструктурируем нужные поля массива описания фотографий
const createPhoto = ({ comments, description, likes, url, id }) => {
  // Клонируем шаблон во внутреннюю переменную функции
  const photo = photoTemplate.cloneNode(true);
  // Находим поле количества комментариев в копии шаблона и записываем туда реальную длину массива комментариев к фото
  photo.querySelector('.picture__comments').textContent = comments.length;
  // Находим поле описания фото в копии шаблона и записываем туда реальное описание фото
  photo.querySelector('.picture__img').alt = description;
  // Находим поле количества лайков и записываем туда реальное количество лайков к фото
  photo.querySelector('.picture__likes').textContent = likes;
  // Находим поле ссылки на фото в копии шаблона и записываем туда реальную ссылку на фото
  photo.querySelector('.picture__img').src = url;
  // Создаём дата-атрибут с идентификатором фото для будушей отрисовки модального окна с фото в большом размере
  photo.dataset.photoIndex = id;
  // Возвращем объект - элемент фотоминиатюры
  return photo;
};

// Основная функция модуля - отрисовывает фотоминиатюры(добавляет массив данных о фото в заданное место DOM-дерева)

// В параметр функции принимаем массив элементов, содержащих данные о кокретном фото и записываем в DOM
const renderMiniPhotos = (pictures, container) => {
  // Удаляем (очищаем перед перерисовкой фильтром) ранее отрисованные миниатюры
  container.querySelectorAll('.picture').forEach((element) => element.remove());
  // Создаём временный массив-объект для хранения фрагмента DOM-дерева с помощью метода createDocumentFragment()
  const fragment = document.createDocumentFragment();
  // Проходим по массиву элементов фото
  pictures.forEach((picture) => {
    // Создаём элемент DOM-дерева для каждого фото с помощью колбэк-функции createPhoto
    const photo = createPhoto(picture);
    // Записывем этот элемент в конец фрагмента DOM-элементов
    fragment.append(photo);
  });
  // Добавляем содержимое фрагмента DOM-дерева в определяемое параметром container место DOM-дерева
  container.append(fragment);
};

export { renderMiniPhotos };
