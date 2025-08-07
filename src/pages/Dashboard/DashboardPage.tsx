import { Box, Typography } from "@mui/material";
import PageHeader from "../../common/components/PageHeader/PageHeader";
import RangeSelector from "../Landing/components/RangeSelector";
import CustomCard from "../../common/components/Card/CustomCard";
import CardHeader from "../../common/components/Card/CardHeader";
import EmployeeCard from "./components/EmployeeCard";
import EventCard from "./components/EventCard";
import ProjectCard from "./components/ProjectCard";
import ActivityCard from "./components/ActivityCard";
import { useState } from "react";

const DashboardPage = () => {
  const [calenderState, setCalendarState] = useState<{
    start_date: Date | null;
    end_date: Date | null;
  }>({
    start_date: new Date(),
    end_date: new Date(),
  });

  const handleStartDateChange = (date: Date | null) => {
    setCalendarState({ ...calenderState, start_date: date });
  };
  const handleEndDateChange = (date: Date | null) => {
    setCalendarState({ ...calenderState, end_date: date });
  };

  return (
    <Box>
      <Typography color="secondary">Welcome back, Jeet</Typography>
      <PageHeader
        title="Dashboard"
        endElement={
          <RangeSelector
            startDate={calenderState.start_date}
            endDate={calenderState.end_date}
            setEndDate={handleEndDateChange}
            setStartDate={handleStartDateChange}
          />
        }
      />
      <Box sx={{ padding: "28px 0px", display: "flex", gap: "30px" }}>
        <Box sx={{ width: "70%" }}>
          <CustomCard>
            <CardHeader title="Workload" link="/#" />
            <Box sx={{ display: "flex", gap: "16px", paddingTop: "16px" }}>
              <EmployeeCard />
              <EmployeeCard />
              <EmployeeCard />
              <EmployeeCard />
            </Box>
            <Box sx={{ display: "flex", gap: "16px", paddingTop: "16px" }}>
              <EmployeeCard />
              <EmployeeCard />
              <EmployeeCard />
              <EmployeeCard />
            </Box>
          </CustomCard>
          <Box sx={{ paddingTop: "36px" }}>
            <CardHeader title="Projects" link="/#" />
            <ProjectCard />
            <ProjectCard />
            <ProjectCard />
          </Box>
        </Box>
        <Box sx={{ width: "30%" }}>
          <CustomCard>
            <CardHeader title="Nearest Event" link="/#" />
            <EventCard />
            <EventCard />
          </CustomCard>
          <Box sx={{ pt: "10px" }}>
            <ActivityCard />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardPage;
