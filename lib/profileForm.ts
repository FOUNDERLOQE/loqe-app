import { clientProfileSchema } from './clientProfileSchema';
import { ClientProfileData } from './types';

const defaultAnnualRow = {
  year: '',
  majorLifeChanges: '',
  updatedTravelPreferences: '',
  upcomingImportantDates: '',
};

export function buildInitialClientProfileState(): ClientProfileData {
  const initial: ClientProfileData = {};

  clientProfileSchema.forEach((section) => {
    section.fields.forEach((field) => {
      if (field.type === 'checkbox') {
        initial[field.key] = [];
      } else if (field.type === 'arrayOfObjects') {
        initial[field.key] = [{ ...defaultAnnualRow }];
      } else if (field.type === 'radioWithOther') {
        initial[field.key] = '';
        initial[`${field.key}Other`] = '';
      } else {
        initial[field.key] = '';
      }
    });
  });

  return initial;
}

export function getSectionCompletionCount(
  sectionId: string,
  profile: ClientProfileData
): { completed: number; total: number } {
  const section = clientProfileSchema.find((item) => item.id === sectionId);

  if (!section) {
    return { completed: 0, total: 0 };
  }

  let completed = 0;
  const total = section.fields.length;

  section.fields.forEach((field) => {
    const value = profile[field.key];

    if (field.type === 'checkbox') {
      if (Array.isArray(value) && value.length > 0) completed += 1;
      return;
    }

    if (field.type === 'arrayOfObjects') {
      if (
        Array.isArray(value) &&
        value.some((row) =>
          Object.values(row as Record<string, unknown>).some((cell) => String(cell || '').trim())
        )
      ) {
        completed += 1;
      }
      return;
    }

    if (field.type === 'radioWithOther') {
      const selected = String(value || '').trim();
      const other = String(profile[`${field.key}Other`] || '').trim();

      if (selected && (selected !== 'Other' || other)) {
        completed += 1;
      }
      return;
    }

    if (String(value || '').trim()) {
      completed += 1;
    }
  });

  return { completed, total };
}