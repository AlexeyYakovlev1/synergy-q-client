"use strict";

class Cookie {
	/**
	 * Создание/Обновление куки
	 * @param {string} name название
	 * @param {string} value значение
	 * @param {number} days кол-во дней существования
	 * @public
	 */
	set(name, value, days) {
		let expires = "";

		if (days) {
			const date = new Date();

			date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
			expires = "; expires=" + date.toUTCString();
		}

		document.cookie = name + "=" + (value || "") + expires + "; path=/";
	}

	/**
	 * Получение значения
	 * @param {string} name название
	 * @public
	 */
	get(name) {
		const nameEQ = name + "=";
		const ca = document.cookie.split(";");

		for (let i = 0; i < ca.length; i++) {
			let c = ca[i];

			while (c.charAt(0) === " ") c = c.substring(1, c.length);

			if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
		}

		return null;
	}

	/**
	 * Удаление из куки
	 * @param {string} name название
	 * @public
	 */
	remove(name) {
		Cookies.remove(name);
	}
}

export default new Cookie();