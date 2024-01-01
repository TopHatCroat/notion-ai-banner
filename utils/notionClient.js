const axios = require('axios');
const { NOTION_TOKEN } = process.env;

const client = axios.create({
  baseURL: 'https://api.notion.com/v1/',
  headers: {
    Authorization: `Bearer ${NOTION_TOKEN}`,
    'Notion-Version': '2022-06-28',
  },
});

client.interceptors.response.use(
  response => response,
  error => {
    console.error('API call failed:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      console.error('Headers:', error.response.headers);
    }
    return Promise.reject(error);
  }
);

module.exports = () => client;
