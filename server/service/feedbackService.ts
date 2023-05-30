import { CreateTaskResult, createTask } from '../client/heightClient';

type FormData = {
  description: string;
  reproSteps?: string;
  device?: string;
  browser?: string;
  client?: string;
};

export async function submitBug(formData: FormData): Promise<CreateTaskResult> {
  const { description, reproSteps, device, browser, client } = formData;
  return await createTask(
    `Bug Report: ${description.substring(0, 30)}`,
    process.env.HEIGHT_LIST_ID_BUGS ?? '',
    `${description}\n# Reproduction steps:\n${
      reproSteps ?? 'None'
    }\n# System info:\n- Device: ${device ?? 'N/A'}\n- Browser: ${
      browser ?? 'N/A'
    }\n- Client: ${client ?? 'N/A'}`,
  );
}

export async function submitSuggestion(
  formData: FormData,
): Promise<CreateTaskResult> {
  const suggestionContent = formData.description;
  return await createTask(
    `Suggestion: ${suggestionContent.substring(0, 30)}`,
    process.env.HEIGHT_LIST_ID_SUGGESTIONS ?? '',
    suggestionContent,
  );
}

export async function submitFeedback(
  formData: FormData,
): Promise<CreateTaskResult> {
  const feedbackContent = formData.description;
  return await createTask(
    `Feedback: ${feedbackContent.substring(0, 30)}`,
    process.env.HEIGHT_LIST_ID_FEEDBACK ?? '',
    feedbackContent,
  );
}
