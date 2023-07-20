# Public Holiday Calendar App

This app fetches your location if permission provided, or you can provide your country by clicking on the Country and then fetch holidays from two calendars if present (GC and DN). It's a basic calendar without much interaction. There are unit tests and integration tests as well!

It's using Vite as bundler and React as main framework. I used Vitest for testing instead of jest.
It also uses an amazing library called FullCalendar!

## Installation

Required node version - 18.16.0

After cloning the repo and going to the directory, follow steps:

```sh
npm install
```

Then provide environment variables VITE_GOOGLE_CALENDAR_KEY (google calendar api key), if not available GC events won't be fetched
I'm using Doppler to provide the variables

With Doppler

```sh
doppler run -- npm run dev
```

Without Doppler

```sh
npm run dev
```

## Usage

Clicking on `month` shows Month view
Clicking on `year` shows Year view
Clicking on Prev/Next takes you to prev/next Month or Year depending on the view
Clicking on the Calendar Label which shows `Month Year`/`Year` should trigger a popup which lets you modify the current Month / Year
Clicking on the Country Label should trigger a popup which lets you select your own country
Once country and/or year is changed the events are refetched
