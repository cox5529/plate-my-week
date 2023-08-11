import type { IdReference, Organization, Person, SchemaValue } from '../../recipe-seo-schema';
import { parseStringsAsSingle, parseThing } from '../../utils/schema-import';

export type ExternalAuthor = {
	name: string;
	url: string | null;
};

export const parseExternalAuthors = (
	input: SchemaValue<Organization | Person | IdReference> | undefined
): ExternalAuthor[] =>
	parseThing(input, (value) => {
		if (typeof value === 'string') {
			return {
				name: value,
				url: null
			};
		}

		if (!('@type' in value)) {
			return;
		}

		const type = value['@type'];
		if (type === 'Organization' || type === 'Person') {
			return {
				name: parseStringsAsSingle(value.name) ?? '',
				url: parseStringsAsSingle(value.url)
			};
		}
	});
