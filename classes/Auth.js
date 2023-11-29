"use strict";

import Cookie from "./Cookie.js";
import Alert from "./Alert.js";
import Utils from "./Utils.js";

class Auth {
	constructor() {
		this.url = "http://localhost:4500/auth";
	}

	getBody(inputSelector) {
		const body = {};

		[...document.querySelectorAll(inputSelector)].forEach(({ name, value }) => {
			body[`${name}`] = value;
		});

		return body;
	}

	login(body) {
		Utils.waitResponse(true);

		fetch(`${this.url}/login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(body)
		})
			.then((response) => response.json())
			.then((data) => {
				const { token, success, errors, message } = data;

				if (!success || (errors && errors.length)) {
					Alert.show(success, errors ? errors[0].msg : message);
					Utils.answerCame();
					return;
				}

				Alert.show(success, "Успешный вход");

				Cookie.set("token", token);
				Utils.answerCame();

				window.location.href = "/index.html";
			});
	}

	checkToken(body, login = false) {
		Utils.waitResponse(true);

		fetch(`${this.url}/check_auth`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(body)
		})
			.then((response) => response.json())
			.then((data) => {
				const { success, message, token } = data;

				if (success && login) {
					window.location.href = "/index.html";
					Utils.answerCame();
					return;
				}

				if (!success && login) {
					Utils.answerCame();

					return;
				}

				if (!success) {
					Alert.show(success, message ?? "Ошибка доступа");
					Utils.answerCame();

					window.location.href = "/auth/login.html";
					return;
				}

				Cookie.set("token", token);
				Utils.answerCame();
			});
	}
}

export default new Auth();