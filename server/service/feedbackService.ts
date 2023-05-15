import { createTask } from "../client/heightClient";

export function submitBug(formData) {
    const { description, reproSteps, device, browser, client } = formData;
    return createTask(
        `Bug Report: ${description.substring(0, 30)}`,
        process.env.HEIGHT_LIST_ID_BUGS,
        `${description}\n# Reproduction steps:\n${reproSteps}\n# System info:\n- Device: ${device}\n- Browser: ${browser}\n- Client: ${client}`
    );
}

export function submitSuggestion(formData) {
    const suggestionContent = formData.description;
    return createTask(
        `Suggestion: ${suggestionContent.substring(0, 30)}`,
        process.env.HEIGHT_LIST_ID_SUGGESTIONS,
        suggestionContent
    );
}

export function submitFeedback(formData) {
    const feedbackContent = formData.description;
    return createTask(
        `Feedback: ${feedbackContent.substring(0, 30)}`,
        process.env.HEIGHT_LIST_ID_FEEDBACK,
        feedbackContent
    );
}
