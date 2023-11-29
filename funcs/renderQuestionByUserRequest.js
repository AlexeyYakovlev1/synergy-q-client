"use strict";

import Utils from "../classes/Utils.js";

export default function (fullData) {
	const list = document.querySelector("#listOfAnswers");

	if (typeof fullData === "object") {
		Utils.insertDataToHtml(list, fullData, false)
	} else if (JSON.parse(fullData.result).question) {
		Utils.insertDataToHtml(list, fullData, true);
	}
}