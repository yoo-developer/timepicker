var pickers = {
	date: document.querySelector('input[type="date"]'),
	time: document.querySelector('input[type="time"]'),
	amount: document.querySelector('input[type="number"]'),
	text: document.querySelector('#text')
};

const setDefaultValues = (pickers) => {
	const current = new Date();
	
	// Set default date
	const date = [current.getFullYear(), current.getMonth() + 1, current.getDate()]
		.map(item => item.toString().padStart(2, "0"))
		.join("-");
	pickers.date.value = date;
	
	// Set default time
	const time = [current.getHours(), current.getMinutes()]
		.map(item => item.toString().padStart(2, "0"))
		.join(":");
	pickers.time.value = time;
}
setDefaultValues(pickers);

// Show main button only after amount is entered
pickers.amount.addEventListener('input', function () {
	if (pickers.amount.value !== '') {
		Telegram.WebApp.MainButton.show();
	} else {
		Telegram.WebApp.MainButton.hide();
	}
});

async function sendData() {
	if (pickers.amount.value === '') {
		alert('الرجاء إدخال مبلغ صالح.');
		return;
	}

	// Parse the date
	let dateParts = pickers.date.value.split("-");
	let timeParts = pickers.time.value !== '' ? pickers.time.value.split(":") : null; // Optional time check

	// Create a new Date object for the date
	let timestamp = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);

	// If the time was not changed, keep it as the current time, otherwise set the picked time
	if (timeParts) {
		timestamp.setHours(parseInt(timeParts[0]));
		timestamp.setMinutes(parseInt(timeParts[1]));
	} else {
		const current = new Date();
		timestamp.setHours(current.getHours());
		timestamp.setMinutes(current.getMinutes());
	}

	let amount = parseInt(pickers.amount.value);
	if (isNaN(amount) || amount <= 0) {
		alert('الرجاء إدخال مبلغ صالح.');
		return;
	}

	// Prepare data
	let data = { timestamp: timestamp.getTime(), amount };
	await Telegram.WebApp.sendData(JSON.stringify(data));
}

function init() {
	setupOptions();

	Telegram.WebApp.ready();
	Telegram.WebApp.MainButton
		.setText('Ok')
		.onClick(sendData);
}

document.addEventListener('DOMContentLoaded', init);
