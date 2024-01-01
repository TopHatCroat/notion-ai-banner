const { getNewPagesFromNotion, getPageSummariesAndProperties } = require('../utils/notion');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const openAiClient = require('../utils/openAiClient');

const generateImageWithOpenAI = async (description, styles) => {
  try {
    const prompt = generatePrompt(description, styles);
    const response = await openAiClient.images.generate({
      prompt: prompt,
      model: 'dall-e-2',
      size: "256x256", // TODO: Upgrade these when fully working
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
      return filePath;
    } else {
      throw new Error('No image data received from OpenAI API.');
    }
  } catch (error) {
    console.error('Error generating image with OpenAI:', error);
    throw error;
  }
};

const generatePrompt = (description, styles) => {
  return `${description} ${styles.join(', ')}`;
};

const extractStyles = (properties) => {
  const styleProperty = properties.Style || properties.style;
  return styleProperty ? styleProperty.multi_select.map(option => option.name) : [];
};

const generateBannerImage = async (pageData) => {
  const { summary, style } = pageData;
  if (!summary) {
    throw new Error('Missing summary for banner generation.');
  }
  return await generateImageWithOpenAI(summary, style);
};

const generateBannerForNewPages = async () => {
  const newPages = await getNewPagesFromNotion();
  const pagesWithSummaries = getPageSummariesAndProperties(newPages);
  console.log('Pages with summaries and additional properties:', pagesWithSummaries);
  const pagesWithSummariesAndStyles = pagesWithSummaries.map(page => ({
    ...page,
    styles: extractStyles(page.properties)
  }));

  try {
    const banners = await Promise.all(pagesWithSummariesAndStyles.map(async (page) => {
      if (page.summary) {
        return await generateImageWithOpenAI(page.summary, page.styles);
      }
      return null;
    }));
    const successfulBanners = banners.filter(banner => banner !== null);
    console.log('Generated banners:', successfulBanners);
  } catch (error) {
    console.error('Failed to generate banners:', error);
  }
};

module.exports = { generateBannerForNewPages, generateBannerImage };
