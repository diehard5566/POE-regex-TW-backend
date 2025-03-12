const axios = require('axios');
const searchJson = require('../lib/search-query.json');

async function getLeagueNameFromGGC() {
	try {
		const res = await axios.get('https://pathofexile.tw/api/trade/data/leagues');

		if (!res.data || !res.data.result || !res.data.result.length) {
			throw new Error('無法獲取聯盟資訊');
		}

		return res.data.result[0].id;
	} catch (error) {
		console.error('獲取聯盟名稱時出錯:', error.message);
		throw error;
	}
}

async function getURLFromGGC(searchJsonReady) {
	try {
		const leagueName = await getLeagueNameFromGGC();
		const res = await axios.post(`https://pathofexile.tw/api/trade/exchange/${leagueName}`, searchJsonReady, {
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				'User-Agent': 'OAuth poe-bot/1.0.0 (contact: shihyao001@gmail.com)',
			},
		});

		if (!res.data || !res.data.result) {
			throw new Error('API 回應格式不正確');
		}

		return { data: res.data, leagueName };
	} catch (error) {
		console.error('獲取交易 URL 時出錯:', error.message);
		throw error;
	}
}

async function divine(query = searchJson) {
	try {
		const URLResult = await getURLFromGGC(query);
		const { data, leagueName } = URLResult;
		const dataResultArray = Object.values(data.result);
		const searchURL = data.id;
		const searchLength = dataResultArray.length < 12 ? dataResultArray.length : 12;

		if (searchLength === 0) {
			throw new Error('沒有找到匯率資料');
		}

		const divineValues = [];

		for (let i = 0; i < searchLength; i++) {
			const divineAmount = dataResultArray[i].listing.offers
				.filter(el => el.exchange.amount === 1)
				.map(el => el.item.amount);

			divineValues.push(divineAmount);
		}

		const finalDivinePrice = divineValues.flat();

		return {
			finalDivinePrice,
			searchURL,
			leagueName,
		};
	} catch (error) {
		console.error('處理神聖石匯率時出錯:', error.message);
		throw error;
	}
}

module.exports = {
	getURLFromGGC,
	divine,
	getLeagueNameFromGGC,
};
