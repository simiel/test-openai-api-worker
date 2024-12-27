import OpenAI from 'openai';

const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'OPTIONS, POST',
	'Access-Control-Allow-Headers': 'Content-Type',
};

interface Env {
	OPENAI_API_KEY: string;
}

export default {
	async fetch(request, env: Env, ctx): Promise<Response> {
		// handle preflight request
		if (request.method === 'OPTIONS') {
			return new Response(null, {
				headers: corsHeaders,
			});
		}

		const messages: OpenAI.ChatCompletionMessageParam[] = await request.json();
		console.log('🚀 ~ fetch ~ messages:', messages);

		const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
		try {
			const chatCompletion = await openai.chat.completions.create({
				model: 'gpt-4o-mini',
				messages: messages,
				temperature: 1.1,
				presence_penalty: 0,
				frequency_penalty: 0,
			});

			const response = chatCompletion.choices[0].message.content;
			console.log('🚀 ~ fetch ~ response:', response);
			return new Response(JSON.stringify(response), {
				headers: corsHeaders,
			});
		} catch (error: any) {
			return new Response(error, { headers: corsHeaders });
		}
	},
} satisfies ExportedHandler<Env>;
