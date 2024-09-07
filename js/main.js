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

// Handlers for showing the main button once both date and time are set
pickers.date.addEventListener('change', pickHandler);
pickers.time.addEventListener('change', pickHandler);

function pickHandler(e) {
	if (pickers.date.value !== '' && pickers.time.value !== '' && pickers.amount.value !== '') {
		Telegram.WebApp.MainButton.show(); // Show the button only if amount is filled too
	} else {
		Telegram.WebApp.MainButton.hide(); // Hide if incomplete
	}
}

async function sendData() {
	if (pickers.amount.value === '') {
		alert('الرجاء إدخال مبلغ صالح.');
		return;
	}

	// Manually parse the date and time
	let dateParts = pickers.date.value.split("-");
	let timeParts = pickers.time.value.split(":");

	// Create a new Date object but explicitly set the hours and minutes from the picker
	let timestamp = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
	timestamp.setHours(parseInt(timeParts[0]));
	timestamp.setMinutes(parseInt(timeParts[1]));

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
