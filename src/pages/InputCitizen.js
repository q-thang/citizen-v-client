import React, { useEffect, useMemo, useState } from "react";
import locationData from "../data/location.json";
import ethnic from "../data/ethnic.json";
import { postDataAPI } from "../utils/fetchData";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import {
  Box,
  TextField,
  Autocomplete,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { LocalizationProvider, DatePicker } from "@mui/lab";
import moment from "moment";
import { validateCitizen } from "../utils/validateCitizen";
import logoDepartment from "../assets/department-citizen.png";
import vnLocale from "../data/formatVietnamMonth";
import greenTick from "../assets/green-tick.png";
import redX from "../assets/red-x.png";
import jobData from "../data/job.json";
import religionData from "../data/religion.json";
import { GLOBALTYPES } from "../redux/actions/globalTypes";

const InputCitizen = ({ editable, currentCitizen, updateCitizen }) => {
  // alert submit
  const [open, setOpen] = useState(false);
  const [openFailed, setOpenFailed] = useState(false);

  const handleOpenAlert = () => setOpen(true);
  const handleOpenFailAlert = () => setOpenFailed(true);

  const handleCloseAlert = () => setOpen(false);
  const handleCloseFailedAlert = () => setOpenFailed(false);

  const dispatch = useDispatch();

  const [alertMsg, setAlertMsg] = useState("");

  const { auth, socket, user } = useSelector((state) => state);
  const [citizenInfo, setCitizenInfo] = useState(
    {
      ...currentCitizen,
      dateOfBirth: new Date(),
      age: 0,
    } || {
      fullName: "",
      dateOfBirth: new Date(),
      currentAddress: "",
      gender: "",
      email: "",
      phoneNumber: "",
      identifiedCode: "",
      occupation: "",
      religion: "",
      residentAddress: "",
      educationLevel: "",
      city: "",
      district: "",
      ward: "",
      village: "",
      ethnic: "",
      age: 0,
    }
  );

  const [errBlur, setErrBlur] = useState({
    fullName: "",
    dateOfBirth: "",
    gender: "",
    identifiedCode: "",
    city: "",
    district: "",
    ward: "",
    village: "",
    ethnic: "",
    occupation: "",
    phoneNumber: "",
    email: "",
    religion: "",
    currentAddress: "",
    residentAddress: "",
    educationLevel: "",
  });

  const availableDistricts = useMemo(() => {
    if (citizenInfo.city) {
      const res = locationData.find((e) => e.label === citizenInfo.city);

      if (res) {
        return res.Districts;
      }
    }
  }, [citizenInfo.city]);

  const avaiableWards = useMemo(() => {
    if (citizenInfo.city && citizenInfo.district && availableDistricts) {
      const res = availableDistricts.find(
        (e) => e.label === citizenInfo.district
      );

      if (res) {
        return res.Wards;
      }
    }
  }, [citizenInfo.city, citizenInfo.district, availableDistricts]);

  useEffect(() => {
    if (currentCitizen) {
      setCitizenInfo(currentCitizen);
    }
  }, [currentCitizen]);

  const handleBlur = (type) => {
    if (!citizenInfo[type]) {
      switch (type) {
        case "fullName":
          setErrBlur({
            ...errBlur,
            [type]: "Vui l??ng nh???p h??? v?? t??n c???a c??ng d??n.",
          });

          break;
        case "dateOfBirth":
          setErrBlur({
            ...errBlur,
            [type]: "Vui l??ng nh???p ng??y sinh c???a c??ng d??n.",
          });
          break;
        case "gender":
          setErrBlur({
            ...errBlur,
            [type]: "Vui l??ng ch???n gi???i t??nh c???a c??ng d??n.",
          });
          break;
        case "identifiedCode":
          if (citizenInfo.age > 15) {
            setErrBlur({
              ...errBlur,
              [type]:
                "Vui l??ng nh???p c??n c?????c c??ng d??n/ch???ng minh th?? c???a c??ng d??n.",
            });
          }
          break;
        case "ethnic":
          setErrBlur({
            ...errBlur,
            [type]: "Vui l??ng ch???n d??n t???c c???a c??ng d??n.",
          });
          break;
        case "occupation":
          if (citizenInfo.age >= 6) {
            setErrBlur({
              ...errBlur,
              [type]: "Vui l??ng nh???p ngh??? nghi???p c???a c??ng d??n.",
            });
          }
          break;
        case "religion":
          setErrBlur({
            ...errBlur,
            [type]: "Vui l??ng ch???n t??n gi??o c???a c??ng d??n.",
          });
          break;
        case "currentAddress":
          setErrBlur({
            ...errBlur,
            [type]: "Vui l??ng nh???p ?????a ch??? t???m tr?? c???a c??ng d??n.",
          });
          break;
        case "residentAddress":
          setErrBlur({
            ...errBlur,
            [type]: "Vui l??ng nh???p ?????a ch??? th?????ng tr?? c???a c??ng d??n.",
          });
          break;
        case "educationLevel":
          setErrBlur({
            ...errBlur,
            [type]: "Vui l??ng nh???p tr??nh ????? h???c v???n c???a c??ng d??n.",
          });
          break;
        case "city":
          setErrBlur({
            ...errBlur,
            [type]: "Vui l??ng ch???n T???nh/Th??nh ph??? c???a c??ng d??n.",
          });
          break;

        case "district":
          setErrBlur({
            ...errBlur,
            [type]: "Vui l??ng ch???n Qu???n/Huy???n c???a c??ng d??n.",
          });
          break;

        case "ward":
          setErrBlur({
            ...errBlur,
            [type]: "Vui l??ng ch???n X??/Ph?????ng c???a c??ng d??n.",
          });
          break;
        case "village":
          setErrBlur({
            ...errBlur,
            [type]: "Vui l??ng ch???n nh???p Th??n/X??m/Khu/???p c???a c??ng d??n.",
          });
          break;
        default:
          break;
      }
    } else if (type === "fullName" && citizenInfo[type]) {
      let replaceSpace = citizenInfo.fullName;

      console.log(replaceSpace);

      replaceSpace = replaceSpace.replace(/\s+/g, " ").trim();

      const capitals = replaceSpace
        .split(" ")
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1));

      setCitizenInfo({ ...citizenInfo, fullName: capitals.join(" ") });
    } else if (type === "identifiedCode" && !validateID(citizenInfo[type])) {
      setErrBlur({
        ...errBlur,
        identifiedCode:
          "CCCD/CMT c???a c??ng d??n ch??? ???????c ch??? c??c s??? v?? ph???i ch???a ??t nh???t 9 s???.",
      });
    }
  };

  function printImage() {
    const image = document.querySelector(".form-nhap");
    const printWindow = window.open("", "Print Window", "height=400,width=600");
    printWindow.document.write("<html><head><title>Print Window</title>");
    printWindow.document.write("</head><body ><img src='");
    printWindow.document.write(image.src);
    printWindow.document.write("' /></body></html>");
    printWindow.document.close();
    printWindow.print();
  }

  function validateID(ID) {
    const re = /^!*(\d!*){9,}$/;
    return re.test(ID);
  }

  const handleBlurInput = (type) => {
    setErrBlur({ ...errBlur, [type]: "" });
  };

  const handleInput = (e) => {
    const { value, name } = e.target;
    if (name === "educationLevel") {
      let splash = value;
      if (splash.length === 2) {
        splash += "/12";
      }
      setCitizenInfo({ ...citizenInfo, [name]: splash });
    } else {
      setCitizenInfo({
        ...citizenInfo,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { city, district, ward, village } = citizenInfo;

    const check = validateCitizen(citizenInfo);
    if (check.errLength > 0) {
      setErrBlur(check.errMsg);
    } else {
      const location = {
        city,
        district,
        ward,
        village,
      };

      const finalInfo = {
        ...citizenInfo,
        dateOfBirth: moment(citizenInfo.dateOfBirth).format("DD/MM/YYYY"),
        location,
      };

      if (editable) {
        updateCitizen(finalInfo);
      } else {
        const res = await postDataAPI("citizen", finalInfo);

        socket.emit("increaseCitizen", {
          regencyCur: auth.user.regency,
          check: res.data.success,
          locationCur: user.searchLocation,
        });

        setAlertMsg(res.data.msg);

        dispatch({
          type: GLOBALTYPES.ADD_CITIZEN,
          payload: res.data.newCitizen,
        });

        res.data.success ? handleOpenAlert() : handleOpenFailAlert();
      }
    }
  };

  return (
    <div className="input-citizen">
      <Dialog // successful notification
        open={open}
        onClose={handleCloseAlert}
        className="dialog-after-input"
      >
        <DialogContent>
          <div className="content-container">
            <div className="img-alert">
              <div>
                <img src={greenTick} alt="print" />
              </div>
            </div>

            <div className="msg-alert">
              <div>{alertMsg}</div>
            </div>
          </div>
        </DialogContent>

        <DialogActions>
          <Button className="msg-submit" onClick={handleCloseAlert}>
            ????ng
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog // failed notification
        open={openFailed}
        onClose={handleCloseFailedAlert}
        className="dialog-after-input"
      >
        <DialogContent>
          <div className="content-container">
            <div className="img-alert">
              <div>
                <img src={redX} alt="alert" />
              </div>
            </div>

            <div className="msg-alert">
              <div>{alertMsg}</div>
            </div>
          </div>
        </DialogContent>

        <DialogActions>
          <Button className="msg-submit" onClick={handleCloseFailedAlert}>
            ????ng
          </Button>
        </DialogActions>
      </Dialog>

      {!editable && (
        <div className="title-logo">
          <div className="header-form">
            <div className="ministry">B??? Y T???</div>
            <div className="department">T???NG C???C D??N S???</div>
          </div>
          <div className="logo">
            <img src={logoDepartment} alt="logo of department" />
          </div>
          <div className="title">PHI???U ??I???N TH??NG TIN C???A C??NG D??N</div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {!editable && (
          <>
            {" "}
            <div className="print" onClick={() => printImage()}>
              <FontAwesomeIcon icon={faPrint} /> In phi???u ??i???n
            </div>
            <img
              src="https://res.cloudinary.com/dyywecvyl/image/upload/v1639054815/samples/Phi%E1%BA%BFu_%C4%91i%E1%BB%81n_th%C3%B4ng_tin_c%C3%B4ng_d%C3%A2n_1_dyjy8c.png"
              alt="form-nhap"
              className="form-nhap"
              style={{ display: "none" }}
            />
          </>
        )}

        <Box
          sx={{
            "& .MuiTextField-root": { m: 1 },
          }}
        >
          <div className="field fullname">
            <label className="label-text">
              H??? v?? t??n <span>{"(*)"}</span>
            </label>
            <TextField
              error={errBlur.fullName ? true : false}
              placeholder="V?? d???: Nguy???n V??n A"
              name="fullName"
              sx={{ width: "100%" }}
              value={citizenInfo.fullName}
              onChange={handleInput}
              onBlur={() => handleBlur("fullName")}
              onInput={() => handleBlurInput("fullName")}
              helperText={errBlur.fullName}
            />
          </div>

          <div className="field date-of-birth">
            <label className="label-text">
              Ng??y sinh <span>{"(*)"}</span>
            </label>
            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              locale={vnLocale}
            >
              <DatePicker
                disableFuture
                placeholder="dd/mm/yyyy"
                openTo="year"
                inputFormat="dd/MM/yyyy"
                views={["year", "month", "day"]}
                value={citizenInfo.dateOfBirth}
                // onError={() =>
                //   setErrBlur({
                //     ...errBlur,
                //     dateOfBirth: "Ng??y/th??ng/n??m sinh kh??ng h???p l???.",
                //   })
                // }
                onChange={(newValue) => {
                  setCitizenInfo({
                    ...citizenInfo,
                    dateOfBirth: newValue,
                    age: new Date().getFullYear() - newValue.getFullYear(),
                  });

                  setErrBlur({
                    ...errBlur,
                    dateOfBirth: "",
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    helperText={errBlur.dateOfBirth}
                    sx={{ width: "100%" }}
                    error={errBlur.dateOfBirth ? true : false}
                    onBlur={() => handleBlur("dateOfBirth")}
                    onInput={() => handleBlurInput("dateOfBirth")}
                  />
                )}
              />
            </LocalizationProvider>
          </div>

          <div className="field gender">
            <label className="label-text">
              Gi???i t??nh <span>{"(*)"}</span>
            </label>
            <Autocomplete
              disablePortal
              noOptionsText={"Kh??ng c?? l???a ch???n ph?? h???p"}
              options={["Nam", "N???"]}
              defaultValue={citizenInfo.gender}
              sx={{ width: 300 }}
              onInputChange={(e, newInput) => {
                setCitizenInfo({ ...citizenInfo, gender: newInput });
                setErrBlur({ ...errBlur, gender: "" });
              }}
              onBlur={() => handleBlur("gender")}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Nam/N???"
                  helperText={errBlur.gender}
                  error={errBlur.gender ? true : false}
                />
              )}
            />
          </div>

          <div className="field identified-code">
            <label className="label-text">
              C??n c?????c c??ng d??n/Ch???ng minh th??{" "}
              {citizenInfo.age > 15 && <span>{"(*)"}</span>}
            </label>
            <TextField
              placeholder={
                citizenInfo.age > 15
                  ? "V?? d???: 123456789101"
                  : "C??ng d??n ch??a ????? tu???i ????? s??? h???u CCCD/CMT"
              }
              helperText={citizenInfo.age > 15 && errBlur.identifiedCode}
              name="identifiedCode"
              sx={{ width: "100%" }}
              onChange={handleInput}
              value={citizenInfo.age > 15 ? citizenInfo.identifiedCode : ""}
              disabled={citizenInfo.age < 15 ? true : false}
              error={errBlur.identifiedCode ? true : false}
              onBlur={() => handleBlur("identifiedCode")}
              onInput={() => handleBlurInput("identifiedCode")}
            />
          </div>

          <div className="field ethnic">
            <label className="label-text">
              D??n t???c <span>{"(*)"}</span>
            </label>
            <Autocomplete
              noOptionsText={"Kh??ng c?? l???a ch???n ph?? h???p"}
              disablePortal
              options={ethnic.ethnic}
              onBlur={() => handleBlur("ethnic")}
              sx={{ width: 300 }}
              defaultValue={citizenInfo.ethnic}
              onInputChange={(e, newInput) => {
                setCitizenInfo({ ...citizenInfo, ethnic: newInput });
                setErrBlur({
                  ...errBlur,
                  ethnic: "",
                });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="V?? d???: Kinh"
                  helperText={errBlur.ethnic}
                  error={errBlur.ethnic ? true : false}
                />
              )}
            />
          </div>

          <div className="field religion">
            <label className="label-text">
              T??n gi??o <span>{"(*)"}</span>
            </label>
            <Autocomplete
              noOptionsText={"Kh??ng c?? l???a ch???n ph?? h???p"}
              disablePortal
              defaultValue={citizenInfo.religion}
              options={religionData}
              sx={{ width: 300 }}
              onBlur={() => handleBlur("religion")}
              onInputChange={(e, newInput) => {
                setCitizenInfo({ ...citizenInfo, religion: newInput });
                setErrBlur({
                  ...errBlur,
                  religion: "",
                });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="V?? d???: Kh??ng"
                  helperText={errBlur.religion}
                  error={errBlur.religion ? true : false}
                />
              )}
            />
          </div>

          <div className="field province">
            <label className="label-text">
              T???nh/Th??nh ph??? <span>{"(*)"}</span>
            </label>
            <Autocomplete
              noOptionsText={"Kh??ng c?? l???a ch???n ph?? h???p"}
              disablePortal
              defaultValue={citizenInfo.city}
              options={locationData}
              sx={{ width: 300 }}
              onBlur={() => handleBlur("city")}
              clearText="Xo??"
              onInputChange={(e, newInput) => {
                console.log(newInput);
                setCitizenInfo({
                  ...citizenInfo,
                  city: newInput,
                  district: "",
                  ward: "",
                });

                setErrBlur({
                  ...errBlur,
                  city: "",
                });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="V?? d???: Th??nh ph??? H?? N???i"
                  helperText={errBlur.city}
                  error={errBlur.city ? true : false}
                />
              )}
            />
          </div>

          <div className="field district">
            <label className="label-text">
              Qu???n/Huy???n <span>{"(*)"}</span>
            </label>
            <Autocomplete
              noOptionsText={"Kh??ng c?? l???a ch???n ph?? h???p"}
              disablePortal
              defaultValue={citizenInfo.district}
              options={availableDistricts}
              sx={{ width: 300 }}
              disabled={citizenInfo.city ? false : true}
              onInputChange={(e, newInput) => {
                console.log(newInput);
                setCitizenInfo({
                  ...citizenInfo,
                  district: newInput,
                  ward: "",
                });
                setErrBlur({
                  ...errBlur,
                  district: "",
                });
              }}
              onBlur={() => handleBlur("district")}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="V?? d???: Qu???n Ba ????nh"
                  helperText={errBlur.district}
                  error={errBlur.district ? true : false}
                />
              )}
            />
          </div>

          <div className="field ward">
            <label className="label-text">
              X??/Ph?????ng <span>{"(*)"}</span>
            </label>
            <Autocomplete
              noOptionsText={"Kh??ng c?? l???a ch???n ph?? h???p"}
              disablePortal
              defaultValue={citizenInfo.ward}
              options={avaiableWards}
              sx={{ width: 300 }}
              onInputChange={(e, newInput) => {
                setCitizenInfo({ ...citizenInfo, ward: newInput });
                setErrBlur({
                  ...errBlur,
                  ward: "",
                });
              }}
              onBlur={() => handleBlur("ward")}
              disabled={citizenInfo.district ? false : true}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="V?? d???: Ph?????ng Ph??c X??"
                  helperText={errBlur.ward}
                  error={errBlur.ward ? true : false}
                />
              )}
            />
          </div>

          <div className="field village">
            <label className="label-text">
              Th??n/X??m/Khu/???p <span>{"(*)"}</span>
            </label>

            <TextField
              error={errBlur.village ? true : false}
              value={citizenInfo.village}
              onBlur={() => handleBlur("village")}
              onInput={() => handleBlurInput("village")}
              helperText={errBlur.village}
              disabled={citizenInfo.ward ? false : true}
              placeholder="V?? d???: ???p Th???nh Vinh"
              name="village"
              sx={{ width: "100%" }}
              onChange={(e) =>
                setCitizenInfo({
                  ...citizenInfo,
                  village: e.target.value,
                })
              }
            />
          </div>

          <div className="field current-address">
            <label className="label-text">
              ?????a ch??? th?????ng tr?? <span>{"(*)"}</span>
            </label>
            <TextField
              onBlur={() => handleBlur("residentAddress")}
              onInput={() => handleBlurInput("residentAddress")}
              error={errBlur.residentAddress ? true : false}
              helperText={errBlur.residentAddress}
              value={citizenInfo.residentAddress}
              className="ta dang o dau"
              placeholder="S??? nh?? - Th??n/X??m/Khu/???p - X??/Ph?????ng - Qu???n/Huy???n - T???nh/Th??nh Ph???"
              name="residentAddress"
              sx={{ width: "100%" }}
              onChange={handleInput}
            />
          </div>

          <div className="field temp-address">
            <label className="label-text">
              ?????a ch??? t???m tr?? <span>{"(*)"}</span>
            </label>
            <TextField
              onBlur={() => handleBlur("currentAddress")}
              onInput={() => handleBlurInput("currentAddress")}
              error={errBlur.currentAddress ? true : false}
              helperText={errBlur.currentAddress}
              value={citizenInfo.currentAddress}
              className="ta dang o dau"
              placeholder="S??? nh?? - Th??n/X??m/Khu/???p - X??/Ph?????ng - Qu???n/Huy???n - T???nh/Th??nh Ph???"
              name="currentAddress"
              sx={{ width: "100%" }}
              onChange={handleInput}
            />
          </div>

          <div className="field academic-level">
            <label className="label-text">
              Tr??nh ????? h???c v???n <span>{"(*)"}</span>
            </label>
            <TextField
              onBlur={() => handleBlur("educationLevel")}
              onInput={() => handleBlurInput("educationLevel")}
              error={errBlur.educationLevel ? true : false}
              helperText={errBlur.educationLevel}
              value={citizenInfo.educationLevel}
              placeholder="V?? d???: 12/12"
              name="educationLevel"
              sx={{ width: "100%" }}
              onChange={handleInput}
            />
          </div>

          <div className="field occupation">
            <label className="label-text">
              Ngh??? nghi???p {citizenInfo.age >= 6 && <span>{"(*)"}</span>}
            </label>
            <Autocomplete
              noOptionsText={"Kh??ng c?? l???a ch???n ph?? h???p"}
              disablePortal
              defaultValue={citizenInfo.occupation}
              disabled={citizenInfo.age < 6 ? true : false}
              options={jobData}
              onBlur={() => handleBlur("occupation")}
              sx={{ width: 300 }}
              onInputChange={(e, newInput) => {
                setCitizenInfo({ ...citizenInfo, occupation: newInput });
                setErrBlur({
                  ...errBlur,
                  occupation: "",
                });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={
                    citizenInfo.age >= 6
                      ? "V?? d???: C??ng ngh??? th??ng tin"
                      : "C??ng d??n ch??a ????? tu???i ????? c?? ngh??? nghi???p"
                  }
                  helperText={citizenInfo.age >= 6 && errBlur.occupation}
                  error={errBlur.occupation ? true : false}
                />
              )}
            />
          </div>

          <div className="field phone">
            <label className="label-text">S??? ??i???n tho???i</label>
            <TextField
              placeholder="V?? d???: 0123456789"
              name="phoneNumber"
              value={citizenInfo.phoneNumber}
              sx={{ width: "100%" }}
              onChange={handleInput}
              helperText={errBlur.phoneNumber}
              error={errBlur.phoneNumber ? true : false}
            />
          </div>

          <div className="field email">
            <label className="label-text">Email</label>
            <TextField
              value={citizenInfo.email}
              placeholder="V?? d???: nguyenvana@gmail.com"
              helperText={errBlur.email}
              sx={{ width: "100%" }}
              error={errBlur.email ? true : false}
              name="email"
              onChange={handleInput}
            />
          </div>
        </Box>

        <div className="submit">
          <div>
            <button className="submit-button">
              {editable ? "C???p nh???t" : "G???i d??? li???u"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default InputCitizen;
