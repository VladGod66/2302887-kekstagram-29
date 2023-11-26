// Модуль взаимодействия с сервером

// Определяем базовый путь к серверу и Приложению kekstagram на нём
const BASE_URL = 'https://29.javascript.pages.academy/kekstagram';
// Определяем путь обращения (маршрут) для получения и отправки данных относительно корневого каталога Приложения на сервере
const Route = {
  GET_DATA: '/data',
  SEND_DATA: '/',
};
// Определяем время показа сообщения об ошибке загрузки данных с сервера
const ALERT_SHOW_TIME = 7000;

// Определям текст сообщения об ошибке загрузки данных с сервера
const ERROR_GET = 'Не удаётся загрузить данные. Проверьте подключение к сети !';
//Определям текст сообщения об ошибке отпраки данных на сервер
const ERROR_SEND = 'Не удаётся отправить форму. Проверьте подключение к сети';

// Функция отправки запроса на сервер
const serverRequest = (route, errorText, method = 'GET', body = null) =>
  // Запускаем метод fetch и передаём ему путь обращения и объект настроек с дополнительными параметрами метода и объект тела запроса
  fetch(`${BASE_URL}${route}`, {method, body})
    // Возвращаем объект promise с будущим ответом сервера и, когда он придёт, вызываем метод then и передаём ему колбэк с объектом ответа
    .then((response) => {
      // Проверяем свойство ответа сервера ок и если оно false
      if (!response.ok) {
        // Бросаем ошибку запроса (исключение) к серверу и переходим в секцию catch
        throw new Error();
      }
      // Возвращаем результат выполнения метода json к данным ответа сервера (т.е. преобразуем строку с данными json в объект js)
      return response.json();
    })
    // Вызываем метод catch и передаём ему колбэк с текстом ошибки
    .catch(() => {
      throw new Error(errorText);
    });


// Функция получения данных с сервера методом GET

const getData = () => serverRequest(Route.GET_DATA, ERROR_GET, 'GET');

// Функция отправки данных на сервер методом POST

const sendData = (body) => serverRequest(Route.SEND_DATA, ERROR_SEND, 'POST', body);

// Функция создания и стилизации сообщения об ошибке загрузки данных с сервера

const showAlert = (message) => {
  // Создаём шаблон элемента сообщения об ошибке
  const alert = document.createElement('div');
  // Стилизуем сообщение об ошибке
  alert.style.position = 'absolute';
  alert.style.left = '0';
  alert.style.top = '0';
  alert.style.right = '0';
  alert.style.padding = '10px 3px';
  alert.style.fontSize = '20px';
  alert.style.textAlign = 'center';
  alert.style.background = '#df4115';
  // Добавляем текст сообщения об ошибке
  alert.textContent = message;
  // Добавляем шаблон в DOM
  document.body.append(alert);
  // Используем встроенную функцию задержки для удаления сообщения об ошибке
  setTimeout(() => {
    alert.remove();
  }, ALERT_SHOW_TIME);
};

export {getData, sendData, showAlert};
