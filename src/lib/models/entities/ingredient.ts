import type { Text, SchemaValue } from '../../schema';
import { parseThing, sanitizeString } from '../../utils/schema-import';
import { PluralUnitMap, SingularUnitMap, UnitMap, Units, orderedUnits } from '../enums/units';

export type Ingredient = {
	quantity: number;
	unit: Units;
	name: string;
	instruction: string | null;
};

const instructions = [
	'finely chopped',
	'finely diced',
	'diced',
	'minced',
	'chopped',
	'melted',
	'reserved',
	'sliced',
	'halved',
	'quartered'
];

export const parseIngredients = (input: SchemaValue<Text> | undefined): Ingredient[] =>
	parseThing(input, (value) => {
		if (typeof value !== 'string') {
			return;
		}

		value = sanitizeString(value);
		const [quantity, unit] = getQuantityAndUnits(value);
		const instruction = getInstruction(value);
		return {
			quantity,
			unit,
			name: getName(value, instruction ?? ''),
			instruction
		};
	});

const getQuantityAndUnits = (ingredient: string): [number, Units] => {
	ingredient = ingredient.toLowerCase().replace(/\(|\)/g, '');
	const tokens = ingredient.split(' ').filter((x) => x.trim().length > 0);
	const pairs: [number, Units][] = [];
	tokenLoop: for (let i = 0; i < tokens.length - 1; i++) {
		const token = tokens[i];
		console.log(token);
		if (!token.match(/^[0-9\/.]+$/g)) {
			continue;
		}

		const prev = i > 0 ? tokens[i - 1] : '';
		let quantity = 0;
		try {
			if (token.includes('/')) {
				const parts = token.split('/');
				const num = parseInt(parts[0]);
				const den = parseInt(parts[1]);

				quantity = (num + 0.0) / den;

				if (/[0-9]/g.test(prev)) {
					quantity += parseInt(prev);
				}
			} else {
				quantity = parseFloat(token);
			}
		} catch {
			continue;
		}

		const next = tokens[i + 1];
		for (const [unitKey, unit] of Object.values(orderedUnits)) {
			const firstPartOfUnit = unitKey.split(' ')[0];
			if (next === firstPartOfUnit) {
				pairs.push([quantity, unit]);
				continue tokenLoop;
			}
		}

		pairs.push([quantity, Units.Unit]);
	}

	return pairs.find(([, unit]) => unit !== Units.Unit) ?? pairs[0] ?? [1, Units.Unit];
};

const getName = (ingredient: string, instruction: string): string => {
	let sanitizedIngredient = sanitize(ingredient).replace(instruction, '');

	for (const [unit] of Object.values(orderedUnits)) {
		sanitizedIngredient = sanitizedIngredient.replace(new RegExp(`\\b${unit}\\b`, 'g'), '').trim();
	}

	return sanitizedIngredient;
};

const getInstruction = (ingredient: string): string | null => {
	const parenthetical = ingredient.replace(/^[^()]*\((.+?)\)[^()]*$/g, '$1');
	if (ingredient.includes('(') && parenthetical.length) {
		return parenthetical;
	}

	const parts = ingredient.replace(/\(.*\)/g, '').split(',');
	if (parts.length > 1) {
		return parts.slice(1).join(',');
	}

	let sanitizedIngredient = sanitize(ingredient);
	for (const instruction of instructions) {
		if (sanitizedIngredient.includes(instruction)) {
			return instruction;
		}
	}

	return null;
};

const sanitize = (ingredient: string): string =>
	ingredient
		.toLowerCase()
		.replace(/\(.*\)/g, '')
		.replace(/[^a-z- 0-9]/g, '')
		.replace(/\b[0-9]+?\b/g, '')
		.replace(/  /g, ' ')
		.trim();

const toFraction = (value: number): string => {
	if (value % 1 === 0) {
		return `${value}`;
	}

	const maxdenom = 32;

	const best = { numerator: 1, denominator: 1, error: Math.abs(value - 1) };
	for (let denominator = 1; best.error > 0 && denominator <= maxdenom; denominator++) {
		const numerator = Math.round(value * denominator);
		const error = Math.abs(value - numerator / denominator);
		if (error >= best.error) continue;
		best.numerator = numerator;
		best.denominator = denominator;
		best.error = error;
	}

	if (best.numerator > best.denominator) {
		const whole = Math.floor(best.numerator / best.denominator);
		return `${whole} ${best.numerator % best.denominator}/${best.denominator}`;
	}

	return `${best.numerator}/${best.denominator}`;
};

const renderQuantity = (quantity: number, unit: Units): string => {
	const quantityDisplay = toFraction(quantity);
	if (unit === Units.Unit) {
		return quantityDisplay;
	}

	if (quantity === 1) {
		return `1 ${SingularUnitMap[unit]}`;
	}

	return `${quantityDisplay} ${PluralUnitMap[unit]}`;
};

export const renderIngredient = (ingredient: Ingredient): string =>
	`${renderQuantity(ingredient.quantity, ingredient.unit)} ${ingredient.name}`;
