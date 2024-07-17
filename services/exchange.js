const axios = require('axios');
const searchJson = require('../lib/search-query.json');

async function getLeagueNameFromGGC() {
	try {
		const res = await axios.get('https://pathofexile.tw/api/trade/data/leagues');

		return res.data.result[0].id;
	} catch (error) {
		console.log(error);
	}
}

async function getURLFromGGC(searchJsonReady) {
	try {
		const leagueName = await getLeagueNameFromGGC();
		const res = await axios.post(`http://pathofexile.tw/api/trade/exchange/${leagueName}`, searchJsonReady, {
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				'User-Agent': 'OAuth poe-bot/1.0.0 (contact: shihyao001@gmail.com)',
			},
		});

		return { data: res.data, leagueName };
	} catch (error) {
		console.log(error);
	}
}

async function divine(query = searchJson) {
	const URLResult = await getURLFromGGC(query);
	const { data, leagueName } = URLResult;
	const dataResultArray = Object.values(data.result);
	const searchURL = data.id;
	const searchLength = dataResultArray.length < 12 ? dataResultArray.length : 12;

	const top3Value = [];

	for (let i = 0; i < searchLength; i++) {
		const divineAmount = dataResultArray[i].listing.offers
			.filter(el => el.exchange.amount === 1)
			.map(el => el.item.amount);

		top3Value.push(divineAmount);
	}

	const finalDivinePrice = top3Value.flat();

	return {
		finalDivinePrice,
		searchURL,
		leagueName,
	};
}

module.exports = {
	getURLFromGGC,
	divine,
	getLeagueNameFromGGC,
};
