"use strict";

import Utils from "./Utils.js";
import Alert from "./Alert.js";

import data from "../data.js";

const { UPLOAD_TO_EXCEL, GENERATE_QUESTIONS, ONE_QUESTION } = data.requests;

class WebsocketWork {
	constructor() {
		this._allowedTypes = data.requests;
		this.websocket = new WebSocket("ws://10.12.105.98");
		this.USER_REQUEST = data.USER_REQUEST
	}

	/**
	 * Отправка сообщения на сервер
	 * @param {string} type Тип отправки
	 * @param {obj} payload Данные для отправки
	 * @public
	 */
	sendPayload(type, payload) {
		if (!Object.values(this._allowedTypes).includes(type)) {
			throw new Error("Такого типа для отправки не существует");
		}

		const typesForCenterLoader = [UPLOAD_TO_EXCEL, GENERATE_QUESTIONS, ONE_QUESTION];

		Utils.waitResponse(typesForCenterLoader.includes(type));

		const obj = { type, payload };

		// Отправляем данные в формате json
		this.websocket.send(JSON.stringify(obj));
	}

	/**
	 * Соединение с сервером установлено
	 * @param {function} callback Функция, которая будет выполняться при соединении
	 * @public
	 */
	open(callback) {
		this.websocket.addEventListener("open", (event) => { callback(event); });
	}

	/**
	 * Соединение с сервером закрыто
	 * @public
	 */
	close(callback) {
		this.websocket.addEventListener("close", (event) => {
			callback(event);
		});
	}

	/**
	 * Соединение с сервером прервано ошибкой
	 * @param {function} callback Функция, которая будет выполняться при появлении ошибки
	 * @public 
	 */
	error(callback) {
		this.websocket.addEventListener("error", (event) => {
			callback(event);
		});
	}

	/**
	 * Получение ответа от сервера
	 * @param {function} callback Функция, которая будет выполняться при получении ответа
	 * @public
	 */
	getAnswer(callback = function (data) { console.log(JSON.parse(data)); }) {
		this.websocket.addEventListener("message", ({ data }) => {
			// Получение текущего типа отправки сообщения
			const { current_type, error_message } = JSON.parse(data);

			if (error_message) {
				Alert.show(false, error_message);
				return;
			}

			callback(data);

			Utils.answerCame();

			if (current_type !== this.USER_REQUEST) return;

			Utils.answerCame();

			// Добавление контента системы (от ии) в html
			Utils.insertDataToHtml(
				document.querySelector("#listOfAnswers"),
				data,
				true,
				true
			);
		});
	}
}

export default new WebsocketWork();