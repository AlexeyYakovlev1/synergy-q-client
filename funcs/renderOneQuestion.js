"use strict";

import Utils from "../classes/Utils.js";

export default function (fullData, list) {
	Utils.insertDataToHtml(list, fullData, false);
}