import OpenAI from 'openai';

interface Env {
	OPENAI_API_KEY: string;
}

export default {
	async fetch(request, env: Env, ctx): Promise<Response> {
		const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
		try {
			const chatCompletion = await openai.chat.completions.create({
				model: 'gpt-4o-mini',
				messages: [{ role: 'user', content: 'Should I trust stock predictions from Dodgy Dave?' }],
				temperature: 1.1,
				presence_penalty: 0,
				frequency_penalty: 0,
			});

			const response = chatCompletion.choices[0].message.content;
			return new Response(JSON.stringify(response));
		} catch (error: any) {
			return new Response(error, { status: 500 });
		}
	},
} satisfies ExportedHandler<Env>;
