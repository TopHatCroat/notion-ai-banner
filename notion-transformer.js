/**
 * Filter used to determine if a page should be processed for banner generation
 *
 * @param page notion page object, reference https://developers.notion.com/reference/retrieve-a-page
 * @returns true if the page should be processed, false otherwise
 */
const filterPage = (page) => {
    return page.cover === null;
}

const extractAiData = (page) => {

}

module.exports = {
    filterPage,
    extractAiData
}