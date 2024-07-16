const { generateMapRegex } = require('../../services/maps');

module.exports = async (req, res) => {
	const {
		wantedMods, unwantedMods, itemQuantity,
		packSize, allGoodMods,
	} = req.body;

	try {
		const regex = await generateMapRegex({
			wantedMods,
			unwantedMods,
			itemQuantity,
			packSize,
			allGoodMods,
		});

		res.status(201).json({ regex });
	} catch (error) {
		return new Error('Failed to generate map regex:', error);
	}
};
