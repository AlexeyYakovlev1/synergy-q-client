"use strict";

import WebSocket from "./WebsocketWork.js";
import Cookie from "./Cookie.js";
import data from "../data.js";

const { USER_REQUEST, GET_MESSAGES, INIT_FACULTIES, GET_CURRENT_FACULTY, USER_ANSWER, GET_DISCS_BY_FACULTY } = data.requests;
const { OPEN_RESPONSE, COMPARISON, SEQUENCE, ONE_ANSWER, MULTIPLE_CHOICE } = data.questionTypes;

class Utils {
	/**
	 * Прокрутка скролла списка сообщений
	 * @public
	 */
	scrollList(customHeight = -1) {
		const listOfAnswers = document.querySelector("#listOfAnswers");

		if (!listOfAnswers) return;

		if (customHeight !== -1) {
			listOfAnswers.scrollTop += customHeight;
			return;
		}

		const messages = document.querySelectorAll(".message");

		if (!messages.length) return;

		// Высота блока последнего сообщения
		const { offsetHeight } = [...messages].at(-1);

		// Опускаем скролл списка
		listOfAnswers.scrollTop += offsetHeight + 20;
	}

	/**
	 * Вставка запроса от пользователя в html
	 * @param {HTMLInputElement} input Элемент ввода
	 * @param {HTMLUListElement} listOfAnswers Список сообщений
	 * @public
	 */
	insertUserRequest(input, listOfAnswers) {
		let data = input;

		// Если в input приходит не input (html)
		if (input instanceof HTMLInputElement) {
			data = input.value;
		}

		// Добавление сообщения в чат
		listOfAnswers.insertAdjacentHTML("beforeend", `
			<li class="message user">
				<span>${data}</span>
			</li>
		`);

		if (input instanceof HTMLInputElement) {
			input.value = "";
		}

		// Опускаем скролл чата
		this.scrollList();

		// Показываем кнопку поднятия скролла
		this.showUpBtn();
		this.showClearChat();
	}

	/**
	 * Показываем кнопку поднятия чата вверх
	 * @public
	 */
	showUpBtn() {
		const list = document.querySelector("#listOfAnswers");

		let heightOfMessages = 0;

		// Получаем полную высоту всех сообщений
		[...document.querySelectorAll(".message")].forEach((item) => {
			heightOfMessages += Number(item.offsetHeight);
		});

		if (heightOfMessages >= list.offsetHeight) {
			document.querySelector(".button-up").classList.remove("hidden");
		} else {
			document.querySelector(".button-up").classList.add("hidden");
		}
	}

	/**
	 * Рендер формы ответа в зависимости от типа вопроса
	 * @param {Array<any>} inputData Данные вопроса
	 * @private
	 */
	_renderAnswerForm(inputData) {
		const { answer_options: answers, definition: definitions, question_text, question_type: matching } = inputData.result;
		const description = document.querySelector(".user__answer-description");
		const form = document.querySelector(".user__answer-form");

		function showForm() {
			document.querySelector(".user__answer").classList.remove("hidden");
			document.querySelector(".content__request").classList.add("hidden");
			document.querySelector(".user-do").classList.add("hidden");
		}

		switch (matching) {
			// Открытый ответ
			case OPEN_RESPONSE:
				description.textContent = `Текстовый ответ\n${question_text}`;

				form.innerHTML += `
					<label class="user__answer-open">
						Введите ответ:
						<input type="text" class="user__answer-input" />
					</label>
				`;

				showForm();
				break;
			// Последовательность
			case SEQUENCE:
				description.textContent = `Расположить в правильной последовательности\n${question_text}`;

				form.innerHTML += `<div class="user__answer-sequence"></div>`;

				// const hotFixAnswers = answers.length === 1 ? answers[0].split(", ")

				answers.forEach((answer) => {
					document.querySelector(".user__answer-sequence").innerHTML += `
						<span
							class="user__answer-sequence-item"
							data-answer="${answer}"
							draggable="true"
						>
							${answer}
						</span>
					`;
				});

				const draggables = document.querySelectorAll('.user__answer-sequence-item');
				const container = document.querySelector('.user__answer-sequence');

				draggables.forEach(item => {
					item.addEventListener('dragstart', () => {
						item.classList.add('active');
						item.setAttribute('draggable', true);
					});

					item.addEventListener('dragend', () => {
						item.classList.remove('active');
					});
				});

				container.addEventListener('dragover', event => {
					event.preventDefault();

					const afterElement = getDragAfterElement(container, event.clientY);
					const draggable = document.querySelector('.user__answer-sequence-item.active');

					if (afterElement == null) container.appendChild(draggable)
					else container.insertBefore(draggable, afterElement);
				});

				function getDragAfterElement(container, y) {
					const draggableElements = [...container.querySelectorAll('.user__answer-sequence-item:not(.active)')];

					return draggableElements.reduce((closest, child) => {
						const box = child.getBoundingClientRect();
						const offset = y - box.top - box.height / 2;
						if (offset < 0 && offset > closest.offset) {
							return { offset: offset, element: child };
						} else {
							return closest;
						}
					}, { offset: Number.NEGATIVE_INFINITY }).element;
				}

				showForm();
				break;
			case COMPARISON:
				description.textContent = `Сопоставление\n${question_text}`;

				form.innerHTML += `
					<ul class="options"></ul>
					<ul class="definitions user__answers-container"></ul>
				`;

				const firstSymbolsOfAnsw = answers.map((answer) => answer.slice(0, 2));
				const firstSymbolsOfDefinitions = definitions.map((definition) => definition.slice(0, 2));

				answers.forEach((answer, idx) => {
					form.querySelector(".options").innerHTML += `
						<li class="user__answers-comparison-answ">
							<span>${firstSymbolsOfAnsw[idx]}</span>
							<p>${answer}</p>
						</li>
					`;
				});

				definitions.forEach((definition, idx) => {
					form.querySelector(".definitions").innerHTML += `
						<li class="user__answers-comparison-defin">
							<span>${firstSymbolsOfDefinitions[idx]}</span>
							<p draggable="true">${definition}</p>
						</li>
					`;
				});

				form.innerHTML += `
					<div class="user__answers-comparison-footer user__answers-container">
						<p>Перетаскивая элементы мышью, сгруппируйте их в пары так, чтобы левый элемент в каждой паре соответствовал правому</p>
						<div class="user__answers-comparison-finish">
							<ul class="user__answers-comparison-list"></ul>
						</div>
					</div>
				`;

				answers.forEach((answer) => {
					document.querySelector(".user__answers-comparison-list").innerHTML += `
						<li>
							<span class="user__answers-comparison-list-answ">${answer}</span>
							<span><-----></span>
							<span class="user__answers-comparison-list-user"></span>
						</li>
					`;
				});

				document.querySelectorAll(".user__answers-comparison-defin p").forEach((item) => {
					// Взяли и зажали
					item.addEventListener("dragstart", () => {
						item.classList.add("active");
					});

					// Бросили
					item.addEventListener("dragend", () => {
						item.classList.remove("active");
					});
				});

				document.querySelectorAll(".user__answers-container").forEach((item) => {
					item.addEventListener("dragover", (event) => {
						event.preventDefault();

						const dragElActive = document.querySelector(".user__answers-comparison-defin p.active");

						if (!dragElActive) return;

						const dragElSymbol = dragElActive.textContent;

						if (event.target.className === "user__answers-comparison-list-user") {
							event.target.textContent = dragElSymbol;
							event.target.classList.add("set");
							dragElActive.parentElement.children[0].remove();
							dragElActive.remove();
						}
					});
				});

				showForm();
				break;
		}

		this._giveSolution(matching);
	}

	/**
	 * Нажатие на кнопку "ответить"
	 * @private
	 */
	_giveSolution(type) {
		document.querySelector(".user__answer-finish").addEventListener("click", () => {
			const data = { data: { type } };

			switch (type) {
				case OPEN_RESPONSE:
					data.data.result = document.querySelector(".user__answer-input").value;
					break;
				case SEQUENCE:
					data.data.result = [...document.querySelectorAll(".user__answer-sequence-item")]
						.map((item) => item.dataset.answer.slice(0, 1))
						.join(", ");
					break;
				case COMPARISON:
					data.data.result = [...document.querySelectorAll(".user__answers-comparison-list li")]
						.map((li) => `${li.children[0].textContent.slice(0, 1)}${[...li.children].at(-1).textContent.slice(0, 1)}`)
						.join(", ");
					break;
			}

			WebSocket.sendPayload(USER_ANSWER, { client_id: Cookie.get("CLIENT_ID"), answer: data, token: Cookie.get("token") ?? "" });
		});
	}

	/**
	 * Парсит текст в markdown
	 * @param {string} markdownText markdown текст для парсинга
	 * @private
	 */
	_parseMarkdown(markdownText) {
		let res = markdownText;

		// Заменяем заголовки (одна или несколько # в начале строки)
		res = res.replace(/^#+\s+(.*)$/gm, function (match, title) {
			const level = match.trim().length;

			return `<h${level}>${title}</h${level}>`;
		});

		// Заменяем жирный текст
		res = res.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

		// Заменяем ссылки [текст](ссылка)
		res = res.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');

		// Заменяем переносы строк
		res = res.replace(/\n/g, '<br>');

		// Добавляем замену курсивного текста
		res = res.replace(/\*(.*?)\*/g, '<em>$1</em>');

		return res;
	}

	/** 
	 * Вставка ответа от ии в html 
	 * @param {HTMLUListElement} listOfAnswers Список сообщений 
	 * @param {string} data Объект в формате JSON с данными от ии
	 * @param {boolean} json Содержит ли data json формат для преобразования его в объект
	 * @param {boolean} questions На вход приходят вопросы
	 * @public
	 */
	insertDataToHtml(listOfAnswers, data, json = true, questions = false) {
		if (typeof data === "string" && !json) {
			listOfAnswers.insertAdjacentHTML("beforeend", `
				<li class="message system">
					<img class="avatar" src="../assets/avatar1.jpg" />
					<span>${this._parseMarkdown(data)}</span>
				</li>
			`);

			return;
		}

		const result = json ? { ...data, result: JSON.parse(data.result) } : data;
		const {
			answer_options: answers, question_text: question,
			question_type: questionType, correct_answer: correctAnswer,
			definition: definitions
		} = result.result;

		let text = `## **Тип задания**:\n`;

		switch (questionType) {
			case SEQUENCE:
				text += `Последовательность\n\n`;
				text += `## **Задание**:\n${question}\n\n`;
				text += "## **Варианты ответов**:\n";

				answers.forEach((answer) => { text += `${answer}\n`; });
				text += "\n";
				break;
			case OPEN_RESPONSE:
				text += `Открытый ответ\n\n`;
				text += `## **Задание**:\n${question}\n\n`;
				break;
			case COMPARISON:
				text += 'Соответствие\n\n';
				text += `## **Задание**:\n${question}\n\n`;

				text += `## **Список 1**:\n`;
				answers.forEach((answer) => { text += `${answer}\n`; });
				text += "\n";

				text += `## **Список 2**:\n`;
				definitions.forEach((item) => { text += `${item}\n`; });
				text += "\n";
				break;
			case ONE_ANSWER:
				text += `Одно верное утверждение\n\n`;
				text += `## **Задание**:\n${question}\n\n`;

				text += `## **Варианты ответов**:\n`;
				answers.forEach((answer) => { text += `${answer}\n`; });
				text += "\n";
				break;
			case MULTIPLE_CHOICE:
				text += `Несколько верных утверждений\n\n`;
				text += `## **Задание**:\n${question}\n\n`;

				text += `## **Варианты ответов**:\n`;
				answers.forEach((answer) => { text += `${answer}\n`; });
				text += "\n";
				break;
		}

		text += `## **Правильный ответ**:\n${correctAnswer}`;

		if (!questions) {
			listOfAnswers.insertAdjacentHTML("beforeend", `
				<li class="message system">
					<img class="avatar" src="../assets/avatar1.jpg" />
					<span></span>
				</li>
			`);

			this.lineByLine(text, [...document.querySelectorAll(".message.system span")].at(-1));
		} else {
			listOfAnswers.insertAdjacentHTML("beforeend", `
				<li class="message system">
					<img class="avatar" src="../assets/avatar1.jpg" />
					<span>${text}</span>
				</li>
			`);
		}

		this.scrollList();
	}

	/**
	 * Ожидание ответа от сервера
	 * @param {boolean} center Вид загрузчика
	 * @public
	 */
	waitResponse(center = false) {
		if (center) {
			document.querySelector(".loader-center").classList.remove("hidden");
		} else {
			document.querySelector("#listOfAnswers").insertAdjacentHTML("beforeend", `
				<li class="msg-loader">
					<span class="loader"></span>
				</li>
			`);
		}

		document.querySelectorAll(".user-do__btn").forEach((btn) => btn.setAttribute("disabled", "true"));
	}

	/**
	 * Ответ получен
	 * @public
	 */
	answerCame() {
		const msgLoader = document.querySelector(".msg-loader");

		if (msgLoader) {
			document.querySelector(".msg-loader").remove();
		} else {
			document.querySelector(".loader-center").classList.add("hidden");
		}

		document.querySelectorAll(".user-do__btn").forEach((btn) => btn.removeAttribute("disabled"));
	}

	/**
	 * Отправка запроса ввода пользователя
	 * @param {HTMLInputElement} input Ввод
	 * @public
	 */
	sendUserRequest(input) {
		if (!input.value) return;

		// Ждем ответа от сервера
		this.waitResponse();

		// Отправляем данные на сервер с типом USER_REQUEST
		WebSocket.sendPayload(USER_REQUEST, {
			query: input.value, client_id: Cookie.get("CLIENT_ID"),
			token: Cookie.get("token") ?? ""
		});

		this.insertUserRequest(input, document.querySelector("#listOfAnswers"));
	}

	/**
	 * Генерация уникального идентификатора
	 * @public
	 */
	generateId() {
		return Math.random().toString(16).slice(2);
	}

	/**
	 * Генерация уникального идентификатора для client_id
	 * @private
	 */
	_generateUniqueId() {
		return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
			const r = Math.random() * 16 | 0,
				v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	}

	/**
	 * Сохранение clientId в cookie
	 * @public
	 */
	saveClientId() {
		let clientId = this._generateUniqueId();

		if (Cookie.get("CLIENT_ID")) clientId = Cookie.get("CLIENT_ID");

		Cookie.set("CLIENT_ID", clientId);
	}

	/**
	 * Получить данные из excel таблицы
	 * @private
	 */
	_getFromExcel() {
		WebSocket.sendPayload(GET_MESSAGES, { client_id: Cookie.get("CLIENT_ID"), token: Cookie.get("token") ?? "" });
	}

	/**
	 * Получить данные из excel таблицы
	 * @public
	 */
	outputMessages() {
		this._getFromExcel();
	}

	/**
	 * Прокрутка к первому сообщению
	 * @param {HTMLUListElement} listOfAnswers Список сообщений
	 * @public
	 */
	scrollToUp(listOfAnswers) {
		listOfAnswers.scrollTo({ top: 0, behavior: 'smooth' });
	}

	/**
	 * Очистить чат
	 * @public
	 */
	clearChat() {
		Cookie.remove("CLIENT_ID");

		document.querySelector("#listOfAnswers").innerHTML = "";

		this.saveClientId();
	}

	/**
	 * Построчный вывод текста
	 * @param {string} text Текст для вывода
	 * @param {HTMLElement} output Элемент, в который будет выводиться текст
	 * @param {number} period Интервал между добавлением слов
	 * @public
	 */
	lineByLine(text, output, period = 50) {
		const words = text.split(" ");

		let i = 0;

		let timer = setInterval(() => {
			const square = document.querySelector(".square");

			if (square !== null) square.remove();

			let res = "";

			if (words[i + 1] === undefined) {
				clearInterval(timer);
				timer = null;
			}

			res += `${words[i]} `;

			i++;

			output.innerHTML += res;
			output.innerHTML += `<span class="square" style="color: lightgray; font-size: 12px;">▮</span>`;

			this.scrollList(20);
		}, period);

		const checkStatus = setInterval(() => {
			if (!timer) {
				document.querySelector(".square").remove();
				clearInterval(checkStatus);
				output.innerHTML = this._parseMarkdown(text);
			}
		}, 0);
	}

	/**
	 * Показать кнопку очищения чата
	 * @public
	 */
	showClearChat() {
		const buttonClear = document.querySelector(".button-clear");
		const messages = [...document.querySelectorAll(".message")];

		if (messages.length) {
			buttonClear.classList.remove("hidden");
		} else {
			buttonClear.classList.add("hidden");
		}
	}

	/**
	 * Инициализация факультетов и дисциплин
	 */
	initFaculty() {
		const currentFaculty = Cookie.get("CURRENT_FACULTY");
		const currentDisc = Cookie.get("CURRENT_DISC");

		WebSocket.sendPayload(INIT_FACULTIES, {
			client_id: Cookie.get("CLIENT_ID"),
			token: Cookie.get("token") || "",
			active_db: currentFaculty,
			active_disc: currentDisc
		});
	}

	/**
	 * Визуал для выбора факультета и дисциплины
	 */
	selectView() {
		const discCustomSelect = document.querySelector(".disc-custom-select");
		const discSelectSelected = discCustomSelect.querySelector(".disc-select-selected");
		const discSelectOptions = discCustomSelect.querySelector(".disc-select-options");
		const discSelectOptionItems = discCustomSelect.querySelectorAll(".disc-select-option");
		const discSelectArrow = discCustomSelect.querySelector(".disc-select-arrow");

		const facultyCustomSelect = document.querySelector(".faculty-custom-select");
		const facultySelectSelected = facultyCustomSelect.querySelector(".faculty-select-selected");
		const facultySelectOptions = facultyCustomSelect.querySelector(".faculty-select-options");
		const facultySelectOptionItems = facultyCustomSelect.querySelectorAll(".faculty-select-option");
		const facultySelectArrow = facultyCustomSelect.querySelector(".faculty-select-arrow");

		document.addEventListener("DOMContentLoaded", () => {
			const faculty = Cookie.get("CURRENT_FACULTY") || "Выберите факультет";
			const disc = Cookie.get("CURRENT_DISC") || "Выберите дисциплину";

			facultySelectSelected.children[0].textContent = faculty;
			facultySelectSelected.setAttribute("title", faculty);

			discSelectSelected.children[0].textContent = disc;
			discSelectSelected.setAttribute("title", disc);
		});

		discCustomSelect.addEventListener("click", () => {
			discSelectOptions.classList.toggle("hidden");
			discSelectArrow.classList.toggle("rotate");
		});

		discSelectOptionItems.forEach((option) => {
			option.addEventListener("click", (event) => {
				event.stopPropagation();

				const value = option.getAttribute("data-value");

				discSelectSelected.children[0].textContent = option.textContent;
				discSelectSelected.setAttribute("title", option.textContent);

				discSelectOptions.classList.add("hidden");
				discSelectArrow.classList.remove("rotate");

				Cookie.set("CURRENT_DISC", value);
			});
		});

		facultyCustomSelect.addEventListener("click", (event) => {
			event.stopPropagation();

			facultySelectOptions.classList.toggle("hidden");
			facultySelectArrow.classList.toggle("rotate");
		});

		facultySelectOptionItems.forEach((option) => {
			option.addEventListener("click", (event) => {
				event.stopPropagation();

				const value = option.getAttribute("data-value");

				facultySelectSelected.children[0].textContent = option.textContent;
				facultySelectSelected.setAttribute("title", option.textContent);

				facultySelectOptions.classList.add("hidden");
				facultySelectArrow.classList.remove("rotate");

				Cookie.set("CURRENT_FACULTY", value);
			});
		});
	}

	/**
	 * Подключение к конкретной бд в зависимости от выбранного факультета
	 */
	selectDBByFaculty() {
		const facultySelectOption = document.querySelectorAll(".faculty-select-option");

		facultySelectOption.forEach((item) => {
			item.addEventListener("click", () => {
				if (item.dataset.value === "Выберите факультет") return;

				const payload = {
					client_id: Cookie.get("CLIENT_ID"),
					faculty: Cookie.get("CURRENT_FACULTY"),
					token: Cookie.get("token") || ""
				};

				document.querySelector(".disc-select-options").innerHTML = "";

				Cookie.set("CURRENT_DISC", "Выберите дисциплину");
				Cookie.set("CURRENT_FACULTY", item.dataset.value);

				WebSocket.sendPayload(GET_DISCS_BY_FACULTY, payload);

				facultySelectOption.forEach((el) => el.classList.remove("active"));
				item.classList.add("active");
			});
		});
	}
}

export default new Utils();