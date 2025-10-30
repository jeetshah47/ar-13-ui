import { Box, Typography, Button, CircularProgress, Alert } from "@mui/material";
import PageHeader from "../../common/components/PageHeader/PageHeader";
import RangeSelector from "../Landing/components/RangeSelector";
import CustomCard from "../../common/components/Card/CustomCard";
import CardHeader from "../../common/components/Card/CardHeader";
import EmployeeCard from "./components/EmployeeCard";
import EventCard from "./components/EventCard";
import ProjectCard from "./components/ProjectCard";
import ActivityCard from "./components/ActivityCard";
import { useEffect, useState } from "react";
import {
  useAppDispatch,
  useAppSelector,
  type RootState,
} from "../../store/store";
import { getDashboardActions } from "../../store/features/dashboard/dashboardAction";
import { fetchCalendarEvents } from "../../store/features/calendar/calendarAction";
import Modal from "../../common/components/Modal/Modal";
import SupportModal from "../../common/components/SupportModal/SupportModal";
import type { UserResponse } from "../../store/types/User/UserResponse";
import type { ProjectResponse } from "../../store/types/Project/ProjectResponse";
import type { CalendarResponse } from "../../store/types/Calendar/CalendarResponse";

const DashboardPage = () => {
  const [calenderState, setCalendarState] = useState<{
    start_date: Date | null;
    end_date: Date | null;
  }>({
    start_date: new Date(),
    end_date: new Date(),
  });
  const [showSupportModal, setShowSupportModal] = useState(false);

  // Dashboard data selector
  const dashboardData = useAppSelector(
    (state: RootState) => state.dashboardReducer.api
  );

  // Calendar data selector
  const calendarData = useAppSelector(
    (state: RootState) => state.calendarReducer.api
  );

  const dispatch = useAppDispatch();

  const handleStartDateChange = (date: Date | null) => {
    setCalendarState({ ...calenderState, start_date: date });
  };
  const handleEndDateChange = (date: Date | null) => {
    setCalendarState({ ...calenderState, end_date: date });
  };

  const handleOnCloseSupportModal = () => {
    setShowSupportModal(false);
  };

  const handleOnClickSupportButton = () => {
    setShowSupportModal(true);
  };

  // Extract data from dashboard state
  const employees: UserResponse[] = dashboardData.data.datas.employees || [];
  const projects: ProjectResponse[] = dashboardData.data.datas.projects || [];
  const isLoading = dashboardData.loading;
  const error = dashboardData.error;

  // Extract calendar events
  const calendarEvents: CalendarResponse[] = calendarData.data.events || [];
  const isCalendarLoading = calendarData.loading;
  const calendarError = calendarData.error;

  useEffect(() => {
    dispatch(getDashboardActions("10", "5"));
    
    // Fetch calendar events for current month
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-11, we need 1-12
    dispatch(fetchCalendarEvents(currentYear, currentMonth));
  }, [dispatch]);

  // Show loading state
  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  // Show error state
  if (error) {
    return (
      <Box sx={{ padding: "20px" }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Typography color="secondary">Welcome back, Jeet</Typography>
      <PageHeader
        title="Dashboard"
        endElement={
          <Box sx={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <Button
              onClick={handleOnClickSupportButton}
              variant="outlined"
              sx={{ textTransform: "none" }}
            >
              Get Support
            </Button>
            <RangeSelector
              startDate={calenderState.start_date}
              endDate={calenderState.end_date}
              setEndDate={handleEndDateChange}
              setStartDate={handleStartDateChange}
            />
          </Box>
        }
      />
     
      <Box sx={{ padding: "28px 0px", display: "flex", gap: "30px" }}>
        <Box sx={{ width: "70%" }}>
          <CustomCard>
            <CardHeader title="Workload" link="/#" />
            <Box
              sx={{
                display: "flex",
                gap: "16px",
                paddingTop: "16px",
                flexWrap: "wrap",
                alignItems: "flex-start",
              }}
            >
              {employees.length > 0 ? (
                employees.map((employee) => (
                  <EmployeeCard key={employee.id} employee={employee} />
                ))
              ) : (
                <Typography color="secondary">No employees found</Typography>
              )}
            </Box>
          </CustomCard>
          <Box sx={{ paddingTop: "36px" }}>
            <CardHeader title="Projects" link="/#" />
            {projects.length > 0 ? (
              projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))
            ) : (
              <Typography color="secondary">No projects found</Typography>
            )}
          </Box>
        </Box>
        <Box sx={{ width: "30%" }}>
          <CustomCard>
            <CardHeader title="Calendar Event" link="/#" />
            {isCalendarLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", padding: "20px" }}>
                <CircularProgress size={24} />
              </Box>
            ) : calendarError ? (
              <Typography color="error" sx={{ padding: "20px", textAlign: "center" }}>
                {calendarError}
              </Typography>
            ) : calendarEvents.length > 0 ? (
              calendarEvents.slice(0, 2).map((event) => (
                <EventCard key={event.id} event={event} />
              ))
            ) : (
              <Typography color="secondary" sx={{ padding: "20px", textAlign: "center" }}>
                No events this month
              </Typography>
            )}
          </CustomCard>
          <Box sx={{ pt: "10px" }}>
            <ActivityCard />
          </Box>
        </Box>
      </Box>

      <Modal onClose={handleOnCloseSupportModal} show={showSupportModal}>
        <SupportModal onClose={handleOnCloseSupportModal} />
      </Modal>
    </Box>
  );
};

export default DashboardPage;
