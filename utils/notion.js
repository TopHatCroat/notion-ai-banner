const notionClient = require('./notionClient');
const { filterPage, extractOpenAiPrompt } = require('../notion-transformer');
const { NOTION_DATABASE_ID } = process.env;

const getSinglePageFromNotion = async (pageId) => {
    try {
        const response = await notionClient().get(`pages/${pageId}`);

        return response.data;
    } catch (error) {
        console.error('Response data:', error.response.data);
        throw new Error('Failed to get a page from Notion API');
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
    console.error('Response data:', error.response.data);
    throw new Error('Failed to get new pages from Notion API');
  }
};

const getOpenAiPromptForPage = async (page) => {
  const pageChildren = await notionClient().get(`blocks/${page.id}/children`);

  return extractOpenAiPrompt(page, pageChildren.data);
};

const updatePageCover = async (pageId, coverUrl) => {
  try {
      return await notionClient().patch(`pages/${pageId}`, {
        cover: {
            type: 'external',
            external: {
                url: coverUrl,
            },
        },
    });
  } catch (error) {
    console.error('Response data:', error.response.data);
    throw new Error('Failed to update a page cover with Notion API');
  }
};

module.exports = {
  getSinglePageFromNotion,
  getNewPagesFromNotion,
  getOpenAiPromptForPage,
  updatePageCover
};