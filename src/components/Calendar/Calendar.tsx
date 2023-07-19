import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import multiMonthPlugin from "@fullcalendar/multimonth";
import interactionPlugin from "@fullcalendar/interaction";
import bootstrap5Plugin from "@fullcalendar/bootstrap5";

import moment from "moment";

import { INITIAL_EVENTS } from "../../utils/events";
import { DatesSetArg } from "@fullcalendar/core/index.js";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import { LegacyRef, useMemo, useRef, useState } from "react";

import Modal from "react-bootstrap/Modal";
import Select from "react-select";
import {
  CALENDAR_MONTH_LIST,
  CALENDAR_YEAR_LIST,
  COUNTRY_LIST,
  CountryListItem,
} from "../../utils/countryAndCalendarData";

const COUNTRY_LIST_FOR_REACT_SELECT = COUNTRY_LIST.map((countryObj) => {
  return {
    value: countryObj,
    label: `${countryObj.Name} (${countryObj.Code})`,
  };
});

const FULLCALENDAR_TIME_NAME_MAPPING = {
  month: "dayGridMonth",
  year: "multiMonthYear",
};

const Calendar = () => {
  const calendarRef = useRef<FullCalendar>();

  const [currTitle, setCurrTitle] = useState<string>("");
  const [currViewType, setCurrViewType] = useState<string>("");
  const [currCountry, setCurrCountry] = useState<CountryListItem>({
    Name: "India",
    Code: "in",
  });

  const [currYear, setCurrYear] = useState<number>(2023);
  const [currMonth, setCurrMonth] = useState<string | null>("January");

  const [showCountryModal, setShowCountryModal] = useState<boolean>(false);
  const [showDateChangeModal, setShowDateChangeModal] =
    useState<boolean>(false);

  const handleCloseCountryModal = () => setShowCountryModal(false);

  const handleCloseDateChangeModal = () => setShowDateChangeModal(false);

  const onChangeYear = (year: number) => {
    if (calendarApi) {
      const currDate = calendarApi.getDate();
      console.log(currDate);
      calendarApi.gotoDate(
        new Date(moment(currDate).year(year).format("MM-DD-YYYY"))
      );
    }
  };

  const onChangeMonth = (month: string) => {
    if (calendarApi) {
      const currDate = calendarApi.getDate();
      calendarApi.gotoDate(
        new Date(moment(currDate).month(month).format("MM-DD-YYYY"))
      );
    }
  };

  const onViewUpdate = (dateInfo: DatesSetArg) => {
    console.log("View changed! : ", dateInfo);
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
        console.log("New year!! : ", newYear);
      }
      if (currMonth !== newMonth) {
        setCurrMonth(newMonth);
      }
    }
    if (dateInfo?.view?.type && dateInfo.view.type !== currViewType) {
      setCurrViewType(dateInfo.view.type);
      console.log("New type! : ", dateInfo.view.type);
    }
  };

  const calendarApi = useMemo(() => {
    if (calendarRef?.current) {
      return calendarRef.current.getApi();
    } else return null;
  }, [calendarRef?.current]);

  const renderCountryModal = () => {
    return (
      <Modal centered show={showCountryModal} onHide={handleCloseCountryModal}>
        <Modal.Header closeButton>
          <Modal.Title>Select your country</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Select
            className="basic-single-select"
            classNamePrefix="country-select"
            defaultValue={{
              label: `${currCountry.Name} (${currCountry.Code})`,
              value: currCountry,
            }}
            onChange={(newVal) => {
              if (newVal) {
                console.log(newVal);
                setCurrCountry(newVal.value);
                handleCloseCountryModal();
              }
            }}
            isSearchable={true}
            name="Country"
            options={COUNTRY_LIST_FOR_REACT_SELECT}
          />
        </Modal.Body>
      </Modal>
    );
  };

  const renderDateModal = () => {
    return (
      <Modal
        centered
        show={showDateChangeModal}
        onHide={handleCloseDateChangeModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Select{" "}
            {currViewType === FULLCALENDAR_TIME_NAME_MAPPING["month"]
              ? "month and year"
              : "year"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="date-change-modal-form">
            {currViewType === FULLCALENDAR_TIME_NAME_MAPPING["month"] ? (
              <Select
                className="basic-single-select month-select"
                classNamePrefix="date-month-select"
                placeholder="Select month"
                defaultValue={{
                  label: `${currMonth}`,
                  value: currMonth,
                }}
                onChange={(newVal) => {
                  if (newVal) {
                    console.log(newVal);
                    onChangeMonth(newVal.value as string);
                  }
                }}
                isSearchable={true}
                name="Date Month"
                options={CALENDAR_MONTH_LIST}
              />
            ) : (
              ""
            )}
            <Select
              className="basic-single-select"
              classNamePrefix="date-year-select"
              placeholder="Select year"
              defaultValue={{
                label: `${currYear}`,
                value: currYear,
              }}
              onChange={(newVal) => {
                if (newVal) {
                  console.log(newVal);
                  onChangeYear(newVal.value);
                }
              }}
              isSearchable={true}
              name="Date Year"
              options={CALENDAR_YEAR_LIST}
            />
          </div>
        </Modal.Body>
      </Modal>
    );
  };

  return (
    <div className="calendar-container">
      <div
        className="calendar-main"
        onWheel={(event) => {
          console.log("Scrolled! : ", event);
          if (currViewType === FULLCALENDAR_TIME_NAME_MAPPING["month"]) {
            if (event.deltaY > 0) {
              calendarApi?.next();
            } else if (event.deltaY < 0) {
              calendarApi?.prev();
            }
          }
        }}
      >
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
              text: currTitle,
              click: (_event) => {
                setShowDateChangeModal(true);
              },
            },
            customCountryBtn: {
              text: currCountry.Name,
              click: (_event) => {
                setShowCountryModal(true);
              },
            },
          }}
          // adding comma means inline, space means separate, pretty neat, huh!
          headerToolbar={{
            left: "prev,next today",
            center: "customCountryBtn customTitleBtn",
            right: `${FULLCALENDAR_TIME_NAME_MAPPING["month"]},${FULLCALENDAR_TIME_NAME_MAPPING["year"]}`,
          }}
          themeSystem="bootstrap5"
          initialView={FULLCALENDAR_TIME_NAME_MAPPING["month"]}
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          initialEvents={INITIAL_EVENTS} // alternatively, use the `events` setting to fetch from a feed
          datesSet={onViewUpdate}
        />
      </div>
      {renderCountryModal()}
      {renderDateModal()}
    </div>
  );
};

export default Calendar;
