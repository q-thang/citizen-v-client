import { Autocomplete, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import locationData from "../data/location.json";
import { postDataAPI, getDataAPI } from "../utils/fetchData";
import ChartMonitor from "../components/ChartMonitor";
import citizenIcon from "../assets/list-citizens.png";

const Monitor = () => {
  const [units, setUnits] = useState([]);
  const { auth, user } = useSelector((state) => state);
  const [currentUnit, setCurrentUnit] = useState("");
  const [numberCitizens, setNumberCitizens] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const unitDistricts = user.searchLocation.city
      ? locationData.filter((e) => e.label === user.searchLocation.city)[0]
          .Districts
      : [];
    const unitWards = user.searchLocation.district
      ? unitDistricts.filter((e) => e.label === user.searchLocation.district)[0]
          .Wards
      : [];

    const getVillage = async () => {
      const res = await postDataAPI("unit/getVillage", {
        ward: user.searchLocation.ward,
      });
      return res.data;
    };

    switch (auth.user.regency) {
      case "A1":
        setUnits(locationData.map((e) => e.label));
        break;
      case "A2":
        setUnits(unitDistricts.map((e) => e.label));
        break;
      case "A3":
        setUnits(unitWards.map((e) => e.label));
        break;
      case "B1":
        if (user.searchLocation.ward) {
          getVillage().then((data) => setUnits(data.map((e) => e.nameOfUnit)));
        }
        break;
      default:
        break;
    }
  }, [auth.user.regency, user.searchLocation]);

  useEffect(() => {
    const getCitizensCurrent = async () => {
      const res = await getDataAPI(
        `user/monitor${currentUnit ? "?unit=" + currentUnit : ""}`
      );

      setNumberCitizens(res.data);
    };

    getCitizensCurrent();
  }, [currentUnit, dispatch]);

  return (
    <>
      <div className="sum-overall">
        <div className="overall-container">
          <div className="overall-cover">
            <div className="citizen-icon">
              <img src={citizenIcon} alt="citizen-icon" />
            </div>

            <div className="overall-info">
              <div className="title">T???ng s??? c??ng d??n ???? khai b??o</div>
              <div className="sum">
                <div className="number">{user.totalCitizen}</div>
                <div className="unit">(ng?????i)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="monitor-process">
        <div className="title">
          Theo d??i t??nh h??nh/ti???n ????? nh???p li???u c???a c??c ?????a ph????ng
        </div>
        <Autocomplete
          className="filter city"
          noOptionsText={"Kh??ng c?? l???a ch???n ph?? h???p"}
          options={units}
          size="small"
          onChange={(e, newInput) => {
            setCurrentUnit(newInput);
          }}
          renderInput={(params) => <TextField {...params} label="?????a ph????ng" />}
        />

        {currentUnit && (
          <div className="result">
            {" "}
            <div className="total-result">
              <span>
                T???ng s??? c??ng d??n ???? khai b??o c???a {currentUnit} l??:{" "}
                {numberCitizens}
              </span>
            </div>
            <ChartMonitor currentUnit={currentUnit} />{" "}
          </div>
        )}
      </div>
    </>
  );
};

export default Monitor;
