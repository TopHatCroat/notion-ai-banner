require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());

const port = process.env.PORT || 3000;

const generateBannerRoutes = require('./routes/generateBannerRoutes');
app.use(generateBannerRoutes);

const { scheduleBannerGenerationTask } = require('./tasks/bannerGenerationTask');

if (process.env.ENABLE_CRON_JOB === 'true') {
    scheduleBannerGenerationTask();
}

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
