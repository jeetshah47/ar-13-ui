import { Box, Typography, Button, CircularProgress, Alert, Skeleton } from "@mui/material";
import PageHeader from "../../common/components/PageHeader/PageHeader";
import CustomCard from "../../common/components/Card/CustomCard";
import CardHeader from "../../common/components/Card/CardHeader";
// import EmployeeCard from "./components/EmployeeCard";
import EventCard from "./components/EventCard";
import ProjectCard from "./components/ProjectCard";
import ActivityCard from "./components/ActivityCard";
import CalendarEventsWidget from "./components/CalendarEventsWidget";
import { useEffect, useState, Suspense, lazy } from "react";
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
import Modal from "../../common/components/Modal/Modal";
// import type { DashboardEmployeeResponse } from "../../store/types/Dashboard/DashboardResponse";
import type { ProjectResponse } from "../../store/types/Project/ProjectResponse";
import type { CalendarResponse } from "../../store/types/Calendar/CalendarResponse";

// Lazy load heavy components
const ProjectStatusChart = lazy(() => import("./components/ProjectStatusChart"));
const SupportModal = lazy(() => import("../../common/components/SupportModal/SupportModal"));

const DashboardPage = () => {
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
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
    // Load critical dashboard data immediately
    dispatch(getDashboardActions("10", "5"));
    
    // Fetch project statistics
    dispatch(getProjectStatisticsAction());
  }, [dispatch]);

  // Fetch calendar events when selected month/year changes
  useEffect(() => {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth() + 1; // getMonth() returns 0-11, we need 1-12
    dispatch(fetchCalendarEvents(year, month));
  }, [dispatch, selectedMonth]);

  // Show error state only for critical dashboard data
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
            <CalendarEventsWidget 
              events={calendarEvents} 
              selectedMonth={selectedMonth}
              onMonthChange={setSelectedMonth}
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
            {projectStatisticsData ? (
              <ProjectStatisticsOverview />
            ) : (
              <Box>
                <Skeleton variant="text" width="40%" height={40} sx={{ marginBottom: "24px" }} />
                <Box sx={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Box key={i} sx={{ flex: "1 1 calc(33.333% - 16px)", minWidth: "200px" }}>
                      <Skeleton variant="rectangular" height={140} sx={{ borderRadius: "12px" }} />
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </Box>

          {/* Charts Section - Lazy Loaded */}
          <Box sx={{ paddingBottom: "28px" }}>
            <Suspense
              fallback={
                <CustomCard>
                  <CardHeader title="Project Status Charts" />
                  <Box sx={{ padding: "40px", display: "flex", flexDirection: "column", gap: "20px" }}>
                    <Skeleton variant="rectangular" height={300} sx={{ borderRadius: "12px" }} />
                    <Skeleton variant="rectangular" height={300} sx={{ borderRadius: "12px" }} />
                  </Box>
                </CustomCard>
              }
            >
              <ProjectStatusChart />
            </Suspense>
          </Box>

          {/* Individual Project Statistics */}
          <Box sx={{ paddingBottom: "28px" }}>
            <CardHeader title="Project Statistics" link="/#" />
            <Box sx={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "20px" }}>
              {projectStatisticsData?.projects && projectStatisticsData.projects.length > 0 ? (
                projectStatisticsData.projects.map((project) => (
                  <ProjectStatisticsWidget key={project.id} project={project} />
                ))
              ) : projectStatisticsData === undefined ? (
                // Show skeleton while loading
                <>
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} variant="rectangular" height={200} sx={{ borderRadius: "12px" }} />
                  ))}
                </>
              ) : (
                <Typography color="secondary">No project statistics available</Typography>
              )}
            </Box>
          </Box>
          
          {/* Original Projects List */}
          <Box sx={{ paddingBottom: "28px" }}>
            <CardHeader title="Projects" link="/#" />
            {isLoading ? (
              // Show skeleton while loading projects
              <>
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} variant="rectangular" height={120} sx={{ borderRadius: "24px", marginBottom: "12px" }} />
                ))}
              </>
            ) : projects.length > 0 ? (
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
                {/* {calendarError} */}
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
        <Suspense fallback={<Box sx={{ padding: "40px", textAlign: "center" }}><CircularProgress /></Box>}>
          <SupportModal onClose={handleOnCloseSupportModal} />
        </Suspense>
      </Modal>
    </Box>
  );
};

export default DashboardPage;
