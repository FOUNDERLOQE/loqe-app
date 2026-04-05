import { ClientProfileData, IntakeFormValues } from './types';

function asString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function asStringArray(value: unknown) {
  return Array.isArray(value) ? value.map((item) => String(item)) : [];
}

function splitTextarea(value: string) {
  return value
    .split(/[,\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function buildTravelStyleSummary(profile: ClientProfileData): string[] {
  const summary: string[] = [];

  const movie = asString(profile.holidayMovie);
  const climate = asString(profile.preferredClimate);
  const soundtrack = asString(profile.idealTravelSoundtrack);
  const vibeWords = asString(profile.tripVibeWords);
  const spirit = asString(profile.travelSpiritAnimal);

  if (movie) summary.push(movie);
  if (climate) summary.push(`Climate: ${climate}`);
  if (soundtrack) summary.push(`Soundtrack: ${soundtrack}`);
  if (vibeWords) summary.push(`Trip vibe: ${vibeWords}`);
  if (spirit) summary.push(`Spirit animal: ${spirit}`);

  return summary.slice(0, 6);
}

export function buildSignals(
  form: IntakeFormValues,
  profile: ClientProfileData
) {
  const preferredTags = new Set<string>();
  const destinationTypes = new Set<string>();
  const avoidTags = new Set<string>();

  const excitement = asStringArray(profile.travelExcitement);
  excitement.forEach((item) => {
    const lower = item.toLowerCase();
    if (lower.includes('culinary')) preferredTags.add('food');
    if (lower.includes('cultural')) preferredTags.add('culture');
    if (lower.includes('adventure')) preferredTags.add('adventure');
    if (lower.includes('luxury')) preferredTags.add('luxury');
    if (lower.includes('wellness')) preferredTags.add('wellness');
    if (lower.includes('shopping')) preferredTags.add('shopping');
  });

  const climate = asString(profile.preferredClimate).toLowerCase();
  if (climate.includes('tropical') || climate.includes('warm')) {
    destinationTypes.add('warm weather');
  }
  if (climate.includes('cold') || climate.includes('cool')) {
    destinationTypes.add('cold climate');
  }

  const oceanOrMountain = asString(profile.wouldYouRatherOceanOrMountain).toLowerCase();
  if (oceanOrMountain.includes('ocean')) destinationTypes.add('beach');
  if (oceanOrMountain.includes('mountain')) destinationTypes.add('mountains');

  const exploreOrLounge = asString(profile.wouldYouRatherExploreOrLounge).toLowerCase();
  if (exploreOrLounge.includes('exploring')) preferredTags.add('adventure');
  if (exploreOrLounge.includes('lounging')) preferredTags.add('wellness');

  const foodOrMichelin = asString(profile.wouldYouRatherStreetFoodOrMichelin).toLowerCase();
  if (foodOrMichelin.includes('street food')) preferredTags.add('food');
  if (foodOrMichelin.includes('michelin')) {
    preferredTags.add('food');
    preferredTags.add('luxury');
  }

  const tripVibeWords = splitTextarea(asString(profile.tripVibeWords));
  tripVibeWords.forEach((item) => preferredTags.add(item.toLowerCase()));

  const mustHaves = splitTextarea(asString(profile.accommodationMustHaves));
  mustHaves.forEach((item) => preferredTags.add(item.toLowerCase()));

  const noGos = splitTextarea(asString(profile.absoluteDealBreakers));
  noGos.forEach((item) => avoidTags.add(item.toLowerCase()));

  const tripType = form.tripType;
  if (tripType) preferredTags.add(tripType.toLowerCase());

  return {
    preferredTags: Array.from(preferredTags),
    destinationTypes: Array.from(destinationTypes),
    avoidTags: Array.from(avoidTags),
    budgetBand: form.budgetBand,
    tripType: form.tripType,
    tripLengthDays: Number(form.tripLengthDays) || 0,
    travellerCount: Number(form.travellerCount) || 0,
  };
}