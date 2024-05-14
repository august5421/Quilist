import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  Input,
  Paper,
  Box,
} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { useDispatch, useSelector } from "react-redux";
import {
  setInitListInfo,
  setInitListNumber,
  setListSaveError,
  setDatePickerDate,
  setUserFriends,
} from "../actions/actions";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { styled } from "@mui/material/styles";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ListSubheader from "@mui/material/ListSubheader";
import { BorderClear, BorderColor } from "@mui/icons-material";

const AutoIncrementor = (props) => {
  const dispatch = useDispatch();
  const initListInfo = useSelector((state) => state.initListInfo);
  const theme = useSelector((state) => state.theme);
  const darkMode = useSelector((state) => state.darkMode);
  const listSaveError = useSelector((state) => state.listSaveError);
  const datePickerDate = useSelector((state) => state.datePickerDate);
  const userFriends = useSelector((state) => state.userFriends);

  const handleImageChange = (index, key) => (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        dispatch(setInitListInfo(index, key, reader.result));
      }
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleListItemChange = (index, key, newValue) => {
    if (key == "dueDate") {
      dispatch(setDatePickerDate(index, key, newValue));
      const str = JSON.stringify(newValue, (key, value) =>
        typeof value === "undefined" ? null : value
      );
      dispatch(setInitListInfo(index, key, str));
    } else {
      dispatch(setListSaveError(null));
      dispatch(setInitListInfo(index, key, newValue));
    }
  };

  const handleAddTextField = () => {
    const newListItems = [
      ...initListInfo.listItems,
      { id: initListInfo.listItems.length, value: "" },
    ];
    dispatch(setInitListNumber(newListItems));
  };

  const handleRemoveTextField = (indexToRemove) => {
    const newListItems = initListInfo.listItems.filter(
      (item, index) => index !== indexToRemove
    );
    dispatch(setInitListNumber(newListItems));
  };

  // useEffect(() => {
  //   console.log(initListInfo)
  // }, [initListInfo])

  return (
    <div>
      {initListInfo.listItems.map((object, index) => (
        <div key={`all-${index}`}>
          <div
            key={`top-${index}`}
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-between",
              marginBottom:
                index !== initListInfo.listItems.length - 1 ? "10px" : "0",
              marginTop: index !== 0 && "15px",
            }}
          >
            {initListInfo.listQuantity && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  flex:
                    index !== initListInfo.listItems.length - 1
                      ? 1
                      : props.mobile
                      ? 1.5
                      : 1,
                  margin: "0px 10px 0px 0px",
                }}
              >
                <TextField
                  focused={darkMode && true}
                  id={darkMode ? "filled-basic" : "outlined-basic"}
                  color="secondary"
                  label="#"
                  size="small"
                  InputProps={{
                    inputProps: { inputMode: "numeric", pattern: "[0-9]*" },
                  }}
                  value={object.quantity}
                  onChange={(e) =>
                    handleListItemChange(index, "quantity", e.target.value)
                  }
                  sx={{
                    marginTop: index == 0 ? "16px" : null,
                  }}
                />
              </div>
            )}
            {initListInfo.listUnits && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  flex:
                    index !== initListInfo.listItems.length - 1
                      ? 2
                      : props.mobile
                      ? 2.5
                      : 2,
                  margin: "0px 10px 0px 0px",
                }}
              >
                <FormControl
                  size="small"
                  sx={{
                    marginTop: index == 0 ? "16px" : null,
                  }}
                >
                  <InputLabel id="unitId">Unit</InputLabel>
                  <Select
                    labelId="unitId"
                    id="unitId"
                    label="Age"
                    value={object.units}
                    onChange={(e) =>
                      handleListItemChange(index, "units", e.target.value)
                    }
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <ListSubheader>Weight</ListSubheader>
                    <MenuItem value={object.quantity > 1 ? "Ounces" : "Ounce"}>
                      {object.quantity > 1 ? "Ounces" : "Ounce"}
                    </MenuItem>
                    <MenuItem value={object.quantity > 1 ? "Pounds" : "Pound"}>
                      {object.quantity > 1 ? "Pounds" : "Pound"}
                    </MenuItem>
                    <ListSubheader>Volume</ListSubheader>
                    <MenuItem value={"Fl Oz"}>Fl Oz</MenuItem>
                    <MenuItem
                      value={object.quantity > 1 ? "Teaspoons" : "Teaspoon"}
                    >
                      {object.quantity > 1 ? "Teaspoons" : "Teaspoon"}
                    </MenuItem>
                    <MenuItem
                      value={object.quantity > 1 ? "Tablespoons" : "Tablespoon"}
                    >
                      {object.quantity > 1 ? "Tablespoons" : "Tablespoon"}
                    </MenuItem>
                    <MenuItem value={object.quantity > 1 ? "Pints" : "Pint"}>
                      {object.quantity > 1 ? "Pints" : "Pint"}
                    </MenuItem>
                    <MenuItem value={object.quantity > 1 ? "Quarts" : "Quart"}>
                      {object.quantity > 1 ? "Quarts" : "Quart"}
                    </MenuItem>
                    <MenuItem
                      value={object.quantity > 1 ? "Gallons" : "Gallon"}
                    >
                      {object.quantity > 1 ? "Gallons" : "Gallon"}
                    </MenuItem>
                    <ListSubheader>Distance</ListSubheader>
                    <MenuItem value={object.quantity > 1 ? "Inchs" : "Inch"}>
                      {object.quantity > 1 ? "Inchs" : "Inch"}
                    </MenuItem>
                    <MenuItem value={object.quantity > 1 ? "Feets" : "Feet"}>
                      {object.quantity > 1 ? "Feets" : "Feet"}
                    </MenuItem>
                    <MenuItem value={object.quantity > 1 ? "Yards" : "Yard"}>
                      {object.quantity > 1 ? "Yards" : "Yard"}
                    </MenuItem>
                    <ListSubheader>In a store</ListSubheader>
                    <MenuItem value={object.quantity > 1 ? "Bags" : "Bag"}>
                      {object.quantity > 1 ? "Bags" : "Bag"}
                    </MenuItem>
                    <MenuItem value={object.quantity > 1 ? "Cans" : "Can"}>
                      {object.quantity > 1 ? "Cans" : "Can"}
                    </MenuItem>
                    <MenuItem value={object.quantity > 1 ? "Jars" : "Jar"}>
                      {object.quantity > 1 ? "Jars" : "Jar"}
                    </MenuItem>
                    <MenuItem value={object.quantity > 1 ? "Loaves" : "Loaf"}>
                      {object.quantity > 1 ? "Loaves" : "Loaf"}
                    </MenuItem>
                    <MenuItem
                      value={object.quantity > 1 ? "Bottles" : "Bottle"}
                    >
                      {object.quantity > 1 ? "Bottles" : "Bottle"}
                    </MenuItem>
                    <MenuItem
                      value={object.quantity > 1 ? "Cartons" : "Carton"}
                    >
                      {object.quantity > 1 ? "Cartons" : "Carton"}
                    </MenuItem>
                    <MenuItem value={object.quantity > 1 ? "Boxes" : "Box"}>
                      {object.quantity > 1 ? "Boxes" : "Box"}
                    </MenuItem>
                    <MenuItem
                      value={object.quantity > 1 ? "Bundles" : "Bundle"}
                    >
                      {object.quantity > 1 ? "Bundles" : "Bundle"}
                    </MenuItem>
                    <MenuItem value={object.quantity > 1 ? "Bars" : "Bar"}>
                      {object.quantity > 1 ? "Bars" : "Bar"}
                    </MenuItem>
                  </Select>
                </FormControl>
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", flex: 5 }}>
              <TextField
                focused={darkMode && true}
                id={darkMode ? "filled-basic" : "outlined-basic"}
                color="secondary"
                label={`Item #` + (index + 1)}
                size="small"
                value={object.value}
                onChange={(e) =>
                  handleListItemChange(index, "value", e.target.value)
                }
                error={
                  listSaveError == "All items in the list must have a value"
                }
                sx={{
                  width: "100%",
                  marginTop: index == 0 ? "16px" : null,
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                margin: index === 0 ? "15px 0px 0px 0px" : "0px",
              }}
            >
              {index === initListInfo.listItems.length - 1 ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    height: "40px",
                  }}
                >
                  <Button
                    id="incroButton"
                    onClick={() => handleRemoveTextField(index)}
                    variant="contained"
                    color="secondary"
                    style={{
                      padding: props.mobile ? "5px" : null,
                      height: "100%",
                      margin: "0px 0px 0px 10px",
                      maxHeight: index == 0 ? "40px" : null,
                      display: index == 0 && "none",
                    }}
                  >
                    -
                  </Button>
                  <Button
                    id="incroButton"
                    onClick={handleAddTextField}
                    variant="contained"
                    color="primary"
                    style={{
                      padding: props.mobile ? "5px" : null,
                      height: "100%",
                      margin: "0px 0px 0px 10px",
                      maxHeight: index == 0 ? "40px" : null,
                      width: index == 0 ? "100%" : null
                    }}
                  >
                    +
                  </Button>
                </div>
              ) : (
                <Button
                  id="incroButton"
                  onClick={() => handleRemoveTextField(index)}
                  variant="contained"
                  color="secondary"
                  style={{
                    height: "100%",
                    margin: "0px 0px 0px 10px",
                    maxHeight: index == 0 ? "40px" : null,
                  }}
                >
                  -
                </Button>
              )}
            </div>
          </div>
          {initListInfo.listImage ||
          initListInfo.listDueDate ||
          initListInfo.listAssignee ||
          initListInfo.listNote ? (
            <div
              key={`bottom-${index}`}
              style={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-between",
                marginTop: "10px",
                borderBottom:
                  index !== initListInfo.listItems.length - 1 &&
                  "2px solid #EAEAEA",
                paddingBottom: "15px",
              }}
            >
              {initListInfo.listImage && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    flex:
                      index !== initListInfo.listItems.length - 1
                        ? 3.1
                        : props.mobile
                        ? 2.5
                        : 2.1,
                    margin: "0px 10px 0px 0px",
                  }}
                >
                  <input
                    accept="image/*"
                    style={{ display: "none" }}
                    id={`image-upload-${index}`}
                    type="file"
                    onChange={handleImageChange(index, "image")}
                  />
                  <label htmlFor={`image-upload-${index}`}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: "90px",
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        cursor: "pointer",
                        position: "relative",
                      }}
                    >
                      {object.image ? (
                        <img
                          src={object.image}
                          alt="Preview"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "6px",
                          }}
                        />
                      ) : (
                        <InputAdornment position="start">
                          <CameraAltIcon
                            style={{
                              fontSize: "48px",
                              color: "#ccc",
                            }}
                          />
                        </InputAdornment>
                      )}
                    </div>
                  </label>
                </div>
              )}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  flex: index !== initListInfo.listItems.length - 1 ? 5.9 : 5,
                }}
              >
                <div style={{ display: "flex", flexDirection: "row" }}>
                  {initListInfo.listDueDate && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        flex: 1,
                      }}
                    >
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={["DatePicker"]}>
                          <DatePicker
                            className="datePickerHijack"
                            value={datePickerDate[index]}
                            onChange={(newValue) =>
                              handleListItemChange(index, "dueDate", newValue)
                            }
                          />
                        </DemoContainer>
                      </LocalizationProvider>
                    </div>
                  )}
                  {initListInfo.listAssignee && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        flex: 1,
                      }}
                    >
                      <FormControl
                        size="small"
                        sx={{
                          width: "100%",
                        }}
                      >
                        <InputLabel id="assignee">Assignee</InputLabel>
                        <Select
                          labelId="unitId"
                          id="assignee"
                          label="Age"
                          value={object.assignee}
                          onChange={(e) =>
                            handleListItemChange(
                              index,
                              "assignee",
                              e.target.value
                            )
                          }
                          sx={{
                            margin: initListInfo.listDueDate
                              ? "0px 0px 0px 10px"
                              : "0px",
                          }}
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          <MenuItem
                            key={initListInfo.listCreator.id}
                            value={initListInfo.listCreator.listFriendName}
                          >
                            {initListInfo.listCreator.listFriendName}
                          </MenuItem>
                          {initListInfo.listUsers.map((person, index) => (
                            <MenuItem
                              key={person.id}
                              value={person.listFriendName}
                            >
                              {person.listFriendName}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                  )}
                </div>
                {initListInfo.listNote && (
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <TextField
                      focused={darkMode && true}
                      id={darkMode ? "filled-basic" : "outlined-basic"}
                      color="secondary"
                      label="Note"
                      size="small"
                      value={object.note}
                      onChange={(e) =>
                        handleListItemChange(index, "note", e.target.value)
                      }
                      sx={{
                        width: "100%",
                        marginTop: "10px",
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
};

export default AutoIncrementor;
