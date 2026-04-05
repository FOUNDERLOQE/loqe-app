import { APP_CONFIG } from './config';
import sanityClient from './sanity';
import {
  Destination,
  IntakePayload,
  ItineraryDraftPayload,
  RecommendationSnapshotItem,
} from './types';

async function parseJsonResponse(response: Response) {
  const rawText = await response.text();
  let result: any = {};

  try {
    result = rawText ? JSON.parse(rawText) : {};
  } catch {
    throw new Error(`API did not return valid JSON. Raw response: ${rawText || 'empty response'}`);
  }

  if (!response.ok) {
    throw new Error(result.error || result.message || 'Request failed');
  }

  return result;
}

export async function createTripBrief(payload: IntakePayload) {
  const response = await fetch(`${APP_CONFIG.apiBaseUrl}/api/create-trip-brief`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return parseJsonResponse(response);
}

export async function createItineraryDraft(payload: ItineraryDraftPayload) {
  const response = await fetch(`${APP_CONFIG.apiBaseUrl}/api/create-itinerary-draft`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return parseJsonResponse(response);
}

export async function fetchDestinations(): Promise<Destination[]> {
  const query = `
    *[_type == "destination"] | order(title asc){
      _id,
      title,
      "slug": slug.current,
      country,
      region,
      summary,
      heroImage{
        asset->{
          url
        }
      },
      "heroVideoUrl": heroVideo.asset->url,
      budgetBand,
      vibeTags,
      suitableFor,
      destinationTypes,
      bestTripTypes,
      climateTags,
      paceTags,
      experienceTags,
      idealTripLength,
      travelLogistics
    }
  `;

  const results = await sanityClient.fetch(query);
  return Array.isArray(results) ? results : [];
}

export async function fetchHomepageDestinations(): Promise<Destination[]> {
  const query = `
    *[_type == "destination"] | order(title asc)[0...12]{
      _id,
      title,
      "slug": slug.current,
      country,
      region,
      summary,
      heroImage{
        asset->{
          url
        }
      },
      "heroVideoUrl": heroVideo.asset->url,
      budgetBand
    }
  `;

  const results = await sanityClient.fetch(query);
  return Array.isArray(results) ? results : [];
}

export async function saveRecommendationSnapshot(
  profileId: string,
  topDestinations: RecommendationSnapshotItem[]
) {
  const response = await fetch(`${APP_CONFIG.apiBaseUrl}/api/save-recommendation-snapshot`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      profileId,
      topDestinations,
    }),
  });

  return parseJsonResponse(response);
}