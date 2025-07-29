import React from "react";
import {
  Box,
  Paper,
  styled,
  Tooltip,
  tooltipClasses,
  Typography,
  type TooltipProps,
} from "@mui/material";

const tasks = [
  {
    name: "Research",
    workDone: [
      { date: "1", completed: "20%" },
      { date: "5", completed: "35%" },
      { date: "12", completed: "55%" },
      { date: "18", completed: "70%" },
      { date: "24", completed: "85%" },
    ],
  },
  {
    name: "Mind Map",
    workDone: [
      { date: "3", completed: "15%" },
      { date: "6", completed: "30%" },
      { date: "10", completed: "50%" },
      { date: "15", completed: "65%" },
      { date: "28", completed: "80%" },
    ],
  },
  {
    name: "UX Login + Registration",
    workDone: [
      { date: "2", completed: "25%" },
      { date: "8", completed: "40%" },
      { date: "14", completed: "60%" },
      { date: "20", completed: "75%" },
      { date: "26", completed: "90%" },
    ],
  },
  {
    name: "UI Login + Registration (+ other screens)",
    workDone: [
      { date: "4", completed: "20%" },
      { date: "9", completed: "35%" },
      { date: "13", completed: "55%" },
      { date: "19", completed: "70%" },
      { date: "25", completed: "95%" },
    ],
  },
  {
    name: "Research reports (presentation for client)",
    workDone: [
      { date: "5", completed: "30%" },
      { date: "11", completed: "45%" },
      { date: "17", completed: "60%" },
      { date: "23", completed: "80%" },
      { date: "30", completed: "100%" },
    ],
  },
  {
    name: "Moodboard",
    workDone: [
      { date: "6", completed: "10%" },
      { date: "12", completed: "25%" },
      { date: "18", completed: "50%" },
      { date: "21", completed: "75%" },
      { date: "29", completed: "90%" },
    ],
  },
  {
    name: "UI Kit",
    workDone: [
      { date: "7", completed: "15%" },
      { date: "14", completed: "30%" },
      { date: "20", completed: "50%" },
      { date: "22", completed: "65%" },
      { date: "27", completed: "85%" },
    ],
  },
  {
    name: "Testing",
    workDone: [
      { date: "8", completed: "20%" },
      { date: "16", completed: "40%" },
      { date: "19", completed: "55%" },
      { date: "24", completed: "75%" },
      { date: "30", completed: "95%" },
    ],
  },
];

const days = Array.from({ length: 30 }, (_, i) => i + 1);

const getTaskCompletedPercentage = (
  work: {
    date: string;
    completed: string;
  }[],
  date: string
) => {
  const result = work.find((task) => task.date === date);
  return result?.completed;
};

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "white",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 120,
    fontSize: theme.typography.pxToRem(12),
    boxShadow: "0px 6px 40px rgba(121, 145, 173, 0.3)",
    borderRadius: "14px",
  },
}));

const TaskTimelineFlex: React.FC = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h6" gutterBottom>
      Tasks
    </Typography>
    <Paper sx={{ overflowX: "auto", p: 2 }}>
      <Box></Box>
      <Box sx={{ display: "flex" }}>
        <Box sx={{ minWidth: "215px", borderRight: "1px solid #E6EBF5" }}>
          <Box height={"78px"} sx={{ borderBottom: "1px solid #E6EBF5" }} />
          {tasks.map((task) => (
            <Box
              sx={{
                color: "#222",
                height: "52px",
                borderBottom: "1px solid #E6EBF5",
              }}
            >
              <Typography sx={{ fontSize: "14px" }}>{task.name}</Typography>
            </Box>
          ))}
        </Box>
        <Box>
          <Box height={"78px"} sx={{ borderBottom: "1px solid #E6EBF5" }}>
            <Typography>First Month (September)</Typography>
            <Box sx={{ display: "flex", gap: "4px" }}>
              {days.map((day) => (
                <Box
                  key={day}
                  sx={{
                    width: "32px",
                    height: "32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#888",
                    fontWeight: 500,
                    backgroundColor: "#F4F9FD",
                  }}
                >
                  {day}
                </Box>
              ))}
            </Box>
          </Box>
          {tasks.map((task) => (
            <Box
              key={task.name}
              sx={{ display: "flex", alignItems: "center", height: "52px" }}
            >
              {days.map((day) => (
                <Box
                  key={day}
                  sx={{
                    width: 32,
                    height: "44px",
                    borderRadius: 2,
                    backgroundColor: "#F4F9FD",
                    margin: "0 2px",
                    transition: "background 0.2s",
                    position: "relative",
                  }}
                >
                  <HtmlTooltip
                    title={
                      <React.Fragment>
                        <Typography color="inherit">
                          Tooltip with HTML
                        </Typography>
                        <em>{"And here's"}</em> <b>{"some"}</b>{" "}
                        <u>{"amazing content"}</u>.{" "}
                        {"It's very engaging. Right?"}
                      </React.Fragment>
                    }
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        transition: "background 0.2s",
                        borderRadius: 2,
                        backgroundColor: "#A7CAFF",
                        height: getTaskCompletedPercentage(
                          task.workDone,
                          String(day)
                        ),
                        width: "100%",
                      }}
                    ></Box>
                  </HtmlTooltip>
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      </Box>
    </Paper>
  </Box>
);

export default TaskTimelineFlex;
