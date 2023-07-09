import type { IdReference, ImageObject, SchemaValue } from '../schema';

export const parseImages = (
	input: SchemaValue<ImageObject | string | IdReference> | undefined
): string[] =>
	parseThing(input, (value) => {
		if (typeof value === 'string') {
			return value;
		}

		if ('url' in value && value.url) {
			return parseStringsAsSingle(value.url);
		}
	});

export const parseStrings = (input: SchemaValue<string> | undefined): string[] =>
	parseThing(input, (value) => value);

export const parseStringsAsSingle = (
	input: SchemaValue<string | IdReference> | undefined
): string =>
	parseThing(input, (value) => {
		if (typeof value === 'string') {
			return value;
		}
	})[0];

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
