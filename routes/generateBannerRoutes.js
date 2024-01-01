const express = require('express');
const router = express.Router();
const { handleGenerateBanner, triggerBannerGeneration } = require('../controllers/generateBannerController');

router.post('/generate-banner', handleGenerateBanner);
router.post('/trigger-banner-generation', triggerBannerGeneration);

module.exports = router;
