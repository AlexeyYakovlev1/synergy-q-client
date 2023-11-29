"use strict";

/**
 * Загрузка excel файла
 * @param {string} data 
 */
function loadExcel(data) {
	const binaryData = atob(data);
	const uint8Array = new Uint8Array(binaryData.length);

	for (let i = 0; i < binaryData.length; i++) {
		uint8Array[i] = binaryData.charCodeAt(i);
	}

	const blob = new Blob([uint8Array.buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
	const blobUrl = URL.createObjectURL(blob);

	// Создаем ссылку <a></a>
	const aElement = document.createElement("a");

	// Добавляем href в ссылку
	aElement.href = blobUrl;
	// Скачивание файла
	aElement.download = "история_чата.xlsx";

	// Клик на ссылку
	aElement.click();

	URL.revokeObjectURL(blobUrl);
}

export default loadExcel;