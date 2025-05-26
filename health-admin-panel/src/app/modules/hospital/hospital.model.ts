export interface Hospital {
  id?: number | string;
  name: string;
  locationBase: string; // Local/Other Cities
  availability: string; // Next 3 days, Weekend only, etc.
  languagesSpoken: string[];
  genderPreference: string;
  ratings: number;
  externalRatings?: string;
  academicMerit?: string;
  fellowshipType?: string;
  experience?: string;
  surgeryVolume?: number;
  implantPreference?: string;
}
