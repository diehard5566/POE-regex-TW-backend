const { generateMapRegex } = require('../../services/maps');

module.exports = async (req, res) => {
	const {
		wantedMods, unwantedMods, itemQuantity,
		packSize,
	} = req.body;

	try {
		const regex = await generateMapRegex({
			wantedMods,
			unwantedMods,
			itemQuantity,
			packSize,
		});

		res.status(201).json({ regex });
	} catch (error) {
		return new Error('Failed to generate map regex:', error);
	}
};
