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

		// Only process POST requests
		if (request.method !== 'POST') {
			return new Response(JSON.stringify({ error: `${request.method} method not allowed.` }), { status: 405, headers: corsHeaders });
		}

		const messages: OpenAI.ChatCompletionMessageParam[] = await request.json();

		const openai = new OpenAI({
			apiKey: env.OPENAI_API_KEY,
			baseURL: 'https://gateway.ai.cloudflare.com/v1/8ddcdea68286b49fae7af51c94b35dfe/dodgy-dave-ai-gateway/openai',
		});
		try {
			const chatCompletion = await openai.chat.completions.create({
				model: 'gpt-4o-mini',
				messages: messages,
				temperature: 1.1,
				presence_penalty: 0,
				frequency_penalty: 0,
			});

			const response = chatCompletion.choices[0].message;
			return new Response(JSON.stringify(response), {
				headers: corsHeaders,
			});
		} catch (error: any) {
			return new Response(JSON.stringify(error.message), { headers: corsHeaders, status: 500 });
		}
	},
} satisfies ExportedHandler<Env>;
