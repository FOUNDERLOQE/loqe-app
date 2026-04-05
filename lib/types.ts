export type ClientProfileData = Record<string, unknown>;

export type IntakeFormValues = {
  clientName: string;
  tripType: string;
  originCity: string;
  tripLengthDays: string;
  travellerCount: string;
  budgetBand: string;
  notes: string;
};

export type IntakePayload = {
  title: string;
  clientName: string;
  tripType: string;
  originCity: string;
  tripLengthDays: number | null;
  travellerCount: number | null;
  budgetBand: string;
  notes: string;
  autoSummary: string;
  clientProfileSnapshot: string;
};

export type SanityMediaAssetRef = {
  asset?: {
    url?: string;
  };
};

export type Destination = {
  _id: string;
  title: string;
  slug?: { current?: string } | string;
  country?: string;
  region?: string;
  summary?: string;
  budgetBand?: string;
  vibeTags?: string[];
  suitableFor?: string[];
  destinationTypes?: string[];
  bestTripTypes?: string[];
  climateTags?: string[];
  paceTags?: string[];
  experienceTags?: string[];
  travelLogistics?: string[];
  idealTripLength?: string;
  heroImage?: SanityMediaAssetRef;
  heroVideoUrl?: string;
};

export type RecommendedDestination = Destination & {
  recommendationScore: number;
  matchReasons: string[];
  matchWarnings: string[];
};

export type RecommendationSnapshotItem = {
  destinationId: string;
  title: string;
  slug: string;
  country: string;
  region: string;
  budgetBand: string;
  recommendationScore: number;
  matchReasons: string[];
  matchWarnings: string[];
};

export type RecommendationSnapshotPayload = {
  profileId: string;
  topDestinations: RecommendationSnapshotItem[];
};

export type ItineraryDraftPayload = {
  profileId: string;
  profile: {
    clientName: string;
    tripType: string;
    originCity: string;
    tripLengthDays: number;
    travellerCount: number;
    budgetBand: string;
  };
  destination: {
    title: string;
    slug: string;
  };
  recommendation: {
    recommendationScore: number;
    matchReasons: string[];
  };
  travelStyleSummary: string[];
};