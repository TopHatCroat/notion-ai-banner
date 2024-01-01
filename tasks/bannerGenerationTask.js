const { CronJob } = require('cron');
const { generateBannerForNewPages } = require('../services/bannerGenerationService');

const scheduleBannerGenerationTask = () => {
  // Running a task every 15 minutes
  const job = new CronJob('*/15 * * * *', async function() {
    console.log('Cron job started: Checking for new pages');
    await generateBannerForNewPages();
  }, null, true, 'Europe/Zagreb'); // Set your own timezone or remove the timezone argument as needed

  job.start();
  console.log('Scheduled banner generation task');
};

module.exports = {
  scheduleBannerGenerationTask,
};