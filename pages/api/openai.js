
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {

  const {name} = req.body;

  const gptResponse = await openai.createCompletion({
    model: "gpt-3.5-turbo-instruct",
    prompt: name,
    temperature: 0.7,
    max_tokens: 150,
    top_p: 1,
    frequency_penalty: 1.0,
    presence_penalty: 1.0,
    stop: [" Human:", " AI:"],
  });

  // console.log("UBIN", req.name, name)

  res.status(200).json({text: `${gptResponse.data.choices[0].text}`})}
