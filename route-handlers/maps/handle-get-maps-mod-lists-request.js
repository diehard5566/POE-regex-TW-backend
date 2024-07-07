const { getAllMapModsByType } = require('../../services/maps');

module.exports = async (req, res, next) => {
	const { type } = req.query;

	try {
		const allModifiers = await getAllMapModsByType(type);

		res.status(200).json(allModifiers);
	} catch (error) {
		next(error);
	}
};

