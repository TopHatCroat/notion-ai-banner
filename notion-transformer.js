/**
 * Filter used to determine if a page should be processed for banner generation
 *
 * @param page notion page object, reference https://developers.notion.com/reference/retrieve-a-page
 * @returns true if the page should be processed, false otherwise
 */
const filterPage = (page) => {
    return page.cover === null;
}

/**
 * Extracts the OpenAI prompt from a Notion page
 *
 * @param page notion page object, reference https://developers.notion.com/reference/retrieve-a-page
 * @param pageChildren notion page children object, reference https://developers.notion.com/reference/get-block-children
 * @returns the OpenAI prompt to be used for banner generation
 */
const extractOpenAiPrompt = (page, pageChildren) => {
    const description = pageChildren.results[1].paragraph.rich_text[0].plain_text
    const title = page.properties['Title'].title[0].plain_text

    const emotions = page.properties['Emotions'].multi_select.map((emotion) => {
        return emotion.name
    }).join(', ')


    const participants = page.properties['Participants'].multi_select.map((participant) => {
        return participant.name
    }).join(', ')

    const locations = page.properties['Locations'].multi_select.map((location) => {
        return location.name
    }).join(', ')

    return `
    Generate an image with the title "${title}", described as ${description}.
    This image should show the emotions: ${emotions}.
    It should show characters: ${participants}.
    The locations are: ${locations}.
    `;
}

module.exports = {
    filterPage,
    extractOpenAiPrompt
}