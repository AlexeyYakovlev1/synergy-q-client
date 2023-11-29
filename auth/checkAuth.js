import Cookie from "../classes/Cookie.js";
import Auth from "../classes/Auth.js";

window.addEventListener("load", () => {
	const token = Cookie.get("token") ?? null;

	if (!token) {
		window.location.href = "/auth/login.html";
		return;
	}

	Auth.checkToken({ token });
});