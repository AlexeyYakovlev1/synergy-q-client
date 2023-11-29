"use strict";

import Alert from "../classes/Alert.js";
import Cookie from "../classes/Cookie.js";

export default function (result) {
	const { success, message, active_db, active_disc } = result;

	if (!success && message) {
		Alert.show(success, message);
		return;
	}

	// Сохраняем выбранный факультет
	Cookie.set("CURRENT_FACULTY", active_db);
	// Сохраняем выбранную дисциплину
	Cookie.set("CURRENT_DISC", active_disc)
}