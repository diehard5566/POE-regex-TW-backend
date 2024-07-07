const { getAllMapModsByType } = require('../../services/maps');

module.exports = async (req, res, next) => {
	const { type } = req.query;

	try {
		const t17Modifiers = await getAllMapModsByType(Number(type));

		res.status(200).json(t17Modifiers);
	} catch (error) {
		next(error);
	}
};

