import type { IdReference, Organization, Person, SchemaValue } from '../schema';
import { parseImages, parseStringsAsSingle, parseThing } from '../utils/schema-import';

export type Publisher = {
	name: string;
	logo: string | null;
	url: string | null;
};

export const parsePublisher = (
	input: SchemaValue<Organization | Person | IdReference> | undefined
): Publisher[] =>
	parseThing(input, (value) => {
		if (typeof value === 'string') {
			return {
				name: value,
				logo: null,
				url: null
			};
		}

		if (!('@type' in value)) {
			return;
		}

		const type = value['@type'];
		if (type === 'Organization') {
			return {
				name: parseStringsAsSingle(value.name) ?? '',
				logo: parseImages(value.logo)[0],
				url: parseStringsAsSingle(value.url)
			};
		}
	});
