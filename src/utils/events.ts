import { EventSourceInput } from "@fullcalendar/core/index.js";

let todayStr = new Date().toISOString().replace(/T.*$/, ""); // YYYY-MM-DD of today

export const INITIAL_EVENTS: EventSourceInput = [
  {
    id: "0",
    title: "All-day event",
    start: todayStr,
  },
  {
    id: "1",
    title: "Timed event",
    start: todayStr + "T12:00:00",
  },
];
