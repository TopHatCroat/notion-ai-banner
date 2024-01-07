require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Notion-AI-Banner Service Running');
});

const generateBannerRoutes = require('./routes/generateBannerRoutes');
app.use(generateBannerRoutes);

const { scheduleBannerGenerationTask } = require('./tasks/bannerGenerationTask');

scheduleBannerGenerationTask();



app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
