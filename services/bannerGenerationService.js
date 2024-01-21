const { getNewPagesFromNotion, getOpenAiPromptForPage, updatePageCover, getSinglePageFromNotion } = require('../utils/notion');
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

    console.log(`Generating new banners for ${newPages.length} pages`);

    for (let i = 0; i < newPages.length; i++) {
        try {
            const page = newPages[i];
            const prompt = await getOpenAiPromptForPage(page);

            console.log(`[${i + 1}/${newPages.length}] Generating banner for page ${page.id} with prompt: ${prompt}`);

            const imageUrl = await generateImageWithOpenAI(prompt);

            await updatePageCover(page.id, imageUrl);

            console.log(`[${i + 1}/${newPages.length}] Banner generated for page ${page.id}`);
        } catch (error) {
            console.error('Failed to generate banners:', error);
        }
    }

    console.log('Finished generating banners');
};

const generateSingleBanner = async (pageId) => {
    // Convert the received styles to the format expected by the extractStyles function

    const prompt = await getOpenAiPromptForPage(page);

    console.log(`Generating banner for page ${pageId} with prompt: ${prompt}`);

    const page = await getSinglePageFromNotion(pageId);

    const imageUrl = await generateImageWithOpenAI(prompt);
    // INPUT_REQUIRED {Replace the placeholder below with actual URL path to the generated image, e.g., upload the image to a server and use the file URL here}
    await updatePageCover(page.id, imageUrl);

    console.log(`Banner generated for page ${page.id}`);
}

module.exports = {
    generateSingleBanner,
    generateBannerForNewPages
};
