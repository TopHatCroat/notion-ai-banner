const notionClient = require('./notionClient');
const { NOTION_DATABASE_ID } = process.env;

const getNewPagesFromNotion = async () => {
  try {
    const response = await notionClient().post(
      `databases/${NOTION_DATABASE_ID}/query`,
      { page_size: 100 }
    );
    // Logic to filter new pages based on last check timestamp or an equivalent approach

    const pagesWithoutCoverImage = response.data.results.filter(page => {
      return page.cover === null;
    });

    // return pagesWithoutCoverImage;
    return [pagesWithoutCoverImage[0]];
  } catch (error) {
    console.error('Error fetching pages from Notion:', error);
    console.error('Response data:', error.response.data);
    throw error;
  }
};

const getPageSummariesAndProperties = async (pages) => {
  return await Promise.all(pages.map(async (page) => {
    const properties = page.properties;

    const summary = page.properties.find(property => property.id === 'Title').title[0].plain_text;

    const notionPage = await notionClient().get(`pages/${page.id}`);
    // TODO: Add logic to extract additional properties and summary from the page object

    return {
      id: page.id,
      summary
    };
  }));
};

module.exports = {
  getNewPagesFromNotion,
  getPageSummariesAndProperties
};