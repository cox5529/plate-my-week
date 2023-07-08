import { Validator, type Schema } from 'jsonschema';

export const validate = (json: string | undefined, schema: Schema) => {
  if (!json) {
    return false;
  }

	try {
		const validator = new Validator();
		const content = JSON.parse(json);
		const hasErrors = validator.validate(content, schema).errors.length !== 0;

    return hasErrors ? undefined : content;
	} catch {
		return undefined;
	}
};
