import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
});

export async function POST(req) {
  const { userInput } = await req.json();

  if (!userInput) {
    return new Response(JSON.stringify({ error: 'No input provided' }), { status: 400 });
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: `Respond. "${userInput}".`,
        },
      ],
      max_tokens: 250,
    });

    const generatedText = response.choices[0].message.content.trim();

    return new Response(JSON.stringify({ response: generatedText }), { status: 200 });
  } catch (error) {
    console.error('OpenAI API error:', error.response?.data || error.message);
    return new Response(JSON.stringify({ error: 'Failed to generate a response', details: error.response?.data || error.message }), { status: 500 });
  }
}
