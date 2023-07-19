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

export interface DATE_NAGER_CALENDAR_EVENT {
  date: string; // "2015-01-01",
  localName: string; // "New Year's Day",
  name: string; // "New Year's Day",
  countryCode: string; // "CA",
}
