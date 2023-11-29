import Auth from "../classes/Auth.js";
import Cookie from "../classes/Cookie.js";

window.addEventListener("load", () => {
	const token = Cookie.get("token") ?? null;

	Auth.checkToken({ token }, true);
});

const form = document.querySelector('.form');
const alertClose = document.querySelector(".alert__close");

form.addEventListener("submit", (event) => {
	event.preventDefault();

	const body = Auth.getBody(".form__input");

	Auth.login(body);
});

// Закрытие оповещения
alertClose.addEventListener("click", () => { Alert.close(); });