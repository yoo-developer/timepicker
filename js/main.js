var pickers = {
	date: document.querySelector('input[type="date"]'),
	time: document.querySelector('input[type="time"]'),
	amount: document.querySelector('input[type="number"]'),
	text: document.querySelector('#text')
};

const setDefaultValues = (pickers) => {
	const current = new Date();
	const date = [ current.getFullYear(), current.getMonth() + 1, current.getDate() ]
		.map(item => item.toString().padStart(2, "0"))
		.join("-");
	pickers.date.value = date;
	const time = [ current.getHours(), current.getMinutes() ]
		.map(item => item.toString().padStart(2, "0"))
		.join(":");
	pickers.time.value = time;
}
setDefaultValues(pickers);
pickers.date.addEventListener('change', pickHandler);
pickers.time.addEventListener('change', pickHandler);

function pickHandler(e) {
	let other = e.target.type === 'date' ? 'time' : 'date';

	if (pickers.date.value !== '' && pickers.time.value !== '' && pickers.amount.value !== '') {
		Telegram.WebApp.MainButton.show();
	} else {
		Telegram.WebApp.MainButton.hide();
	}
}

async function sendData() {
	if (pickers.amount.value === '') {
		alert('الرجاء إدخال مبلغ صالح.');
		return;
	}
	let timestamp = new Date(pickers.date.value);
	let [ h, m ] = pickers.time.value.split(':');
	timestamp.setHours(h || 0);
	timestamp.setMinutes(m || 0);
	timestamp = new Date(timestamp.getTime() - (timestamp.getTimezoneOffset() * 60000));

	let amount = parseInt(pickers.amount.value);
	if (isNaN(amount) || amount <= 0) {
		alert('الرجاء إدخال مبلغ صالح.');
		return;
	}
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
