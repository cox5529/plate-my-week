import type { Text, SchemaValue } from '../schema';
import { parseThing } from '../utils/schema-import';
import { UnitMap, Units, orderedUnits } from './units';

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

		return {
			quantity: getQuantity(value),
			unit: getUnit(value),
			name: getName(value),
			instruction: getInstruction(value)
		};
	});

const getQuantity = (ingredient: string): number => {
	ingredient = ingredient.toLowerCase();
	const tokens = ingredient.split(' ');
	for (let i = 0; i < tokens.length - 1; i++) {
		const token = tokens[i];
		if (!token.match(/^[0-9\/.]+$/g)) {
			continue;
		}

		const next = tokens[i + 1];
		let followedByUnit = false;
		for (const unit of Object.keys(orderedUnits)) {
			const firstPartOfUnit = unit.split(' ')[0];
			if (next === firstPartOfUnit) {
				followedByUnit = true;
				break;
			}
		}

		if (!followedByUnit) {
			continue;
		}

		try {
			if (token.includes('/')) {
				const parts = token.split('/');
				const num = parseInt(parts[0]);
				const den = parseInt(parts[1]);

				return (num + 0.0) / den;
			} else {
				return parseFloat(token);
			}
		} catch {
			continue;
		}
	}

	return 0;
};

const getUnit = (ingredient: string): Units => {
	const sanitizedIngredient = sanitize(ingredient);
	const unit = orderedUnits.find(([x]) => sanitizedIngredient.includes(x));

	return unit ? unit[1] : Units.Unit;
};

const getName = (ingredient: string): string => {
	let sanitizedIngredient = sanitize(ingredient);

	for (const instruction in instructions) {
		sanitizedIngredient = sanitizedIngredient.replace(instruction, '').trim();
	}

	for (const [unit] of Object.values(orderedUnits)) {
		sanitizedIngredient = sanitizedIngredient.replace(new RegExp(`\\b${unit}\\b`, 'g'), '').trim();
	}

	return sanitizedIngredient;
};

const getInstruction = (ingredient: string): string | null => {
	const parts = ingredient.replace(/\(.*\)/g, '').split(',');
	if (parts.length > 1) {
		return parts.slice(1).join(',');
	}

	let sanitizedIngredient = sanitize(ingredient);
	for (const instruction in instructions) {
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
		.replace(/[^a-z ]/g, '')
		.trim();
