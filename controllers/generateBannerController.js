const { generateBannerImage } = require('../services/bannerGenerationService');
const { generateBannerForNewPages } = require('../services/bannerGenerationService');

const handleGenerateBanner = async (req, res) => {
  const { title, content, style } = req.body;

  if (!title || !content) {
    return res.status(400).json({
      message: 'Missing required page data properties',
    });
  }

  try {
    // Convert the received styles to the format expected by the extractStyles function
    const pageData = {
      summary: content,
      style: style ? style : [],
    };

    const imagePath = await generateBannerImage(pageData);
    // INPUT_REQUIRED {Replace the placeholder below with actual URL path to the generated image, e.g., upload the image to a server and use the file URL here}
    const imageUrlPlaceholder = 'http://example.com/path/to/image';
    res.status(200).json({
      message: 'Banner generated successfully',
      imageUrl: imageUrlPlaceholder,
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
