const BASE_URL = "https://oldschool.runescape.wiki/api.php";
const USER_AGENT = "ReldoApp";

function buildURL(action, format, queryParams) {
    const stringQuery = Object.keys(queryParams)
        .map((key) => `&${key}=${queryParams[key]}`)
        .join("");
    return `${BASE_URL}?action=${action}&format=${format}${stringQuery}`;
}

/**
 * Plaintext wiki search, returns mapping of result page titles to page urls.
 *
 * Ex: search "abyssal" returns:
 * {
 *  "Abyssal": "https://oldschool.runescape.wiki/w/Abyssal",
 *  "Abyssal whip": "https://oldschool.runescape.wiki/w/Abyssal_whip",
 *  ...etc
 * }
 */
export async function textSearch(searchString) {
    const url = buildURL("opensearch", "json", { search: searchString });
    const result = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "User-agent": USER_AGENT,
        },
        body: JSON.stringify({
            name: title,
            listIds: [listId],
            description: `${content} \n\n(submitted ${new Date().toISOString()})`,
        }),
    });
    const parsedResults = {};
    for (let i = 0; i < result[1].length; i++) {
        parsedResults[result[1][i]] = result[3][i];
    }
    return parsedResults;
}
