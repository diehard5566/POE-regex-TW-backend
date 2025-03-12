const { divine } = require('../../services/exchange');

const dataCache = new Map();
const tradeUrl = 'https://pathofexile.tw/trade/exchange';
const updateInterval = 5 * 60 * 1000; // 5分鐘更新一次

async function updateData() {
	try {
		const result = await divine();

		// 將資料格式調整為前端期望的格式
		dataCache.set('exchangeData', {
			url: `${tradeUrl}/${result.leagueName}/${result.searchURL}`,
			league: result.leagueName,
			rates: {
				divine: result.finalDivinePrice[1], // 使用第二筆作為主要匯率
			},
			exchangeRates: result.finalDivinePrice, // 保留原始匯率數組
			lastUpdated: new Date().toISOString(),
		});
		console.log('Exchange data updated successfully');
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
			return res.status(503).json({
				error: 'Data not available yet',
				message: '資料尚未準備好，請稍後再試',
			});
		}

		// 添加 CORS 頭，確保前端可以訪問
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

		res.status(200).json(cachedData);
	} catch (error) {
		console.error('API 請求處理錯誤:', error);
		next(error);
	}
};

