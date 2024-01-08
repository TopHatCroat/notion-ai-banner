const { getNewPagesFromNotion, getOpenAiPromptForPage, updatePageCover } = require('../utils/notion');
const s3Client = require('../utils/s3Client');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const openAiClient = require('../utils/openAiClient');

const generateImageWithOpenAI = async (prompt) => {
  try {
    const response = await openAiClient.images.generate({
      prompt,
      model: process.env.OPENAI_IMAGE_MODEL,
      size: process.env.OPENAI_IMAGE_SIZE,
    });

    if (response.data && response.data.length > 0) {
      const imageUrl = response.data[0].url;

      const image = await (await fetch(imageUrl)).blob();
      const imageBytes = await image.arrayBuffer();
      const buffer = Buffer.from(imageBytes, 'binary');
      const resizedBuffer = await sharp(buffer)
        .resize(1500, 600)
        .toBuffer();

      const fileName = `banner-${Date.now()}.png`;
      const filePath = path.resolve(__dirname, '../banners', fileName);

      await fs.promises.writeFile(filePath, resizedBuffer);

      const { url } = await s3Client.uploadFile(filePath);

      return url;
    } else {
      throw new Error('No image data received from OpenAI API.');
    }
  } catch (error) {
    console.error('Error generating image with OpenAI:', error);
    throw error;
  }
};

const generateBannerForNewPages = async () => {
  const newPages = await getNewPagesFromNotion();

  try {
    const banners = await Promise.all(newPages.map(async (page) => {
      const prompt = getOpenAiPromptForPage(page);

      const imageUrl = await generateImageWithOpenAI(prompt);

      await updatePageCover(page.id, imageUrl);

      return null;
    }));
    const successfulBanners = banners.filter(banner => banner !== null);
    console.log('Generated banners:', successfulBanners);
  } catch (error) {
    console.error('Failed to generate banners:', error);
  }
};

module.exports = {
  generateImageWithOpenAI,
  generateBannerForNewPages
};
