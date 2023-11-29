"use strict";

import Cookie from "../classes/Cookie.js"

export default function (result, fullData) {
	const { faculties } = result;
	const { active_db, active_disc, list_of_discs } = fullData;

	Cookie.set("CURRENT_FACULTY", active_db);

	document.querySelector(".faculty-select-selected span").textContent = active_db;

	if (active_disc) {
		document.querySelector(".disc-custom-select").classList.remove("hidden");
		document.querySelector(".disc-select-selected span").textContent = active_disc;
	}

	if (list_of_discs) {
		list_of_discs.forEach((disc) => {
			const active = disc === active_disc;

			document.querySelector(".disc-select-options").insertAdjacentHTML("beforeend", `
				<div
					data-value="${disc}"
					class="${active ? 'active' : ''} disc-select-option"
					title="${disc}"
				>
					${disc}
				</div>
			`);
		});
	}

	const facultySelectOptions = document.querySelector(".faculty-select-options");

	// рендер факультетов
	faculties.forEach((faculty) => {
		const active = faculty === active_db;

		facultySelectOptions.insertAdjacentHTML("beforeend", `
			<div
				data-value="${faculty}"
				class="${active ? 'active' : ''} faculty-select-option"
				title="${faculty}"
			>
				${faculty}
			</div>
		`);
	});
}