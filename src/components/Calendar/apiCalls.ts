import axios from "axios";

export const fetchLocationData = async (args: { lat: number; lon: number }) => {
  const { lat, lon } = args;
  if (!lat || !lon) {
    return;
  }
  const res = await axios.get(
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
  );
  return res;
};

export const fetchGCHolidayData = async (args: { calendarId: string }) => {
  const { calendarId } = args;
  if (!calendarId) {
    return;
  }
  const res = await axios.get(
    `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${
      import.meta.env.VITE_GOOGLE_CALENDAR_KEY as string
    }`
  );
  return res;
};

export const fetchDNHolidayForYearData = async (args: {
  year: number;
  country: string;
}) => {
  const { year, country } = args;
  if (!year || !country) {
    return;
  }
  const res = await axios.get(
    `https://date.nager.at/api/v3/publicholidays/${year}/${country}`
  );
  return res;
};
