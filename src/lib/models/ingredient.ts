import type { Text, SchemaValue } from '../schema';
import { parseThing, sanitizeString } from '../utils/schema-import';
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
	const tokens = ingredient.split(' ');
	const pairs: [number, Units][] = [];
	tokenLoop: for (let i = 0; i < tokens.length - 1; i++) {
		const token = tokens[i];
		if (!token.match(/^[0-9\/.]+$/g)) {
			continue;
		}

		let quantity = 0;
		try {
			if (token.includes('/')) {
				const parts = token.split('/');
				const num = parseInt(parts[0]);
				const den = parseInt(parts[1]);

				quantity = (num + 0.0) / den;
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

	return pairs.find(([, unit]) => unit !== Units.Unit) ?? pairs[0] ?? [0, Units.Unit];
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
		.replace(/[^a-z- ]/g, '')
		.trim();
