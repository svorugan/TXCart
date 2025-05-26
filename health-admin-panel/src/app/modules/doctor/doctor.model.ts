export interface Doctor {
  id?: number | string;
  
  // Basic Information
  name: string; // Full name with title (e.g., Dr. Aditi Rao)
  photoUrl?: string; // URL to doctor's photo
  specialty: string; // e.g., Orthopedic Surgeon
  qualifications?: string[]; // e.g., MBBS, MS (Orthopedics), DNB
  experience: string; // e.g., 15+ years
  languagesSpoken: string[];
  gender: string;
  
  // Professional Details
  medicalLicenseNo?: string; // e.g., ORTHO-56789
  hospitalAffiliations?: string[]; // List of hospitals
  clinicName?: string;
  clinicLocation?: string;
  workingHours?: string; // e.g., Mon–Fri: 9 AM – 1 PM, 4 PM – 7 PM
  telehealth?: boolean; // Yes/No
  
  // Areas of Expertise
  areasOfExpertise?: string[]; // e.g., Joint Replacement Surgery, Sports Injuries
  
  // Patient Services
  patientServices?: string[]; // e.g., Consultation, Digital X-ray Interpretation
  
  // Booking & Contact
  consultationFee?: string; // e.g., ₹1000 (in-person), ₹800 (online)
  appointmentOptions?: string[]; // e.g., Book via App, Phone, Walk-in
  locationMap?: string; // URL to embedded map
  email?: string;
  phone?: string;
  
  // About the Doctor
  about?: string; // Brief bio
  
  // Ratings & Reviews
  ratings: number; // Average rating
  reviewCount?: number; // Number of reviews
  patientComments?: string[]; // List of patient comments
  
  // Certifications & Affiliations
  certifications?: string[];
  affiliations?: string[];
  publications?: string[];
  
  // Legacy fields (keeping for backward compatibility)
  fellowshipType: string; // National, International, Multiple
  locationBase: string; // Local, Other Cities
  availability: string; // Next 3 days, Weekend only
  surgeryVolume: number;
  implantPreference: string;
  externalRatings?: string;
  academicMerit?: string;
  education?: string[];
  experienceDetails?: string;
  previousSurgeries?: string[];
  surgeriesInPast?: string[];
  preferredImplants?: string[];
}
