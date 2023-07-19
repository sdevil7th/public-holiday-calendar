import { Modal } from "react-bootstrap";
import Select from "react-select";
import {
  CALENDAR_MONTH_LIST,
  CALENDAR_YEAR_LIST,
  FULLCALENDAR_TIME_NAME_MAPPING,
} from "../../utils/countryAndCalendarData";

interface DateModalProps {
  showDateChangeModal: boolean;
  handleCloseDateChangeModal: () => void;
  currViewType: string;
  currMonth: string | null;
  currYear: number;
  onChangeMonth: (month: string) => void;
  onChangeYear: (year: number) => void;
}

const DateModal = (props: DateModalProps) => {
  const {
    showDateChangeModal,
    handleCloseDateChangeModal,
    currViewType,
    currMonth,
    currYear,
    onChangeMonth,
    onChangeYear,
  } = props;

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
                label: `${currMonth || ""}`,
                value: currMonth,
              }}
              onChange={(newVal) => {
                if (newVal) {
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

export default DateModal;
