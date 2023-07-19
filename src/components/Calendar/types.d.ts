export interface GOOGLE_CALENDAR_EVENT {
  id: string; // "20220417_3s7sr1qa2d9o9oe5cbgd3b6ju0",
  htmlLink: string; // "https://www.google.com/calendar/event?eid=MjAyMjA0MTdfM3M3c3IxcWEyZDlvOW9lNWNiZ2QzYjZqdTAgZW4udXNhI2hvbGlkYXlAdg",
  summary: string; // "Easter Sunday",
  description: string; // "Observance\nTo hide observances, go to Google Calendar Settings > Holidays in United States",
  start: {
    date: string; // "2022-04-17"
  };
  end: {
    date: string; // "2022-04-18"
  };
}

export interface GC_API_RESPONSE {
  kind: string;
  etag: string;
  summary: string;
  description: string;
  updated: string;
  timeZone: string;
  accessRole: string;
  nextSyncToken: string;
  items: GOOGLE_CALENDAR_EVENT[];
}

export interface DATE_NAGER_CALENDAR_EVENT {
  date: string; // "2015-01-01",
  localName: string; // "New Year's Day",
  name: string; // "New Year's Day",
  countryCode: string; // "CA",
}

export interface CountryListItem {
  Code: string;
  Name: string;
}

export interface LocationApiResponse {
  place_id: number;
  licence: string; //"Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright",
  osm_type: string; //"way",
  osm_id: string; //105738793,
  lat: string; //"22.581926875552618",
  lon: string; //"88.37685296081719",
  place_rank: number;
  category: string; //"highway",
  type: string; //"residential",
  importance: number;
  addresstype: string; //"road",
  name: string; //"Lolwa Road",
  display_name: string; //"Lolwa Road, Circular Mountain, Kolkata, Kolkata District, West Bengal, 701011, India",
  address: {
    road: string; //"Lolwa Road",
    suburb: string; //"Circular Mountain",
    city_district: string; //"Kolkata",
    city: string; //"Kolkata District",
    state: string; //"West Bengal",
    "ISO3166-2-lvl4": string; //"IN-WB",
    postcode: string; //"701011",
    country: string; //"India",
    country_code: string; //"in"
  };
}
