export type ParticipateSubmissionField = {
  id: string;
  sourceName: string;
  label: string;
  value: string | { name: string; size: number; type: string }[];
};

export type ParticipateSubmissionPayload = {
  formId: string;
  sourceUrl: string;
  fields: ParticipateSubmissionField[];
  files: Record<string, File[]>;
};

export class ParticipateFormError extends Error {
  code: 'missing-endpoint' | 'network';

  constructor(code: 'missing-endpoint' | 'network') {
    super(code);
    this.name = 'ParticipateFormError';
    this.code = code;
  }
}

export async function submitParticipateForm(payload: ParticipateSubmissionPayload) {
  const endpoint = import.meta.env.VITE_PARTICIPATE_FORM_ENDPOINT;

  if (!endpoint) {
    throw new ParticipateFormError('missing-endpoint');
  }

  const body = new FormData();
  body.append('formId', payload.formId);
  body.append('sourceUrl', payload.sourceUrl);
  body.append(
    'payload',
    JSON.stringify({
      formId: payload.formId,
      sourceUrl: payload.sourceUrl,
      submittedAt: new Date().toISOString(),
      fields: payload.fields,
    })
  );

  Object.entries(payload.files).forEach(([fieldId, files]) => {
    files.forEach((file) => body.append(fieldId, file));
  });

  // TODO: Configure VITE_PARTICIPATE_FORM_ENDPOINT with the real backend receiver for Waqf forms.
  const response = await fetch(endpoint, {
    method: 'POST',
    body,
  });

  if (!response.ok) {
    throw new ParticipateFormError('network');
  }
}
