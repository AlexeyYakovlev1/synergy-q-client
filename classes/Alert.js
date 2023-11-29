"use strict";

class Alert {
	constructor() {
		this.alertElement = document.querySelector(".alert");
	}

	/**
	 * Показать оповещение
	 * @param {boolean} success Тип сообщения (успех, ошибка)
	 * @param {string} message Сообщение
	 * @param {boolean} timeClose Закрывать сообщение спустя определенное кол-во времени
	 * @public
	 */
	show(success, message, timeClose = true) {
		this.close();

		this.alertElement.style.display = "block";
		this.alertElement.className = `alert ${success ? "success" : "error"}`;

		document.querySelector(".alert__title").textContent = success ? "Успех" : "Ошибка";
		document.querySelector(".alert__text").textContent = message;

		// После показа закрываем через определенное кол-во времени
		timeClose ? this._closeThroughTime() : false;
	}

	/**
	 * Закрыть оповещение
	 * @public
	 */
	close() {
		this.alertElement.style.display = "none";
		this.alertElement.className = "alert";

		document.querySelector(".alert__text").textContent = "";
		document.querySelector(".alert__title").textContent = "";
	}

	/**
	 * Закрыть через 10 сек
	 * @param {number} time Время, через которое закроется оповещение
	 * @private
	 */
	_closeThroughTime(time = 10000) {
		setTimeout(() => { this.close(); }, time);
	}
}

export default new Alert();