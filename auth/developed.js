import Utils from "../classes/Utils.js";

const developed = document.querySelector(".developed p");
const text = "developed by *security department*";

Utils.lineByLine(text, developed, 400);