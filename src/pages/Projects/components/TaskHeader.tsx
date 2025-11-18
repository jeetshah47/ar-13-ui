import { Box, IconButton, SvgIcon, Typography, Button, useMediaQuery, useTheme } from "@mui/material";
import { ViewButtonOptions } from "../constants/project.contants";
import PlusIcon from "../../../assets/icons/general/plus.svg?react";
import FilterIcon from "../../../assets/icons/general/calendar-1.svg?react";
import { usePermissions } from "../../../store/hooks/usePermissions";

type TaskHeaderProps = {
  onClickAddButton: () => void;
  onClickAddDrawing?: () => void;
  onChangeViewOptions: (view: string) => void;
  onClickFilterShow: () => void;
  currentViewOption: string;
};

const TaskHeader = ({
  onClickAddButton,
  onClickAddDrawing,
  onChangeViewOptions,
  onClickFilterShow,
  currentViewOption,
}: TaskHeaderProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { checkPermission } = usePermissions();
  
  const hasTaskWritePermission = checkPermission("tasks:write");

  // Filter out tile and timeline views on mobile
  const availableViewOptions = isMobile 
    ? ViewButtonOptions.filter(option => option.key === "list")
    : ViewButtonOptions;

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Box sx={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap" }}>
          <Typography sx={{ fontWeight: "bold", fontSize: { xs: "18px", sm: "22px" } }}>Tasks</Typography>
          <IconButton
            size="small"
            onClick={onClickAddButton}
            disabled={!hasTaskWritePermission}
            sx={{
              backgroundColor: "#3F8CFF",
              ":hover": { backgroundColor: "#3F8CFF" },
              "&.Mui-disabled": {
                backgroundColor: "rgba(63, 140, 255, 0.3)",
                color: "rgba(0, 0, 0, 0.26)",
              },
            }}
          >
            <PlusIcon />
          </IconButton>
          {onClickAddDrawing && !isMobile && (
            <Button
              variant="outlined"
              size="small"
              onClick={onClickAddDrawing}
              disabled={!hasTaskWritePermission}
              sx={{
                ml: 1,
                textTransform: "none",
                fontSize: "12px",
              }}
            >
              Add Drawing
            </Button>
          )}
        </Box>
        <Box sx={{ display: "flex", gap: { xs: "8px", sm: "16px" }, alignItems: "center" }}>
          {availableViewOptions.map((option) => (
            <Box
              key={option.key}
              onClick={() => onChangeViewOptions(option.key)}
              sx={{
                backgroundColor: "background.paper",
                borderRadius: "14px",
                padding: { xs: "8px", sm: "12px" },
                display: "flex",
                cursor: "pointer",
              }}
            >
              <SvgIcon
                component={option.icon}
                sx={(theme) => ({
                  color:
                    currentViewOption === option.key 
                      ? theme.palette.primary.main 
                      : theme.palette.text.primary,
                  fontSize: { xs: "20px", sm: "24px" },
                })}
              />
            </Box>
          ))}
          <Box
            onClick={onClickFilterShow}
            sx={(theme) => ({
              background: theme.palette.background.paper,
              boxShadow: theme.shadows[1],
              borderRadius: "14px",
              padding: { xs: "8px", sm: "12px" },
              display: "flex",
              cursor: "pointer",
            })}
          >
            <SvgIcon component={FilterIcon} sx={{ fontSize: { xs: "20px", sm: "24px" } }} />
          </Box>
        </Box>
      </Box>
      
    </>
  );
};

export default TaskHeader;
