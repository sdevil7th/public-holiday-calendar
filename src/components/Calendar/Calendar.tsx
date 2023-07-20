import {
  FC,
  LegacyRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import multiMonthPlugin from "@fullcalendar/multimonth";
import interactionPlugin from "@fullcalendar/interaction";
import bootstrap5Plugin from "@fullcalendar/bootstrap5";

import DateModal from "../Modals/DateModal";
import CountryModal from "../Modals/CountryModal";

import {
  fetchDNHolidayForYearData,
  fetchGCHolidayData,
  fetchLocationData,
} from "./apiCalls";

import {
  FULLCALENDAR_TIME_NAME_MAPPING,
  GC_COUNTRY_CALENDAR_MAP,
} from "../../utils/countryAndCalendarData";

import {
  DatesSetArg,
  EventSourceInput,
  ToolbarInput,
} from "@fullcalendar/core/index.js";
import {
  CountryListItem,
  DATE_NAGER_CALENDAR_EVENT,
  GC_API_RESPONSE,
  GOOGLE_CALENDAR_EVENT,
  LocationApiResponse,
} from "./types";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Calendar.scss";

const SCREEN_WIDTH_THRESHOLD = 820;

const Calendar: FC = () => {
  const calendarRef = useRef<FullCalendar>();

  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  const [currTitle, setCurrTitle] = useState<string>("");
  const [currViewType, setCurrViewType] = useState<string>("");
  const [currCountry, setCurrCountry] = useState<CountryListItem>({
    Name: "Belgium",
    Code: "be",
  });
  const [currLatLon, setCurrLatLon] = useState<{
    lat: number;
    lon: number;
  } | null>(null);

  const [currYear, setCurrYear] = useState<number>(2023);
  const [currMonth, setCurrMonth] = useState<string | null>("January");

  const [showCountryModal, setShowCountryModal] = useState<boolean>(false);
  const [showDateChangeModal, setShowDateChangeModal] =
    useState<boolean>(false);

  const [GCHolidayEventsForCountry, setGCHolidayEventsForCountry] = useState<
    GOOGLE_CALENDAR_EVENT[]
  >([]);

  const [DNHolidayEventsForCountry, setDNHolidayEventsForCountry] = useState<
    DATE_NAGER_CALENDAR_EVENT[]
  >([]);

  const handleCloseCountryModal = useCallback(
    () => setShowCountryModal(false),
    []
  );

  const handleCloseDateChangeModal = useCallback(
    () => setShowDateChangeModal(false),
    []
  );

  // Queries
  useQuery(
    ["fetchLocationData", currLatLon],
    () => {
      if (currLatLon) return fetchLocationData(currLatLon);
    },
    {
      enabled: Boolean(currLatLon),
      onSuccess: (data) => {
        if (
          data &&
          (data?.data as LocationApiResponse)?.address?.country &&
          (data?.data as LocationApiResponse)?.address?.country_code
        ) {
          setCurrCountry({
            Name: (data.data as LocationApiResponse).address.country,
            Code: (data.data as LocationApiResponse).address.country_code,
          });
        }
      },
      onError: (err) => {
        console.error(err);
      },
    }
  );

  useQuery(
    ["fetchGCHolidayData", currCountry?.Name],
    () => {
      return fetchGCHolidayData({
        calendarId: GC_COUNTRY_CALENDAR_MAP[currCountry.Name],
      });
    },
    {
      enabled:
        import.meta.env.VITE_GOOGLE_CALENDAR_KEY &&
        Boolean(currCountry?.Name) &&
        Boolean(GC_COUNTRY_CALENDAR_MAP[currCountry.Name]),
      onSuccess: (data) => {
        if (data && (data?.data as GC_API_RESPONSE)?.items?.length) {
          setGCHolidayEventsForCountry((data.data as GC_API_RESPONSE).items);
        }
      },
      onError: (err) => {
        console.error(err);
      },
    }
  );

  useQuery(
    ["fetchDNHolidayForYearData", currCountry?.Code, currYear],
    () => {
      return fetchDNHolidayForYearData({
        year: currYear,
        country: currCountry?.Code,
      });
    },
    {
      enabled: Boolean(currCountry?.Code) && Boolean(currYear),
      onSuccess: (data) => {
        if (data && (data?.data as DATE_NAGER_CALENDAR_EVENT[])?.length) {
          setDNHolidayEventsForCountry(
            data.data as DATE_NAGER_CALENDAR_EVENT[]
          );
        }
      },
      onError: (err) => {
        console.error(err);
      },
    }
  );

  const calendarApi = useMemo(() => {
    if (calendarRef?.current) {
      return calendarRef.current.getApi();
    } else return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calendarRef?.current]);

  const onChangeYear = useCallback(
    (year: number) => {
      if (calendarApi) {
        const currDate = calendarApi.getDate();
        calendarApi.gotoDate(
          new Date(moment(currDate).year(year).format("MM-DD-YYYY"))
        );
      }
    },
    [calendarApi]
  );

  const onChangeMonth = useCallback(
    (month: string) => {
      if (calendarApi) {
        const currDate = calendarApi.getDate();
        calendarApi.gotoDate(
          new Date(moment(currDate).month(month).format("MM-DD-YYYY"))
        );
      }
    },
    [calendarApi]
  );

  const onViewUpdate = (dateInfo: DatesSetArg) => {
    if (dateInfo?.view?.title && dateInfo.view.title !== currTitle) {
      setCurrTitle(dateInfo.view.title);
      const parts = dateInfo.view.title.split(" ");
      const newYear = Number(parts[parts.length - 1]);
      const newMonth =
        dateInfo.view.type === FULLCALENDAR_TIME_NAME_MAPPING["month"]
          ? parts[0]
          : null;
      if (newYear !== currYear) {
        setCurrYear(newYear);
      }
      if (currMonth !== newMonth) {
        setCurrMonth(newMonth);
      }
    }
    if (dateInfo?.view?.type && dateInfo.view.type !== currViewType) {
      setCurrViewType(dateInfo.view.type);
    }
  };

  const onWheel = useCallback(
    (event: React.WheelEvent<HTMLDivElement>) => {
      if (
        currViewType === FULLCALENDAR_TIME_NAME_MAPPING["month"] &&
        calendarApi
      ) {
        if (event.deltaY > 0) {
          calendarApi.next();
        } else if (event.deltaY < 0) {
          calendarApi.prev();
        }
      }
    },
    [currViewType, calendarApi]
  );

  const events: EventSourceInput = useMemo(() => {
    const eventsArr: EventSourceInput = [];
    if (GCHolidayEventsForCountry.length) {
      GCHolidayEventsForCountry.forEach((GCEvent) => {
        eventsArr.push({
          id: GCEvent.id,
          title: GCEvent.summary,
          start: GCEvent.start.date,
          end: GCEvent.end.date,
        });
      });
    }
    if (DNHolidayEventsForCountry.length) {
      DNHolidayEventsForCountry.forEach((DNEvent) => {
        eventsArr.push({
          id: `${DNEvent.date}-${DNEvent.countryCode}-${DNEvent.localName}`,
          title: `${DNEvent.name} (${DNEvent.localName})`,
          start: new Date(DNEvent.date).toISOString().replace(/T.*$/, ""),
        });
      });
    }
    return eventsArr;
  }, [GCHolidayEventsForCountry, DNHolidayEventsForCountry]);

  useEffect(() => {
    // ask for permission once the basic app is loaded
    if (navigator && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((loc) => {
        if (loc && loc.coords?.latitude && loc.coords?.longitude) {
          setCurrLatLon({
            lat: loc.coords.latitude,
            lon: loc.coords.longitude,
          });
        }
      });
    }
  }, []);

  useEffect(() => {
    if (currCountry.Name) {
      // reset if country change
      setGCHolidayEventsForCountry([]);
      setDNHolidayEventsForCountry([]);
    }
  }, [currCountry.Name]);

  useEffect(() => {
    const updateDimension = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", updateDimension);

    return () => {
      window.removeEventListener("resize", updateDimension);
    };
  }, []);

  const headerToolbarOptions: false | ToolbarInput = useMemo(() => {
    if (windowWidth < SCREEN_WIDTH_THRESHOLD) {
      return {
        left: "customTitleBtn",
        right: `${FULLCALENDAR_TIME_NAME_MAPPING["month"]},${FULLCALENDAR_TIME_NAME_MAPPING["year"]}`,
      };
    } else {
      return {
        left: "prev,next today",
        center: "customCountryBtn customTitleBtn",
        right: `${FULLCALENDAR_TIME_NAME_MAPPING["month"]},${FULLCALENDAR_TIME_NAME_MAPPING["year"]}`,
      };
    }
  }, [windowWidth]);

  const footerToolbarOptions: false | ToolbarInput = useMemo(() => {
    if (windowWidth < SCREEN_WIDTH_THRESHOLD) {
      return {
        left: "customCountryBtn",
        right: "prev,next today",
      };
    }
    return false;
  }, [windowWidth]);

  return (
    <div className="calendar-container">
      <div className="calendar-main" onWheel={onWheel}>
        <FullCalendar
          ref={calendarRef as LegacyRef<FullCalendar>}
          plugins={[
            dayGridPlugin,
            multiMonthPlugin,
            interactionPlugin,
            bootstrap5Plugin,
          ]}
          customButtons={{
            customTitleBtn: {
              hint: "Calendar title btn",
              text: currTitle,
              click: () => {
                setShowDateChangeModal(true);
              },
            },
            customCountryBtn: {
              hint: "Country select btn",
              text: currCountry.Name,
              click: () => {
                setShowCountryModal(true);
              },
            },
          }}
          // adding comma means inline, space means separate, pretty neat, huh!
          headerToolbar={headerToolbarOptions}
          footerToolbar={footerToolbarOptions}
          themeSystem="bootstrap5"
          initialView={FULLCALENDAR_TIME_NAME_MAPPING["month"]}
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          events={events} // alternatively, use the `events` setting to fetch from a feed
          datesSet={onViewUpdate}
        />
      </div>
      <CountryModal
        showCountryModal={showCountryModal}
        handleCloseCountryModal={handleCloseCountryModal}
        currCountry={currCountry}
        setCurrCountry={setCurrCountry}
      />
      <DateModal
        showDateChangeModal={showDateChangeModal}
        handleCloseDateChangeModal={handleCloseDateChangeModal}
        currViewType={currViewType}
        currMonth={currMonth}
        currYear={currYear}
        onChangeMonth={onChangeMonth}
        onChangeYear={onChangeYear}
      />
    </div>
  );
};

export default Calendar;
