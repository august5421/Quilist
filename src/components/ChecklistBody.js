import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Checkbox from "@mui/material/Checkbox";
import { setInitListInfo } from "../actions/actions";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";

const ChecklistBody = () => {
  const dispatch = useDispatch();
  const initListInfo = useSelector((state) => state.initListInfo);
  const theme = useSelector((state) => state.theme);
  const darkMode = useSelector((state) => state.darkMode);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleCheck = (index, key, value) => {
    dispatch(setInitListInfo(index, key, value));
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setOpenDialog(true);
  };

  return (
    <div>
      {initListInfo.listItems.map((object, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            flex: 1,
            minHeight: "75px",
            borderBottom: "2px solid #eaeaea",
          }}
        >
          <Checkbox
            checked={object.checked}
            onChange={() => handleCheck(index, "checked", !object.checked)}
            style={{ color: theme.primary, padding: "0px 9px 0px 0px" }}
          />
          {object.image && (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <img
                src={object.image}
                alt="Preview"
                style={{
                  width: "75px",
                  margin: "0px 15px",
                  cursor: "pointer",
                }}
                onClick={() => handleImageClick(object.image)}
              />
            </div>
          )}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: object.assignee ? 2 : 4,
            }}
          >
            <Typography
              sx={{
                color: darkMode ? theme.light : theme.primary,
                fontWeight: 700,
              }}
            >
              {object.quantity ? object.quantity + " " : null}
              {object.units ? object.units + " " : null}
              {object.value}
            </Typography>
            <Typography
              sx={{
                color: darkMode ? theme.light : "#7a7a7a",
                fontWeight: 400,
              }}
            >
              {object.note}
            </Typography>
          </div>
          {object.assignee && (
            <div style={{ display: "flex", flexDirection: "column", flex: 2 }}>
              <Typography
                sx={{
                  color: darkMode ? theme.light : theme.primary,
                  fontWeight: 400,
                }}
              >
                Assignee:
              </Typography>
              <Typography
                sx={{
                  color: darkMode ? theme.light : "#7a7a7a",
                  fontWeight: 400,
                }}
              >
                {object.assignee}
              </Typography>
            </div>
          )}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 2,
              alignContent: "flex-end",
              flexWrap: "wrap",
            }}
          >
            <Typography
              sx={{
                color: darkMode ? theme.light : "#7a7a7a",
                fontWeight: 400,
              }}
            >
              {object.dueDate && object.dueDate.replace(/"([^T]+)T.*/, "$1")}
            </Typography>
          </div>
        </div>
      ))}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogContent>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Large Preview"
              style={{ maxWidth: "100%", maxHeight: "100vh" }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChecklistBody;
