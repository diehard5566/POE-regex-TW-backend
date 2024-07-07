const mapModifiers = require('../lib/map-mod.json');
const t17Modifiers = require('../lib/tier-17-mods.json');
const { ENUM_MAP_MODIFIER_TYPE } = require('../lib/enum');

async function getAllMapModsByType(type) {
	const mods = type === ENUM_MAP_MODIFIER_TYPE.T17 ? t17Modifiers : mapModifiers;

	return mods;
}

async function generateMapRegex({
	wantedMods,
	unwantedMods,
	itemQuantity,
	packSize,
}) {
	const exclusions = generateBadMods(unwantedMods);
	const inclusions = generateGoodMods(wantedMods);
	const quantity = itemQuantity ? addQuantOrPack('品數 .*', generateNumberRegex(itemQuantity.toString())) : '';
	const pack = packSize ? addQuantOrPack('群大小.*', generateNumberRegex(packSize.toString())) : '';

	const result = `${exclusions} ${inclusions} ${quantity} ${pack}`.trim().replace(/\s{2,}/g, ' ');

	return result;
}

// 處理不想要的詞綴
function generateBadMods(unwantedMods) {
	if (unwantedMods.length === 0) {
		return '';
	}

	const normalMods = unwantedMods.filter(mod => !mod.isT17).map(mod => mod.mod);
	const t17Mods = unwantedMods.filter(mod => mod.isT17).map(mod => mod.mod);

	let modStr = [];

	if (normalMods.length > 0) {
		const normalModStr = normalMods.map(mod => mapModifiers[mod]).filter(Boolean);

		modStr = modStr.concat(normalModStr);
	}

	if (t17Mods.length > 0) {
		const t17ModStr = t17Mods.map(mod => t17Modifiers[mod]).filter(Boolean);

		modStr = modStr.concat(t17ModStr);
	}

	if (modStr.length === 0) {
		return '';
	}

	return `"!${modStr.join('|')}"`;
}

// 處理想要的詞綴
function generateGoodMods(wantedMods) {
	if (wantedMods.length === 0) {
		return '';
	}

	const normalMods = wantedMods.filter(mod => !mod.isT17).map(mod => mod.mod);
	const t17Mods = wantedMods.filter(mod => mod.isT17).map(mod => mod.mod);

	let regex = [];

	if (normalMods.length > 0) {
		const normalRegex = normalMods.map(mod => mapModifiers[mod]).filter(Boolean);

		regex = regex.concat(normalRegex);
	}

	if (t17Mods.length > 0) {
		const t17Regex = t17Mods.map(mod => t17Modifiers[mod]).filter(Boolean);

		regex = regex.concat(t17Regex);
	}

	if (regex.length === 0) {
		return '';
	}

	return `"${regex.join('|')}"`;
}

function addQuantOrPack(prefix, string) {
	if (string === '') {
		return '';
	}

	return `"${prefix}${string}%"`;
}

function generateNumberRegex(number, { optimize } = {}) {
	const numbers = number.match(/\d/g);

	if (numbers === null) {
		return '';
	}

	const quant = optimize
		? Math.floor((Number(numbers.join('')) / 10)) * 10
		: Number(numbers.join(''));

	if (isNaN(quant) || quant === 0) {
		return '';
	}

	if (quant >= 200) {
		return '2..';
	}

	if (quant > 100) {
		const str = quant.toString();
		const d0 = str[0];
		const d1 = str[1];
		const d2 = str[2];

		if (str[1] === '0' && str[2] === '0') {
			return `${d0}..`;
		}

		if (str[2] === '0') {
			return `1[${d1}-9].`;
		}

		if (str[1] === '0') {
			return `(\\d0[${d2}-9]|\\d[1-9].)`;
		}

		if (str[1] === '9' && str[2] === '9') {
			return '199';
		}

		if (d1 === '9') {
			return `19[${d2}-9]`;
		}

		return `1([${d1}-9][${d2}-9]|[${Number(d1) + 1}-9].)`;
	}

	if (quant === 100) {
		return '(\\d{3})';
	}

	if (quant > 9) {
		const str = quant.toString();
		const d0 = str[0];
		const d1 = str[1];

		if (str[1] === '0') {
			return `([${d0}-9].|1..)`;
		}

		if (str[0] === '9') {
			return `(${d0}[${d1}-9]|1..)`;
		}

		return `(${d0}[${d1}-9]|[${Number(d0) + 1}-9].|1..)`;
	}

	if (quant <= 9) {
		return `([${quant}-9]|\\d..?)`;
	}

	return number;
}

module.exports = {
	getAllMapModsByType,
	generateMapRegex,
};
