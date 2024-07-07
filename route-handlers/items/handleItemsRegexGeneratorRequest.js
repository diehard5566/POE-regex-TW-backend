module.exports = async (req, res, next) => {
	try {
		res.status(200).json('coming soon');
	} catch (error) {
		next(error);
	}
};

