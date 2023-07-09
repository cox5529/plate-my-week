import { env } from '$env/dynamic/private';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({ apiKey: env.OPENAI_API_KEY });
export const openaiService = new OpenAIApi(configuration);

export const getOpenAIResponse = async (
	systemPrompt: string,
	userPrompt: string
): Promise<string | undefined> => {
	console.info(`Sending prompt to OpenAI...`);
	const chat = await openaiService.createChatCompletion({
		model: 'gpt-3.5-turbo',
		messages: [
			{ role: 'system', content: systemPrompt },
			{ role: 'user', content: userPrompt }
		]
	});

	if (chat.status !== 200) {
		console.error(`Recieved ${chat.status} error from OpenAI`);
		return;
	}

	const message = chat.data.choices[0]?.message?.content;
	if (!message) {
		console.error('Received success status, but no message from OpenAI');
		return;
	}

	return message;
};

export const getOpenAITypedResponse = async <T>(
	systemPrompt: string,
	userPrompt: string
): Promise<T | undefined> => {
	const response = await getOpenAIResponse(systemPrompt, userPrompt);
	if (!response) {
		return;
	}

	try {
		const json = JSON.parse(response);
		return json;
	} catch (e) {
		console.error('Error parsing OpenAI response to JSON');
		console.warn(response);
	}
};
