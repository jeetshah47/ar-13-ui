import {
  Avatar,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  SvgIcon,
  Typography,
} from "@mui/material";
import CrossIcon from "../../../assets/icons/general/calendar-6.svg?react";
import { DateRangePicker } from "../../../common/components/DateRangePicker/DateRangePicker";
import { useState } from "react";

type FilterProps = {
  onClose: () => void;
};

const Filter = ({ onClose }: FilterProps) => {
  const [taskGroupState, setTaskGroupState] = useState([
    {
      checked: true,
      label: "Design",
    },
    {
      checked: false,
      label: "Development",
    },
    {
      checked: false,
      label: "Testing",
    },
    {
      checked: false,
      label: "Marketing",
    },
  ]);

  const [assignesGroupState, setAssignesGroupState] = useState([
    {
      checked: true,
      label: "Oscar Holloway",
    },
    {
      checked: false,
      label: "Leonard Rodriquez",
    },
    {
      checked: false,
      label: "Gabriel Flowers",
    },
    {
      checked: false,
      label: "Violet Robbins",
    },
  ]);

  const handleChangeGrpState = (key: string) => {
    const findAndCheck = taskGroupState.findIndex(
      (value) => value.label === key
    );
    const cloneArray = [...taskGroupState];
    cloneArray[findAndCheck].checked = !cloneArray[findAndCheck].checked;
    setTaskGroupState([...cloneArray]);
  };

  const handleChangeAssignesState = (key: string) => {
    const findAndCheck = assignesGroupState.findIndex(
      (value) => value.label === key
    );
    const cloneArray = [...assignesGroupState];
    cloneArray[findAndCheck].checked = !cloneArray[findAndCheck].checked;
    setAssignesGroupState([...cloneArray]);
  };

  const handleCrossClick = () => {
    onClose();
  };

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        position: "fixed",
        zIndex: 50,
        backgroundColor: "#2155A316",
        justifyContent: "end",
        // alignItems: "center",
        display: "flex",
        top: 0,
        left: 0,
      }}
    >
      <Box
        sx={{
          width: "413px",
          backgroundColor: "#FFFFFF",
          boxShadow: " 0px 6px 58px rgba(121, 145, 173, 0.195504)",
          borderRadius: "24px",
          margin: "20px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "30px",
          }}
        >
          <Typography fontWeight={"bold"} variant="h5">
            Filters
          </Typography>
          <Box
            sx={{
              background: "#F4F9FD",
              borderRadius: "14px",
              display: "flex",
              padding: "10px",
              cursor: "pointer",
            }}
            onClick={handleCrossClick}
          >
            <SvgIcon component={CrossIcon} />
          </Box>
        </Box>
        <Box
          sx={{
            padding: "22px 30px",
            borderBottom: "1px solid #E4E6E8",
            borderTop: "1px solid #E4E6E8",
          }}
        >
          <Box>
            <Typography fontWeight={"bold"} color="secondary.main">
              Period
            </Typography>
            <Box pt={"10px"} />
            <DateRangePicker
              endDate={null}
              startDate={null}
              setEndDate={() => {}}
              setStartDate={() => {}}
            />
          </Box>
        </Box>
        <Box sx={{ padding: "22px 30px" }}>
          <Typography fontWeight={"bold"} color="secondary.main">
            Task Group
          </Typography>
          <Box sx={{ paddingTop: "5px" }}>
            {taskGroupState.map((task) => (
              <Box key={task.label}>
                <FormControlLabel
                  control={<Checkbox checked={task.checked} />}
                  label={task.label}
                  onChange={() => handleChangeGrpState(task.label)}
                />
              </Box>
            ))}
          </Box>
        </Box>
        <Box sx={{ padding: "22px 30px" }}>
          <Typography fontWeight={"bold"} color="secondary.main">
            Assignes
          </Typography>
          <Box sx={{ paddingTop: "5px" }}>
            {assignesGroupState.map((assignes) => (
              <Box
                key={assignes.label}
                sx={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <Avatar sx={{ width: "24px", height: "24px" }} />

                <FormControlLabel
                  control={<Checkbox checked={assignes.checked} />}
                  label={assignes.label}
                  onChange={() => handleChangeAssignesState(assignes.label)}
                />
              </Box>
            ))}
          </Box>
        </Box>
        <Box sx={{ padding: "22px 30px" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {/* <Typography>10 matches found</Typography> */}
            <Button variant="contained">Save Filters</Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Filter;
