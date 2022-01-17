import fetch from "node-fetch";

export function createTask(title, listId, content) {
    return fetch(`${process.env.HEIGHT_API_ENDPOINT}/tasks`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `api-key ${process.env.HEIGHT_API_KEY}`,
        },
        body: JSON.stringify({
            name: title,
            listIds: [listId],
            description: `${content} \n\n(submitted ${new Date().toISOString()})`,
        }),
    })
        .then((res) => res.json())
        .then((json) => {
            return {
                status: 201,
                message: `Task ID ${json.id} successfully created!`,
            };
        })
        .catch((err) => {
            return {
                status: err.response.status,
                error: err,
            };
        });
}
