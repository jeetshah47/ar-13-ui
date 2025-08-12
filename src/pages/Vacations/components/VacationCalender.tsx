import React from "react";
import {
  Avatar,
  Box,
  Paper,
  styled,
  Tooltip,
  tooltipClasses,
  Typography,
  type TooltipProps,
} from "@mui/material";
import { blurAnimation } from "../../../common/animation/cssAnimation";

const tasks: {
  name: string;
  workDone: {
    date: string;
    completed: string;
    leaveType: string;
    status: "approved" | "pending";
  }[];
}[] = [
  {
    name: "Oscar Holloway",
    workDone: [
      {
        date: "1",
        completed: "20%",
        leaveType: "sick-leave",
        status: "approved",
      },
      {
        date: "5",
        completed: "35%",
        leaveType: "work-remotely",
        status: "pending",
      },
      {
        date: "12",
        completed: "55%",
        leaveType: "vacations",
        status: "approved",
      },
      {
        date: "18",
        completed: "70%",
        leaveType: "sick-leave",
        status: "approved",
      },
      {
        date: "24",
        completed: "85%",
        leaveType: "work-remotely",
        status: "pending",
      },
    ],
  },
  {
    name: "Evan Yates",
    workDone: [
      {
        date: "3",
        completed: "15%",
        leaveType: "vacations",
        status: "approved",
      },
      {
        date: "6",
        completed: "30%",
        leaveType: "sick-leave",
        status: "pending",
      },
      {
        date: "10",
        completed: "50%",
        leaveType: "work-remotely",
        status: "approved",
      },
      {
        date: "15",
        completed: "65%",
        leaveType: "vacations",
        status: "approved",
      },
      {
        date: "28",
        completed: "80%",
        leaveType: "sick-leave",
        status: "pending",
      },
    ],
  },
  {
    name: "Lola Zimmerman",
    workDone: [
      {
        date: "2",
        completed: "25%",
        leaveType: "work-remotely",
        status: "approved",
      },
      {
        date: "8",
        completed: "40%",
        leaveType: "vacations",
        status: "pending",
      },
      {
        date: "14",
        completed: "60%",
        leaveType: "sick-leave",
        status: "approved",
      },
      {
        date: "20",
        completed: "75%",
        leaveType: "work-remotely",
        status: "approved",
      },
      {
        date: "26",
        completed: "90%",
        leaveType: "vacations",
        status: "pending",
      },
    ],
  },
  {
    name: "Tyler Curry",
    workDone: [
      {
        date: "4",
        completed: "20%",
        leaveType: "vacations",
        status: "pending",
      },
      {
        date: "9",
        completed: "35%",
        leaveType: "work-remotely",
        status: "approved",
      },
      {
        date: "13",
        completed: "55%",
        leaveType: "sick-leave",
        status: "approved",
      },
      {
        date: "19",
        completed: "70%",
        leaveType: "vacations",
        status: "approved",
      },
      {
        date: "25",
        completed: "95%",
        leaveType: "work-remotely",
        status: "pending",
      },
    ],
  },
  {
    name: "Sadie Wolfe",
    workDone: [
      {
        date: "5",
        completed: "30%",
        leaveType: "sick-leave",
        status: "approved",
      },
      {
        date: "11",
        completed: "45%",
        leaveType: "vacations",
        status: "pending",
      },
      {
        date: "17",
        completed: "60%",
        leaveType: "work-remotely",
        status: "approved",
      },
      {
        date: "23",
        completed: "80%",
        leaveType: "vacations",
        status: "approved",
      },
      {
        date: "30",
        completed: "100%",
        leaveType: "sick-leave",
        status: "pending",
      },
    ],
  },
  {
    name: "Sean Gibbs",
    workDone: [
      {
        date: "6",
        completed: "10%",
        leaveType: "work-remotely",
        status: "approved",
      },
      {
        date: "12",
        completed: "25%",
        leaveType: "vacations",
        status: "pending",
      },
      {
        date: "18",
        completed: "50%",
        leaveType: "sick-leave",
        status: "approved",
      },
      {
        date: "21",
        completed: "75%",
        leaveType: "vacations",
        status: "approved",
      },
      {
        date: "29",
        completed: "90%",
        leaveType: "work-remotely",
        status: "pending",
      },
    ],
  },
  {
    name: "Corey Watts",
    workDone: [
      {
        date: "7",
        completed: "15%",
        leaveType: "vacations",
        status: "approved",
      },
      {
        date: "14",
        completed: "30%",
        leaveType: "work-remotely",
        status: "pending",
      },
      {
        date: "20",
        completed: "50%",
        leaveType: "sick-leave",
        status: "approved",
      },
      {
        date: "22",
        completed: "65%",
        leaveType: "vacations",
        status: "approved",
      },
      {
        date: "27",
        completed: "85%",
        leaveType: "work-remotely",
        status: "pending",
      },
    ],
  },
  {
    name: "Theodore Shaw",
    workDone: [
      {
        date: "8",
        completed: "20%",
        leaveType: "sick-leave",
        status: "approved",
      },
      {
        date: "16",
        completed: "40%",
        leaveType: "work-remotely",
        status: "pending",
      },
      {
        date: "19",
        completed: "55%",
        leaveType: "vacations",
        status: "approved",
      },
      {
        date: "24",
        completed: "75%",
        leaveType: "sick-leave",
        status: "approved",
      },
      {
        date: "30",
        completed: "95%",
        leaveType: "work-remotely",
        status: "pending",
      },
    ],
  },
];

// const days = Array.from({ length: 30 }, (_, i) => i + 1);

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

const getLeaveTypeCell = (
  work: {
    date: string;
    completed: string;
    leaveType: string;
    status: "approved" | "pending";
  }[],
  date: string
): { leaveType: string; status: "approved" | "pending" } => {
  const result = work.find((task) => task.date === date);
  console.log("first", result);
  if (result) {
    return {
      leaveType: result.leaveType,
      status: result.status,
    };
  }
  return {
    leaveType: "",
    status: "pending",
  };
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

const VacationssCalender: React.FC = () => {
  const getDaysInMonth = (date: Date): (Date | null)[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const lastMonth = month - 1;
    const lastMonthTotalDays = new Date(year, lastMonth + 1, 0).getDate();
    const diffFromDays = lastMonthTotalDays - startingDayOfWeek + 1;

    const nextMonth = month + 1;
    const lastDayMonth = lastDay.getDay();
    const additiondays = 6 - lastDayMonth;
    console.log("d", nextMonth, additiondays, lastDayMonth);

    const days: (Date | null)[] = [];

    // for (let i = diffFromDays; i <= lastMonthTotalDays; i++) {
    //   days.push(new Date(year, lastMonth, i));
    // }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    // for (let i = 1; i <= additiondays; i++) {
    //   days.push(new Date(year, nextMonth, i));
    // }

    return days;
  };

  const getColorIndexMapping = ({
    leaveType,
    status,
    styleType,
  }: {
    leaveType?: string;
    status: "approved" | "pending";
    styleType: "bg" | "br";
  }) => {
    console.log("datas", leaveType, status);
    const colorMap: {
      [index: string]: {
        approved: string;
        pending: string;
      };
    } = {
      "sick-leave": {
        approved: "#F65160",
        pending: "#F6516012",
      },
      "work-remotely": {
        approved: "#F65160",
        pending: "#F6516012",
      },
      vacations: {
        approved: "#15C0E6",
        pending: "#15C0E612",
      },
    };

    const borderMap: {
      [index: string]: {
        approved: string;
        pending: string;
      };
    } = {
      "sick-leave": {
        pending: "#F65160",
        approved: "#F6516012",
      },
      "work-remotely": {
        pending: "#F65160",
        approved: "#F6516012",
      },
      vacations: {
        pending: "#15C0E6",
        approved: "#15C0E612",
      },
    };
    if (leaveType) {
      if (styleType === "bg") return colorMap[leaveType][status];
      return borderMap[leaveType][status];
    } else {
      return "#F4F9FD";
    }
  };

  return (
    <Box sx={{ p: 3, ...blurAnimation }}>
      <Typography variant="h6" gutterBottom>
        Tasks
      </Typography>
      <Paper sx={{ overflowX: "auto", p: 2 }}>
        <Box></Box>
        <Box sx={{ display: "flex" }}>
          <Box sx={{ minWidth: "175px", borderRight: "1px solid #E6EBF5" }}>
            <Box height={"50px"} sx={{ borderBottom: "1px solid #E6EBF5" }} />
            {tasks.map((task) => (
              <Box
                sx={{
                  color: "#222",
                  height: "52px",
                  borderBottom: "1px solid #E6EBF5",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px"
                }}
              >
                <Avatar sx={{ width: "24px", height: "24px" }} />{" "}
                <Typography sx={{ fontSize: "14px" }}>{task.name}</Typography>
              </Box>
            ))}
          </Box>
          <Box>
            <Box height={"50px"} sx={{ borderBottom: "1px solid #E6EBF5" }}>
              <Box
                sx={{
                  display: "flex",
                  gap: "4px",
                  marginLeft: "2px",
                  height: "-webkit-fill-available",
                }}
              >
                {getDaysInMonth(new Date()).map((day, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: "32px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#888",
                      backgroundColor: "#F4F9FD",
                      flexDirection: "column",
                    }}
                  >
                    <Typography fontSize={"12px"} fontWeight={"500"}>
                      {day?.getDate()}
                    </Typography>
                    <Typography fontSize={"12px"}>
                      {day?.toDateString().split(" ")[0]}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
            {tasks.map((task) => (
              <Box
                key={task.name}
                sx={{ display: "flex", alignItems: "center", height: "52px" }}
              >
                {getDaysInMonth(new Date()).map((day, index) => (
                  <Box
                    key={index}
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
                          backgroundColor: getColorIndexMapping({
                            ...getLeaveTypeCell(
                              task.workDone,
                              String(day?.getDate())
                            ),
                            styleType: "bg",
                          }),
                          border: `1px solid ${getColorIndexMapping({
                            ...getLeaveTypeCell(
                              task.workDone,
                              String(day?.getDate())
                            ),
                            styleType: "br",
                          })}`,
                          height: getTaskCompletedPercentage(
                            task.workDone,
                            String(day?.getDate())
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
};

export default VacationssCalender;
