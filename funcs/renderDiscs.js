"use strict";

import WebSocket from "../classes/WebsocketWork.js";
import Cookie from "../classes/Cookie.js";

import data from "../data.js";

const { CONNECT_DB } = data.requests;

export default function (data) {
	const { result: { list }, active_disc } = data;

	document.querySelector(".disc-custom-select").classList.remove("hidden");
	const discSelectOptions = document.querySelector(".disc-select-options");

	list.forEach((disc) => {
		const active = disc === active_disc;

		discSelectOptions.insertAdjacentHTML("beforeend", `
			<div
				data-value="${disc}"
				class="${active ? 'active' : ''} disc-select-option"
				title="${disc}"
			>
				${disc}
			</div>
		`);
	});

	const discSelectOption = document.querySelectorAll(".disc-select-option");

	discSelectOption.forEach((item) => {
		item.addEventListener("click", () => {
			document.querySelector(".disc-select-selected span").textContent = item.dataset.value;

			if (item.dataset.value === "Выберите дисциплину") return;

			Cookie.set("CURRENT_DISC", item.dataset.value);

			const payload = {
				client_id: Cookie.get("CLIENT_ID"),
				token: Cookie.get("token") || "",
				faculty: Cookie.get("CURRENT_FACULTY"),
				disc: Cookie.get("CURRENT_DISC")
			};

			WebSocket.sendPayload(CONNECT_DB, payload);

			discSelectOption.forEach((el) => el.classList.remove("active"));
			item.classList.add("active");
		});
	});
}