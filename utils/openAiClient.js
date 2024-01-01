const { OPENAI_API_KEY } = process.env;
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

module.exports = openai;
