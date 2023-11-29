"use strict";

// Типы запросов
export default {
	requests: {
		USER_REQUEST: "USER-REQUEST",
		NEW_DIALOG: "NEW-DIALOG",
		UPLOAD_TO_EXCEL: "UPLOAD-TO-EXCEL",
		GENERATE_QUESTIONS: "GENERATE-QUESTIONS",
		GET_MESSAGES: "GET-MESSAGES",
		ONE_QUESTION: "ONE-QUESTION",
		INIT_FACULTIES: "INIT-FACULTIES",
		GET_CURRENT_FACULTY: "GET-CURRENT-FACULTY",
		CHECK_ANSWER: "CHECK-ANSWER",
		GET_DISCS_BY_FACULTY: "GET-DISCS-BY-FACULTY",
		CONNECT_DB: "CONNECT-DB"
	},
	questionTypes: {
		ONE_ANSWER: "Задание с выбором одного верного утверждения",
		MULTIPLE_CHOICE: "Задание с множественным выбором ответов",
		OPEN_RESPONSE: "Задание где пользователь должен вставить пропущенное ключевое слово в ____ без вариантов ответов",
		COMPARISON: "Задание на соответствие между вариантами ответов и определениями",
		SEQUENCE: "Задание на последовательность из предоставленных вариантов ответов",
	}
};