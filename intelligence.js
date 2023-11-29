"use strict";

// Импорты
import data from "./data.js";

import loadExcel from "./funcs/loadExcel.js";
import questions from "./funcs/questions.js";
import renderMessages from "./funcs/renderMessages.js";
import renderOneQuestion from "./funcs/renderOneQuestion.js";
import renderFaculties from "./funcs/renderFaculties.js";
import renderDiscs from "./funcs/renderDiscs.js";

import WebSocket from "./classes/WebsocketWork.js";
import Utils from "./classes/Utils.js";
import Cookie from "./classes/Cookie.js";
import Alert from "./classes/Alert.js";
import renderQuestionByUserRequest from "./funcs/renderQuestionByUserRequest.js";

// Селекторы
const buttonUploadToExcel = document.querySelector("#button-upload-to-excel");
const buttonGenerateQuestions = document.querySelector("#button-generate-questions");
const listOfAnswers = document.querySelector("#listOfAnswers");
const buttonUp = document.querySelector(".button-up");
const alertClose = document.querySelector(".alert__close");
const buttonClear = document.querySelector(".button-clear");
const buttonNextQuestion = document.querySelector("#button-nextQuestion");
const logout = document.querySelector(".user-do__btn.logout");

logout.addEventListener("click", () => {
	Cookie.set("token", "");
	window.location.href = "/auth/login.html";
});

// Типы отправки
const {
	UPLOAD_TO_EXCEL, GENERATE_QUESTIONS, GET_MESSAGES,
	ONE_QUESTION, INIT_FACULTIES, USER_REQUEST,
	GET_DISCS_BY_FACULTY
} = data.requests;

// При клике на кнопку очищаем куки и список сообщений
buttonClear.addEventListener("click", () => { Utils.clearChat() });

// При клике на скролл чата скроллим его
buttonUp.addEventListener("click", () => { Utils.scrollToUp(listOfAnswers) });

// При заходе на страницу сохраняем клиентский идентификатор и показываем кнопку очищения чата
document.addEventListener("DOMContentLoaded", () => {
	Utils.saveClientId();
});

// При открытии соединения выводим сообщения и рендерим факультеты
WebSocket.open((_) => {
	Utils.outputMessages();
	Utils.initFaculty();
});

// Получение ответа от сервера 
WebSocket.getAnswer((data) => {
	const fullData = JSON.parse(data);
	const { result, current_type } = fullData;

	switch (current_type) {
		// Получение вопроса на ввод темы от пользователя
		case USER_REQUEST:
			renderQuestionByUserRequest(fullData);
			break;
		// Загрузка excel файла 
		case UPLOAD_TO_EXCEL:
			loadExcel(result);
			break;
		// Генерация вопросов
		case GENERATE_QUESTIONS:
			questions(result);
			break;
		// Получение сообщений
		case GET_MESSAGES:
			renderMessages(result, listOfAnswers, current_type);
			Utils.showClearChat();
			break;
		// Генерация одного вопроса
		case ONE_QUESTION:
			renderOneQuestion(fullData, listOfAnswers);
			Utils.showClearChat();
			break;
		// Инициализация факультетов
		case INIT_FACULTIES:
			renderFaculties(result, fullData);
			Utils.selectView();
			Utils.selectDBByFaculty();
			break;
		case GET_DISCS_BY_FACULTY:
			renderDiscs(fullData);
			break;
	}
});

// Выгрузить в excel файл 
buttonUploadToExcel.addEventListener("click", () => {
	WebSocket.sendPayload(UPLOAD_TO_EXCEL, {
		client_id: Cookie.get("CLIENT_ID"),
		token: Cookie.get("token") ?? ""
	});
});

// Генерация новых вопросов 
buttonGenerateQuestions.addEventListener("click", () => {
	WebSocket.sendPayload(GENERATE_QUESTIONS, {
		client_id: Cookie.get("CLIENT_ID"),
		disc: Cookie.get("CURRENT_DISC") ?? "Право",
		faculty: Cookie.get("CURRENT_FACULTY") ?? "Экономика",
		token: Cookie.get("token") ?? ""
	});
});

// Закрытие оповещения
alertClose.addEventListener("click", () => { Alert.close(); });

// Генерация одного вопроса
buttonNextQuestion.addEventListener("click", () => {
	WebSocket.sendPayload(ONE_QUESTION, {
		client_id: Cookie.get("CLIENT_ID"),
		disc: Cookie.get("CURRENT_DISC") ?? "Право",
		faculty: Cookie.get("CURRENT_FACULTY") ?? "Экономика",
		token: Cookie.get("token") ?? ""
	});
});