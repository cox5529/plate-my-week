import type { IdReference, Organization, Person, SchemaValue } from '../schema';
import { parseImages, parseStringsAsSingle, parseThing } from '../utils/schema-import';

export type Publisher = {
	name: string;
	logo?: string;
	url?: string;
};

export const parsePublisher = (
	input: SchemaValue<Organization | Person | IdReference> | undefined
): Publisher[] =>
	parseThing(input, (value) => {
		if (typeof value === 'string') {
			return {
				name: value
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
