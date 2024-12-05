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
          content: `Here's what I'm doing: "${userInput}". Roast me based on what I'm doing in a funny, witty, clever, and/or sarcastic way. Be absolutely ruthless and funny above all, be really mean, and keep it short and witty. Also keep your response gender neutral.`,
        },
      ],
      max_tokens: 100,
    });

    const generatedText = response.choices[0].message.content.trim();

    return new Response(JSON.stringify({ response: generatedText }), { status: 200 });
  } catch (error) {
    console.error('OpenAI API error:', error.response?.data || error.message);
    return new Response(JSON.stringify({ error: 'Failed to generate a response', details: error.response?.data || error.message }), { status: 500 });
  }
}
