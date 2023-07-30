import type { IdReference, ImageObject, SchemaValue } from '../recipe-seo-schema';

const replacementMap: Record<string, string> = {
	'¼': ' 1/4 ',
	'½': ' 1/2 ',
	'¾': ' 3/4 ',
	'&frac34;': ' 3/4 ',
	'&frac14;': ' 1/4 ',
	'&frac12;': ' 1/2 ',
	'&#39': "'"
};

export const sanitizeString = (value: string): string => {
	for (const [key, entry] of Object.entries(replacementMap)) {
		value = value.replace(key, entry);
	}

	return value;
};

export const parseImages = (
	input: SchemaValue<ImageObject | string | IdReference> | undefined
): string[] =>
	parseThing(input, (value) => {
		if (typeof value === 'string') {
			return value;
		}

		if ('url' in value && value.url) {
			return parseStringsAsSingle(value.url) ?? '';
		}
	});

export const parseStrings = (input: SchemaValue<string> | undefined): string[] =>
	parseThing(input, sanitizeString);

export const parseStringsAsSingle = (
	input: SchemaValue<string | IdReference> | undefined
): string | null =>
	parseThing(input, (value) => {
		if (typeof value === 'string') {
			return value;
		}
	})[0] ?? null;

export const parseThing = <TInput, TOutput>(
	input: SchemaValue<TInput> | undefined,
	parse: (value: TInput) => TOutput | undefined
): TOutput[] => {
	if (!input) {
		return [];
	}

	if (typeof input === 'object' && 0 in input) {
		return input.map((x) => parse(x)).filter((x) => !!x) as TOutput[];
	}

	const result = parse(input as TInput);
	if (result) {
		return [result];
	}

	return [];
};
