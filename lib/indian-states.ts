// States only (28); UTs excluded per your request.
export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
] as const

export type IndianState = (typeof INDIAN_STATES)[number]

export const CM_NAME_BY_STATE: Record<IndianState, string> = {
  "Andhra Pradesh": "Y. S. Jagan Mohan Reddy", // Updated
  "Arunachal Pradesh": "Pema Khandu",
  Assam: "Himanta Biswa Sarma",
  Bihar: "Nitish Kumar",
  Chhattisgarh: "Vishnu Deo Sai",
  Goa: "Pramod Sawant",
  Gujarat: "Bhupendra Patel",
  Haryana: "Nayab Singh Saini",
  "Himachal Pradesh": "Sukhvinder Singh Sukhu",
  Jharkhand: "Champai Soren",
  Karnataka: "Siddaramaiah",
  Kerala: "Pinarayi Vijayan",
  "Madhya Pradesh": "Mohan Yadav",
  Maharashtra: "Eknath Shinde",
  Manipur: "N. Biren Singh",
  Meghalaya: "Conrad Sangma",
  Mizoram: "Lalduhoma",
  Nagaland: "Neiphiu Rio",
  Odisha: "Naveen Patnaik", // Updated
  Punjab: "Bhagwant Mann",
  Rajasthan: "Bhajan Lal Sharma",
  Sikkim: "Prem Singh Tamang",
  "Tamil Nadu": "M. K. Stalin",
  Telangana: "A. Revanth Reddy", // Updated with full name
  Tripura: "Manik Saha",
  "Uttar Pradesh": "Yogi Adityanath",
  Uttarakhand: "Pushkar Singh Dhami",
  "West Bengal": "Mamata Banerjee",
}

// Wikipedia titles (some differ from display names)
export const CM_WIKI_TITLE_BY_STATE: Record<IndianState, string> = {
  "Andhra Pradesh": "Y. S. Jagan Mohan Reddy", // Updated
  "Arunachal Pradesh": "Pema Khandu",
  Assam: "Himanta Biswa Sarma",
  Bihar: "Nitish Kumar",
  Chhattisgarh: "Vishnu Deo Sai",
  Goa: "Pramod Sawant",
  Gujarat: "Bhupendra Patel",
  Haryana: "Nayab Singh Saini",
  "Himachal Pradesh": "Sukhvinder Singh Sukhu",
  Jharkhand: "Champai Soren",
  Karnataka: "Siddaramaiah",
  Kerala: "Pinarayi Vijayan",
  "Madhya Pradesh": "Mohan Yadav (politician)",
  Maharashtra: "Eknath Shinde",
  Manipur: "N. Biren Singh",
  Meghalaya: "Conrad Sangma",
  Mizoram: "Lalduhoma",
  Nagaland: "Neiphiu Rio",
  Odisha: "Naveen Patnaik", // Updated
  Punjab: "Bhagwant Mann",
  Rajasthan: "Bhajan Lal Sharma",
  Sikkim: "Prem Singh Tamang",
  "Tamil Nadu": "M. K. Stalin",
  Telangana: "A. Revanth Reddy", // Updated with full name
  Tripura: "Manik Saha",
  "Uttar Pradesh": "Yogi Adityanath",
  Uttarakhand: "Pushkar Singh Dhami",
  "West Bengal": "Mamata Banerjee",
}

// Union Territories support: list + (partial) CM mappings and wiki titles
export const INDIAN_UNION_TERRITORIES = [
  "Delhi",
  "Puducherry",
  "Jammu and Kashmir",
  "Ladakh",
  "Chandigarh",
  "Andaman and Nicobar Islands",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Lakshadweep",
] as const

export type IndianUT = (typeof INDIAN_UNION_TERRITORIES)[number]

// Only UTs that currently have a CM (others are administered differently)
export const CM_NAME_BY_UT: Partial<Record<IndianUT, string>> = {
  Delhi: "Rekha Gupta", // Updated
  Puducherry: "N. Rangasamy",
  "Jammu and Kashmir": "Manoj Sinha", // LG
}

export const CM_WIKI_TITLE_BY_UT: Partial<Record<IndianUT, string>> = {
  Delhi: "Rekha_Gupta_(politician)", // Updated with disambiguation
  Puducherry: "N._Rangasamy",
  "Jammu and Kashmir": "Manoj_Sinha",
}
