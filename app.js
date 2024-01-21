require('dotenv').config();
const express = require('express');
const yargs = require('yargs/yargs');
const generateBannerRoutes = require("./routes/generateBannerRoutes");
const { scheduleBannerGenerationTask } = require("./tasks/bannerGenerationTask");

const rest = yargs(process.argv.splice(2))
    .command('generate-single', 'Generate banner for a page with a given ID', {
        id: {
            alias: 'i',
            default: null,
            describe: 'Notion page ID',
            demandOption: true,
        }
    })
    .command('generate-all', 'Trigger banner generation for all new pages')
    .command('serve', 'Run the server')
    .demandCommand()
    .strict()
    .help()
    .parse();

if(rest._[0] === 'generate-single') {
    const { generateSingleBanner } = require('./services/bannerGenerationService');

    if (!rest.id) {
        throw new Error('Page ID is required');
    }

    generateSingleBanner(rest.id);
}

if(rest._[0] === 'generate-all') {
    const { generateBannerForNewPages } = require('./services/bannerGenerationService');

    generateBannerForNewPages();
}

if(rest._[0] === 'serve') {
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
}


