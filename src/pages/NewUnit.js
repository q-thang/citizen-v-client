import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import {
  Button,
  DialogContent,
  Dialog,
  DialogTitle,
  DialogActions,
  Autocomplete,
  TextField,
  Switch,
  Stack,
} from "@mui/material";

import {
  getChildUnit,
  createUnit,
  updateUnit,
  deleteUnit,
} from "../redux/actions/unitAction";
import {
  createUser,
  getChildUser,
  updateUserById,
  getOptions,
} from "../redux/actions/userAction";

import alertDelete from "../assets/alert-delete.jpg";

export default function NewUnit() {
  const initState = {
    loading: false,

    // Dropdown options
    select: [],
    cSelect: [],

    // Modal
    isModalOpen: false,
    isEditModalOpen: false,
    isAccountModalOpen: false,
    isEditAccountModalOpen: false,

    // New Unit
    newUnit: null,
    newUnitCode: null,

    // Edit Unit
    editUnit: null,
    editUnitCode: null,
    editUnitId: null,

    //  New Account
    newUsername: null,
    newPassword: null,

    //  Edit Account
    editUser: null,
    editUsername: null,
    editPassword: null,
    editStartTime: null,
    editEndTime: null,
    editActive: null,

    // Delete Unit
    deleteId: 0,
    isDeleteMsgOpen: false,
  };
  const [state, setState] = useState(initState);

  const dispatch = useDispatch();
  const socket = useSelector((state) => state.socket);

  useEffect(async () => {
    setState({ ...state, loading: true });
    await dispatch(getChildUnit());
    await dispatch(getChildUser());
    setState({ ...state, loading: false });
    let options = (await getOptions()) || [];
    let cOptions = options.map((x) => ({ label: x }));
    setState({ ...state, select: options, cSelect: cOptions });
  }, []);

  const regency = useSelector((state) => state.auth.user.regency);

  let cRows = useSelector((state) => {
    console.log("all unit: ", state.unit.allUnit);
    return state.unit.allUnit.map((u, idx) => ({
      id: idx + 1,
      _id: u._id,
      name: u.nameOfUnit,
      code: u.code,
      status: u.status === true ? "???? ho??n th??nh" : "Ch??a ho??n th??nh",
    }));
  });
  let cChildUser = useSelector((state) => state.user.allUser);

  //  Compute select
  const computedSelect = async (temp) => {
    let cTemp = await Promise.all(temp.map((x) => ({ label: x })));
    setState({ ...state, select: temp });
    setState({ ...state, cSelect: cTemp });
  };

  //  New Unit handler
  const handleOpen = () => setState({ ...state, isModalOpen: true });
  const handleClose = () => setState({ ...state, isModalOpen: false });
  const handleUnit = (e, v) => {
    setState({ ...state, newUnit: (v || {}).label });
  };
  const handleKeydownUnit = (e) => {
    if (e.keyCode === 13) {
      let temp = state.select;
      if (!temp.includes(e.target.value)) {
        temp.push(e.target.value);
      }
      computedSelect(temp);
      setState({ ...state, newUnit: e.target.value });
    }
  };
  const handleCode = (e) => {
    setState({ ...state, newUnitCode: e.target.value });
  };
  const handleSubmit = () => {
    dispatch(
      createUnit({ nameOfUnit: state.newUnit, code: state.newUnitCode })
    );
    handleClose();
  };

  //  New Account handler
  const handleAccountOpen = (row) =>
    setState({ ...state, isAccountModalOpen: true, newUsername: row.code });
  const handleAccountClose = () =>
    setState({ ...state, isAccountModalOpen: false });
  const handleUsername = (e) =>
    setState({ ...state, newUsername: e.target.value });
  const handlePassword = (e) =>
    setState({ ...state, newPassword: e.target.value });
  const handleAccountSubmit = () => {
    dispatch(
      createUser({ username: state.newUsername, password: state.newPassword })
    );
    handleAccountClose();
  };

  //  Edit Unit handler
  const handleEditOpen = (params) => {
    setState({
      ...state,
      isEditModalOpen: true,
      editUnit: params.name,
      editUnitCode: params.code,
      editUnitId: params._id,
    });
  };
  const handleEditClose = () => setState({ ...state, isEditModalOpen: false });
  const handleEditCode = (e) => {
    setState({ ...state, editUnitCode: e.target.value });
  };
  const handleEditSubmit = () => {
    dispatch(
      updateUnit({
        _id: state.editUnitId,
        nameOfUnit: state.editUnit,
        code: state.editUnitCode,
      })
    );
    handleEditClose();
  };

  //  Edit Account handler
  const handleEditAccountOpen = (row) => {
    let user = cChildUser.filter((u) => u.username === row.code)[0];
    console.log(user.startTime);
    console.log(user.endTime);
    user.startTime = new Date(parseInt(user.startTime) || new Date().getTime())
      .toISOString()
      .split(".")[0];
    user.endTime = new Date(parseInt(user.endTime) || new Date().getTime())
      .toISOString()
      .split(".")[0];
    // user.startTime = '2021-12-26T04:17:00'
    // user.endTime = '2021-12-26T04:17:00'
    setState({
      ...state,
      isEditAccountModalOpen: true,
      editUser: user,
      editUsername: user.username,
      editActive: user.active,
      editStartTime: user.startTime,
      editEndTime: user.endTime,
    });
  };
  const handleEditAccountClose = () =>
    setState({ ...state, isEditAccountModalOpen: false });
  const handleEditUsername = (e) =>
    setState({ ...state, editUsername: e.target.value });
  const handleEditPassword = (e) =>
    setState({ ...state, editPassword: e.target.value });
  const handleEditActive = () =>
    setState({ ...state, editActive: !state.editActive });
  const handleEditStartTime = (e) =>
    setState({ ...state, editStartTime: e.target.value });
  const handleEditEndtTime = (e) => {
    console.log(e.target.value);
    setState({ ...state, editEndTime: e.target.value });
  };
  const handleEditAccountSubmit = () => {
    dispatch(
      updateUserById(socket, {
        _id: state.editUser._id,
        newPassword: state.editPassword,
        active: state.editActive,
        startTime: state.editStartTime,
        endTime: state.editEndTime,
      })
    );
    handleEditAccountClose();
  };

  //  Delete Unit handler
  const handleDeleteMsgOpen = ({ _id }) =>
    setState({ ...state, isDeleteMsgOpen: true, deleteId: _id });

  const handleDeleteMsgClose = () =>
    setState({ ...state, isDeleteMsgOpen: false });

  const handleDelete = () => {
    dispatch(
      deleteUnit({
        _id: state.deleteId,
      })
    );
    setState({ ...state, isDeleteMsgOpen: false });
  };

  const columns = [
    { field: "id", headerName: "STT", flex: 80, minWidth: 62 },
    { field: "name", headerName: "T??n ????n v???", flex: 300, minWidth: 231 },
    { field: "code", headerName: "M?? ????n v???", flex: 100, minWidth: 100 },
    {
      field: "account",
      headerName: "T??i kho???n ????n v???",
      flex: 200,
      minWidth: 154,
      sortable: false,
      renderCell: (params) => {
        let user = cChildUser.filter((u) => u.username === params.row.code)[0];
        return (
          <>
            {user && (
              <Button onClick={() => handleEditAccountOpen(params.row)}>
                Ch???nh s???a
              </Button>
            )}
            {!user && (
              <Button onClick={() => handleAccountOpen(params.row)}>
                T???o m???i
              </Button>
            )}
          </>
        );
      },
    },
    {
      field: "action",
      headerName: "Qu???n l?? m?? ????n v???",
      flex: 250,
      minWidth: 192,
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Button
              style={{ marginRight: "30px" }}
              onClick={() => handleEditOpen(params.row)}
            >
              Ch???nh s???a
            </Button>
            <Button
              style={{ color: "red" }}
              onClick={() => handleDeleteMsgOpen(params.row)}
            >
              X??a
            </Button>
          </>
        );
      },
    },
  ];

  const A3_columns = [
    { field: "id", headerName: "STT", flex: 80, minWidth: 62 },
    { field: "name", headerName: "T??n ????n v???", flex: 300, minWidth: 231 },
    { field: "code", headerName: "M?? ????n v???", flex: 100, minWidth: 100 },
    {
      field: "status",
      headerName: "Tr???ng th??i khai b??o",
      flex: 100,
      minWidth: 150,
    },
    {
      field: "account",
      headerName: "T??i kho???n ????n v???",
      flex: 200,
      minWidth: 154,
      sortable: false,
      renderCell: (params) => {
        let user = cChildUser.filter((u) => u.username === params.row.code)[0];
        return (
          <>
            {user && (
              <Button onClick={() => handleEditAccountOpen(params.row)}>
                Ch???nh s???a
              </Button>
            )}
            {!user && (
              <Button onClick={() => handleAccountOpen(params.row)}>
                T???o m???i
              </Button>
            )}
          </>
        );
      },
    },
    {
      field: "action",
      headerName: "Qu???n l?? m?? ????n v???",
      flex: 250,
      minWidth: 192,
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Button
              style={{ marginRight: "30px" }}
              onClick={() => handleEditOpen(params.row)}
            >
              Ch???nh s???a
            </Button>
            <Button
              style={{ color: "red" }}
              onClick={() => handleDeleteMsgOpen(params.row)}
            >
              X??a
            </Button>
          </>
        );
      },
    },
  ];

  function NoRowsOverlay() {
    return (
      <Stack marginTop="200px" alignItems="center" justifyContent="center">
        Ch??a c?? ????n v??? n??o ???????c khai b??o
      </Stack>
    );
  }

  return (
    <>
      <div className="newUnit-body">
        <div className="header">
          <div className="header-title">
            <div>Danh s??ch c??c ????n v???</div>
          </div>

          <div className="button-new-unit">
            <Button style={{ border: "1px solid" }} onClick={handleOpen}>
              Khai b??o v?? c???p m??
            </Button>
          </div>
        </div>

        <Dialog // New Unit dialog
          open={state.isModalOpen}
          onClose={handleClose}
        >
          <DialogTitle>Khai b??o v?? c???p m??</DialogTitle>
          <DialogContent
            style={{ width: "100%", height: 300, display: "flex" }}
          >
            <Autocomplete
              disablePortal
              onChange={handleUnit}
              onKeyDown={handleKeydownUnit}
              options={state.cSelect}
              sx={{ width: 300, marginTop: "10px" }}
              renderInput={(params) => (
                <TextField {...params} label="T??n ????n v???" />
              )}
            />
            <TextField
              label="M?? ????n v???"
              variant="outlined"
              style={{ marginLeft: "10px", marginTop: "10px" }}
              onChange={handleCode}
            ></TextField>
          </DialogContent>
          <DialogActions>
            <Button className="create" onClick={handleSubmit}>
              C???p m??
            </Button>
            <Button className="close" onClick={handleClose}>
              ????ng
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog // Edit Unit dialog
          open={state.isEditModalOpen}
          onClose={handleEditClose}
          className="dialog-edit-code"
        >
          <DialogTitle>Ch???nh s???a m?? ????n v???</DialogTitle>
          <DialogContent
            style={{ width: "100%", height: 250, display: "flex" }}
          >
            <TextField
              label="T??n ????n v???"
              variant="outlined"
              style={{ marginTop: "10px" }}
              value={state.editUnit}
              disabled
            ></TextField>
            <TextField
              label="M?? ????n v???"
              variant="outlined"
              style={{ marginLeft: "10px", marginTop: "10px" }}
              value={state.editUnitCode}
              onChange={handleEditCode}
            ></TextField>
          </DialogContent>
          <DialogActions className="button-action">
            <Button className="update" onClick={handleEditSubmit}>
              C???p nh???t
            </Button>
            <Button className="close" onClick={handleEditClose}>
              ????ng
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog // New Account dialog
          open={state.isAccountModalOpen}
          onClose={handleAccountClose}
        >
          <DialogTitle>C???p t??i kho???n cho ????n v???</DialogTitle>
          <DialogContent
            style={{ width: "100%", height: 300, display: "flex" }}
          >
            <TextField
              label="M?? ????n v???"
              variant="outlined"
              style={{ marginLeft: "10px", marginTop: "10px" }}
              value={state.newUsername}
              onChange={handleUsername}
              disabled
            ></TextField>
            <TextField
              label="M???t kh???u"
              variant="outlined"
              style={{ marginLeft: "10px", marginTop: "10px" }}
              onChange={handlePassword}
            ></TextField>
          </DialogContent>
          <DialogActions>
            <Button className="create" onClick={handleAccountSubmit}>
              T???o
            </Button>
            <Button className="close" onClick={handleAccountClose}>
              ????ng
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog // Edit Account dialog
          open={state.isEditAccountModalOpen}
          onClose={handleEditAccountClose}
        >
          <DialogTitle>Ch???nh s???a t??i kho???n</DialogTitle>
          <DialogContent style={{ width: "100%", minHeight: 300 }}>
            <div style={{ display: "flex", width: "100%" }}>
              <TextField
                label="M?? ????n v???"
                variant="outlined"
                style={{ marginLeft: "10px", marginTop: "10px" }}
                value={state.editUsername}
                onChange={handleEditUsername}
                disabled
              ></TextField>
              <TextField
                label="M???t kh???u"
                variant="outlined"
                style={{ marginLeft: "10px", marginTop: "10px" }}
                onChange={handleEditPassword}
              ></TextField>
            </div>
            <br />
            <br />
            <div style={{ display: "flex", alignItems: "center" }}>
              <h4>Quy???n khai b??o</h4>
              <Switch
                checked={state.editActive || false}
                onChange={handleEditActive}
                inputProps={{ "aria-label": "controlled" }}
              ></Switch>
            </div>
            <br />
            <br />
            <div>
              <h3>Th???i gian khai b??o</h3>
              <TextField
                label="Th???i gian b???t ?????u"
                variant="standard"
                defaultValue={state.editStartTime}
                InputLabelProps={{ shrink: true, style: {} }}
                style={{ marginLeft: "10px", marginTop: "10px" }}
                type="datetime-local"
                onChange={handleEditStartTime}
              ></TextField>
              <br />
              <br />
              <TextField
                label="Th???i gian k???t th??c"
                variant="standard"
                defaultValue={state.editEndTime}
                InputLabelProps={{ shrink: true, style: {} }}
                style={{ marginLeft: "10px", marginTop: "10px" }}
                type="datetime-local"
                onChange={handleEditEndtTime}
              ></TextField>
            </div>
          </DialogContent>
          <DialogActions>
            <Button className="update" onClick={handleEditAccountSubmit}>
              C???p nh???t
            </Button>
            <Button className="close" onClick={handleEditAccountClose}>
              ????ng
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog // Message before delete something...
          open={state.isDeleteMsgOpen}
          onClose={handleDeleteMsgClose}
          className="dialog-delete"
        >
          <DialogContent>
            <div className="content-container">
              <div className="img-alert">
                <div>
                  <img src={alertDelete} alt="delete" />
                </div>
              </div>
              <div className="msg-alert">
                <div>B???n c?? ch???c ch???n mu???n x??a ????n v??? n??y kh??ng?</div>
              </div>
            </div>
          </DialogContent>

          <DialogActions className="button-action">
            <Button className="delete" onClick={handleDelete}>
              Ti???p t???c x??a
            </Button>

            <Button className="close" onClick={handleDeleteMsgClose}>
              H???y
            </Button>
          </DialogActions>
        </Dialog>

        <DataGrid
          autoHeight
          rows={cRows}
          columns={regency === "A3" ? A3_columns : columns}
          pageSize={7}
          components={{ NoRowsOverlay }}
          rowsPerPageOptions={[5]}
          checkboxSelection={false}
          loading={state.loading}
          disableSelectionOnClick={true}
        />
      </div>
    </>
  );
}
