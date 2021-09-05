// Этот файл загрузится и выполнится, если пользователь наберет ссылку на
// корень сайта ('...hostname/').
// В этом случае проверяем на каком языке страница загружалась в последний раз
// и перенапраляем на страницу с соответствующим языком.
// Если в localStorage не будет поля lang, то по умолчанию будет русский язык ('.../ru').

const url = new URL(window.location.href);
const { lang } = localStorage;

url.pathname = lang || 'ru';
window.location.replace(url.href);
