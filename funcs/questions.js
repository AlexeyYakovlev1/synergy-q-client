"use strict";

import Utils from "../classes/Utils.js";

/**
 * Рендер вопросов от системы в html чат
 * @param {Array<Array>} questions 
 */
export default function (questions) {
	questions.forEach((question) => {
		// Берем второй элемент массива каждого вопроса
		const [, text] = question;

		// Добавляем в html
		Utils.insertDataToHtml(
			document.querySelector("#listOfAnswers"),
			text,
			false,
			true
		);
	});
}