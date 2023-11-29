"use strict";

import Utils from "../classes/Utils.js";

/**
 * Рендер всех сообщений чата с сервера
 * @param {string} result 
 * @param {HTMLUListElement} list 
 * @returns 
 */
export default function (result, list, currentType) {
	if (typeof result !== "string" && result.empty === "") return;

	const messages = JSON.parse(result);

	let startMessage = "User";

	// Определяем кто начал первый диалог (System or User)
	for (const message in messages[0]) {
		if (messages[0].hasOwnProperty(message)) {
			if (messages[0][message] !== null) {
				startMessage = message;
				break;
			}
		}
	}

	for (let i = 0; i < messages.length; i++) {
		// Если общение первая начала система
		if (startMessage === "System") {
			// Если сообщение начал пользователь
			if (messages[i].System !== null && messages[i].System !== undefined) {
				Utils.insertDataToHtml(list, messages[i].System, false, true);
				Utils.scrollList();
			}

			// Если сообщение начал пользователь
			if (messages[i + 1] && (messages[i + 1].User !== null && messages[i + 1].User !== undefined)) {
				Utils.insertUserRequest(messages[i + 1].User, list);
			}
			// Если общение первым начал пользователь
		} else if (startMessage === "User") {
			// Если сообщение начала система
			if (messages[i].User !== null && messages[i].User !== undefined) {
				Utils.insertUserRequest(messages[i].User, list);
			}

			// Если сообщение начала система
			if (messages[i + 1] && (messages[i + 1].System !== null && messages[i + 1].System !== undefined)) {
				Utils.insertDataToHtml(list, messages[i].System, false, true);
				Utils.scrollList();
			}
		}
	}
}