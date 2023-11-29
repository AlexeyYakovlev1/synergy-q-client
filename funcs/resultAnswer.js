"use strict";

import Utils from "../classes/Utils.js";
import Alert from "../classes/Alert.js";

export default function (result) {
	const { check, correct_answer, question_text, answer_options, definition } = result;

	Alert.show(check === "Вы ответили правильно", check);

	let resText = `Вопрос: ${question_text}\n`;

	if (Array.isArray(correct_answer)) {
		resText += "Правильный ответ:\n";

		correct_answer.forEach((answer) => { resText += `${answer}\n`; });
	}

	if (answer_options) {
		resText += "Варианты:\n";

		answer_options.forEach((answer) => { resText += `${answer}\n`; });
	}

	if (definition) {
		definition.forEach((item) => { resText += `${item}\n`; });
	}

	if (typeof correct_answer === "string") resText += correct_answer;

	// Удаляем старую форму ответа
	const userAnswer = document.querySelector(".user__answer");

	userAnswer.classList.add("hidden")

	while (userAnswer.firstChild) {
		userAnswer.removeChild(userAnswer.firstChild);
	}

	document.querySelector(".content__request").classList.remove("hidden");
	document.querySelector(".user-do").classList.remove("hidden");

	userAnswer.innerHTML += `
		<p class="user__answer-description"></p>
		<div class="user__answer-form"></div>
		<button class="user__answer-finish">Ответить</button>
	`;

	Utils.insertDataToHtml(
		document.querySelector("#listOfAnswers"),
		resText,
		false
	);
}