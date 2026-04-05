import { IntakeFormValues, IntakePayload, ClientProfileData } from './types';

export function buildAutoSummary(form: IntakeFormValues) {
  const parts: string[] = [];

  if (form.clientName) parts.push(`${form.clientName} is planning`);
  else parts.push('Client is planning');

  if (form.tripType) parts.push(`a ${form.tripType.toLowerCase()}`);
  if (form.tripLengthDays) parts.push(`for ${form.tripLengthDays} days`);
  if (form.originCity) parts.push(`from ${form.originCity}`);

  if (form.travellerCount) {
    parts.push(
      `for ${form.travellerCount} traveller${Number(form.travellerCount) > 1 ? 's' : ''}`
    );
  }

  if (form.budgetBand) {
    parts.push(`with a ${form.budgetBand} budget profile`);
  }

  return `${parts.join(' ')}.`;
}

export function buildIntakePayload(
  form: IntakeFormValues,
  clientProfile: ClientProfileData
): IntakePayload {
  const autoSummary = buildAutoSummary(form);

  return {
    title: form.clientName ? `${form.clientName} - Travel Brief` : 'Untitled Travel Brief',
    clientName: form.clientName,
    tripType: form.tripType,
    originCity: form.originCity,
    tripLengthDays: Number(form.tripLengthDays) || null,
    travellerCount: Number(form.travellerCount) || null,
    budgetBand: form.budgetBand,
    notes: form.notes,
    autoSummary,
    clientProfileSnapshot: JSON.stringify(clientProfile ?? {}, null, 2),
  };
}