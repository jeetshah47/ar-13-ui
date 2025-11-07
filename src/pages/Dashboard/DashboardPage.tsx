import { Box, Typography, Button, CircularProgress, Alert } from "@mui/material";
import PageHeader from "../../common/components/PageHeader/PageHeader";
import RangeSelector from "../Landing/components/RangeSelector";
import CustomCard from "../../common/components/Card/CustomCard";
import CardHeader from "../../common/components/Card/CardHeader";
// import EmployeeCard from "./components/EmployeeCard";
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
import { getProjectStatisticsAction } from "../../store/features/projects/projectStatisticsAction";
import ProjectStatisticsOverview from "./components/ProjectStatisticsOverview";
import ProjectStatisticsWidget from "./components/ProjectStatisticsWidget";
import ProjectStatusChart from "./components/ProjectStatusChart";
import Modal from "../../common/components/Modal/Modal";
import SupportModal from "../../common/components/SupportModal/SupportModal";
// import type { DashboardEmployeeResponse } from "../../store/types/Dashboard/DashboardResponse";
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
  // const [workloadTab, setWorkloadTab] = useState("Overall");

  // Dashboard data selector
  const dashboardData = useAppSelector(
    (state: RootState) => state.dashboardReducer.api
  );

  // Calendar data selector
  const calendarData = useAppSelector(
    (state: RootState) => state.calendarReducer.api
  );

  // Project statistics data selector
  const projectStatisticsData = useAppSelector(
    (state: RootState) => state.projectStatisticsReducer.api.data
  );

  // User data selector
  const userName = useAppSelector(
    (state: RootState) => state.authReducer.user.name
  );
  const userEmail = useAppSelector(
    (state: RootState) => state.authReducer.user.email
  );

  const dispatch = useAppDispatch();
  
  // Get display name for welcome message
  const displayName = userName || userEmail?.split("@")[0] || "there";

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
  // const employees: DashboardEmployeeResponse[] = dashboardData.data.datas.employees || [];
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
    
    // Fetch project statistics
    dispatch(getProjectStatisticsAction());
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
      <Typography color="secondary">Welcome back, {displayName}</Typography>
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
     
      {/* Main Content: Side by Side Layout */}
      <Box sx={{ padding: "28px 0px", display: "flex", gap: "30px", minHeight: "calc(100vh - 200px)" }}>
        {/* Left Side: Project Statistics with Scroll */}
        <Box
          sx={{
            width: "70%",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
            paddingRight: "10px",
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(0,0,0,0.2)",
              borderRadius: "4px",
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.3)",
              },
            },
          }}
        >
          {/* Project Statistics Overview */}
          <Box sx={{ paddingBottom: "28px" }}>
            <ProjectStatisticsOverview />
          </Box>

          {/* Charts Section */}
          <Box sx={{ paddingBottom: "28px" }}>
            <ProjectStatusChart />
          </Box>

          {/* Individual Project Statistics */}
          <Box sx={{ paddingBottom: "28px" }}>
            <CardHeader title="Project Statistics" link="/#" />
            <Box sx={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "20px" }}>
              {projectStatisticsData?.projects && projectStatisticsData.projects.length > 0 ? (
                projectStatisticsData.projects.map((project) => (
                  <ProjectStatisticsWidget key={project.id} project={project} />
                ))
              ) : (
                <Typography color="secondary">No project statistics available</Typography>
              )}
            </Box>
          </Box>
          
          {/* Original Projects List */}
          <Box sx={{ paddingBottom: "28px" }}>
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

        {/* Right Side: Fixed Calendar Events and Activity Stream */}
        <Box
          sx={{
            width: "30%",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            position: "sticky",
            top: "20px",
            alignSelf: "flex-start",
            maxHeight: "calc(100vh - 220px)",
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(0,0,0,0.2)",
              borderRadius: "4px",
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.3)",
              },
            },
          }}
        >
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
          <ActivityCard />
        </Box>
      </Box>

      <Modal onClose={handleOnCloseSupportModal} show={showSupportModal}>
        <SupportModal onClose={handleOnCloseSupportModal} />
      </Modal>
    </Box>
  );
};

export default DashboardPage;
