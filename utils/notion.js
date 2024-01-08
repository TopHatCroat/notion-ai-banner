const notionClient = require('./notionClient');
const { filterPage } = require('../notion-transformer');
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

const getPageSummariesAndProperties = async (page) => {
  const properties = page.properties;

  const title = page.properties['Title'].title[0].plain_text

  const pageContent = await notionClient().get(`blocks/${page.id}/children`);
  const summary = pageContent.data.results[1].paragraph.rich_text[0].plain_text

  return {
    id: page.id,
    title,
    summary
  };
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
  getPageSummariesAndProperties,
  updatePageCover
};