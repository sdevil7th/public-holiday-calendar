import { Modal } from "react-bootstrap";
import Select from "react-select";
import { COUNTRY_LIST } from "../../utils/countryAndCalendarData";
import { CountryListItem } from "../Calendar/types";

interface CountryModalProps {
  showCountryModal: boolean;
  handleCloseCountryModal: () => void;
  currCountry: CountryListItem;
  setCurrCountry: React.Dispatch<React.SetStateAction<CountryListItem>>;
}

const COUNTRY_LIST_FOR_REACT_SELECT = COUNTRY_LIST.map((countryObj) => {
  return {
    value: { ...countryObj, Code: countryObj.Code.toLowerCase() },
    label: `${countryObj.Name} (${countryObj.Code})`,
  };
});

const CountryModal = (props: CountryModalProps) => {
  const {
    showCountryModal,
    handleCloseCountryModal,
    currCountry,
    setCurrCountry,
  } = props;
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

export default CountryModal;
