const notionClient = require('./notionClient');
const { filterPage, extractOpenAiPrompt } = require('../notion-transformer');
const { NOTION_DATABASE_ID } = process.env;

const getSinglePageFromNotion = async (pageId) => {
    try {
        const response = await notionClient().get(`pages/${pageId}`);

        return response.data;
    } catch (error) {
        console.error('Error fetching page from Notion:', error);
        console.error('Response data:', error.response.data);
        throw error;
    }
}

const getNewPagesFromNotion = async () => {
  try {
    const response = await notionClient().post(
      `databases/${NOTION_DATABASE_ID}/query`,
      { page_size: 100 }
    );

    return response.data.results.filter(filterPage);
  } catch (error) {
    console.error('Error fetching pages from Notion:', error);
    console.error('Response data:', error.response.data);
    throw error;
  }
};

const getOpenAiPromptForPage = async (page) => {
  const pageChildren = await notionClient().get(`blocks/${page.id}/children`);

  return extractOpenAiPrompt(page, pageChildren.data);
};

const updatePageCover = async (pageId, coverUrl) => {
  try {
    const response = await notionClient().patch(`pages/${pageId}`, {
      cover: {
        type: 'external',
        external: {
          url: coverUrl,
        },
      },
    });
    return response;
  } catch (error) {
    console.error('Error updating page cover:', error);
    console.error('Response data:', error.response.data);
    throw error;
  }
};

module.exports = {
  getSinglePageFromNotion,
  getNewPagesFromNotion,
  getOpenAiPromptForPage,
  updatePageCover
};