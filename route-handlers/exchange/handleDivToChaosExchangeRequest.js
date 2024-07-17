const { divine } = require('../../services/exchange');

const dataCache = new Map();
const tradeUrl = 'https://pathofexile.tw/trade/exchange';
const updateInterval = 5 * 60 * 1000; // 5分鐘更新一次

async function updateData() {
	try {
		const result = await divine();

		dataCache.set('exchangeData', {
			officialLink: `${tradeUrl}/${result.leagueName}/${result.searchURL}`,
			exchangeRates: result.finalDivinePrice,
			mainRate: result.finalDivinePrice[1],
			lastUpdated: new Date().toISOString(),
		});
		console.log('Exchange data updated');
	} catch (error) {
		console.error('Error updating exchange data:', error);
	}
}

// 初始更新
updateData();

// 設置定期更新
setInterval(updateData, updateInterval);

module.exports = async (req, res, next) => {
	try {
		const cachedData = dataCache.get('exchangeData');

		if (!cachedData) {
			return res.status(503).json({ error: 'Data not available yet' });
		}

		res.status(200).json(cachedData);
	} catch (error) {
		next(error);
	}
};

