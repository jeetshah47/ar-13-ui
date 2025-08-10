import { Box, Button, Grid, SvgIcon, Typography } from "@mui/material";
import PageHeader from "../../common/components/PageHeader/PageHeader";
import PlusIcon from "../../assets/icons/general/plus.svg?react";
import Cell from "./components/Cell";
import { useState } from "react";
import LeftIcon from "../../assets/icons/general/left.svg?react";
import RightIcon from "../../assets/icons/general/calendar-14.svg?react";

const CalendarPage = () => {
  const [dateState, setDateState] = useState(new Date());

  const AddButton = (
    <Button variant="contained" startIcon={<SvgIcon component={PlusIcon} />}>
      Add Events
    </Button>
  );

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

  const handleOnClikPrev = () => {
    dateState.setMonth(dateState.getMonth() - 1);
    console.log("change date", dateState);
    const changedate = new Date(dateState);
    setDateState(changedate);
  };

  const handleOnClikNext = () => {
    dateState.setMonth(dateState.getMonth() + 1);
    const changedate = new Date(dateState);
    setDateState(changedate);
  };

  const currentMonthandYear = () =>
    `${dateState.toDateString().split(" ")[1]} ${
      dateState.toDateString().split(" ")[3]
    }`;

  const getWeekDayString = (date: Date | null) =>
    date?.toDateString().split(" ")[0] ?? "";

  return (
    <Box sx={{ height: "100%" }}>
      <PageHeader title="Calendar" endElement={AddButton} />
      <Box
        sx={{
          paddingTop: "28px",
          display: "flex",
          gap: "28px",
          height: "100%",
        }}
      >
        <Box
          sx={{
            width: "100%",
            background: "#FFFFFF",
            borderRadius: "24px",
            boxShadow: "0px 6px 58px rgba(196, 203, 214, 0.103611)",
            height: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "24px",
              paddingY: "20px",
            }}
          >
            <SvgIcon onClick={handleOnClikPrev} component={LeftIcon} />
            <Typography variant="h6" fontWeight={700}>
              {currentMonthandYear()}
            </Typography>
            <SvgIcon onClick={handleOnClikNext} component={RightIcon} />
          </Box>
          <Grid container>
            {getDaysInMonth(dateState).map((date, index) => (
              <Grid
              <Cell
                key={index}
                date={date?.getDate()}
                weekDay={index < 7 ? getWeekDayString(date) : ""}
              />
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default CalendarPage;
