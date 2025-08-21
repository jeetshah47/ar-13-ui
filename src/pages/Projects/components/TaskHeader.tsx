import { Box, IconButton, SvgIcon, Typography } from "@mui/material";
import { ViewButtonOptions } from "../constants/project.contants";
import PlusIcon from "../../../assets/icons/general/plus.svg?react";
import FilterIcon from "../../../assets/icons/general/calendar-1.svg?react";

type TaskHeaderProps = {
  onClickAddButton: () => void;
  onChangeViewOptions: (view: string) => void;
  onClickFilterShow: () => void;
  currentViewOption: string;
};

const TaskHeader = ({
  onClickAddButton,
  onChangeViewOptions,
  onClickFilterShow,
  currentViewOption,
}: TaskHeaderProps) => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", gap: "6px", alignItems: "center" }}>
          <Typography sx={{ fontWeight: "bold" }}>Tasks</Typography>
          <IconButton
            size="small"
            onClick={onClickAddButton}
            sx={{
              backgroundColor: "#3F8CFF",
              ":hover": { backgroundColor: "#3F8CFF" },
            }}
          >
            <PlusIcon />
          </IconButton>
        </Box>
        <Box sx={{ display: "flex", gap: "16px" }}>
          {ViewButtonOptions.map((option) => (
            <Box
              key={option.key}
              onClick={() => onChangeViewOptions(option.key)}
              sx={{
                backgroundColor: "white",
                borderRadius: "14px",
                padding: "12px",
                display: "flex",
                cursor: "pointer",
              }}
            >
              <SvgIcon
                component={option.icon}
                sx={{
                  color:
                    currentViewOption === option.key ? "primary.main" : "black",
                }}
              />
            </Box>
          ))}
        </Box>
        <Box
          onClick={onClickFilterShow}
          sx={{
            background: "#FFFFFF",
            boxShadow: "0px 6px 58px rgba(196, 203, 214, 0.103611)",
            borderRadius: "14px",
            padding: "12px",
            display: "flex",
            cursor: "pointer",
          }}
        >
          <SvgIcon component={FilterIcon} />
        </Box>
      </Box>
      
    </>
  );
};

export default TaskHeader;
