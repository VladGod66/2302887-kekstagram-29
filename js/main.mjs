//Основной модуль сайта-приложения

import { getData, showAlert } from './creates-api.mjs';
import { renderGallery } from './renders-gallery.mjs';
import { userFotoFormSubmit } from './upload-form.mjs';
import { sortingGallery } from './sort-photos.mjs';
import './upload-photo.mjs';

//Делаем запрос на получение массива объектов фото от сервера
getData()
  // Возвращаем объект promise с будущим ответом сервера и, если он перейдёт в состояние fulfilled (успешно выполнено), вызываем метод then и передаём ему колбэк с массивом объектов ответа
  .then((usersPhotos) => {
    //Отрисовываем галерею однократно в порядке полученого от сервера массива фото
    renderGallery(usersPhotos);
    //Запускаем основную функцию циклической перерисовки галереи при выборе сортировки с устранением дребезга выбора способа сортировки
    sortingGallery(usersPhotos);
  })
  // А если он перейдёт в состояние rejected (выполнено с ошибкой) вызываем метод catch и передаём ему колбэк с сообщением об ошибке
  .catch((err) => {
    showAlert(err.message);
  });
//Запускаем функцию вывода формы предварительного просмотра, редактирования и публикации фото на сервере
userFotoFormSubmit();
