const { generateSingleBanner, generateBannerForNewPages } = require('../services/bannerGenerationService');

const handleGenerateBanner = async (req, res) => {
  const { pageId } = req.body;

  if (!pageId) {
    return res.status(400).json({
      message: 'Missing required pageId in request body',
    });
  }

  try {
    const page = await generateSingleBanner(pageId);
    res.status(200).json({
      message: 'Banner generated successfully',
    });
  } catch (error) {
    console.error('Error generating banner image:', error);
    res.status(500).json({
      message: 'Failed to generate banner image',
      error: error.message,
    });
  }
};

const triggerBannerGeneration = async (req, res) => {
  try {
    await generateBannerForNewPages();
    res.status(200).json({
      message: 'Banner generation triggered successfully',
    });
  } catch (error) {
    console.error('Error triggering banner generation:', error);
    res.status(500).json({
      message: 'Error triggering banner generation',
      error: error.message,
    });
  }
};

module.exports = {
  handleGenerateBanner,
  triggerBannerGeneration,
};
