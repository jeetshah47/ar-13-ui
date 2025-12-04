import { Box, Typography, Button, CircularProgress, Alert, Skeleton, useMediaQuery, useTheme } from "@mui/material";
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
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.only("xs"));
  const isSm = useMediaQuery(theme.breakpoints.only("sm"));
  
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
      <Box sx={{ padding: { xs: "12px", sm: "16px", md: "20px" } }}>
        <Alert severity="error" sx={{ fontSize: { xs: "12px", sm: "14px" } }}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Typography 
        color="secondary" 
        sx={{ 
          fontSize: { xs: "14px", sm: "16px" },
          marginBottom: { xs: "8px", sm: "12px" }
        }}
      >
        Welcome back, {displayName}
      </Typography>
      <PageHeader
        title="Dashboard"
        endElement={
          <Box 
            sx={{ 
              display: "flex", 
              gap: { xs: "8px", sm: "16px" }, 
              alignItems: "center",
              flexDirection: { xs: "column", sm: "row" },
              width: { xs: "100%", sm: "auto" },
              marginTop: { xs: "12px", sm: 0 }
            }}
          >
            <Button
              onClick={handleOnClickSupportButton}
              variant="contained"
              sx={{ 
                display: "none",
                textTransform: "none",
                width: { xs: "100%", sm: "auto" },
                fontSize: { xs: "12px", sm: "14px" },
                padding: { xs: "6px 12px", sm: "8px 16px" }
              }}
            >
              Get Support
            </Button>
            <Box sx={{ width: { xs: "100%", sm: "auto" } }}>
              <CalendarEventsWidget 
                events={calendarEvents} 
                selectedMonth={selectedMonth}
                onMonthChange={setSelectedMonth}
              />
            </Box>
          </Box>
        }
      />
     
      {/* Main Content: Side by Side Layout */}
      <Box 
        sx={{ 
          padding: { xs: "16px 0px", sm: "20px 0px", md: "24px 0px", lg: "28px 0px" }, 
          display: "flex", 
          flexDirection: { xs: "column", sm: "column", md: "row", lg: "row" },
          gap: { xs: "20px", sm: "24px", md: "24px", lg: "30px" }, 
          minHeight: { xs: "auto", sm: "auto", md: "calc(100vh - 200px)", lg: "calc(100vh - 200px)" }
        }}
      >
        {/* Left Side: Project Statistics with Scroll */}
        <Box
          sx={{
            width: { xs: "100%", sm: "100%", md: "65%", lg: "70%" },
            display: "flex",
            flexDirection: "column",
            overflowY: { xs: "visible", sm: "visible", md: "auto", lg: "auto" },
            paddingRight: { xs: "0px", sm: "0px", md: "8px", lg: "10px" },
            maxHeight: { xs: "none", sm: "none", md: "calc(100vh - 220px)", lg: "calc(100vh - 220px)" },
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
          <Box sx={{ paddingBottom: { xs: "16px", sm: "20px", md: "28px" } }}>
            {projectStatisticsData ? (
              <ProjectStatisticsOverview />
            ) : (
              <Box>
                <Skeleton 
                  variant="text" 
                  width={isXs ? "60%" : isSm ? "50%" : "40%"} 
                  height={isXs ? 32 : isSm ? 36 : 40} 
                  sx={{ marginBottom: { xs: "16px", sm: "20px", md: "24px" } }} 
                />
                <Box 
                  sx={{ 
                    display: "flex", 
                    gap: { xs: "12px", sm: "16px" }, 
                    flexWrap: "wrap" 
                  }}
                >
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Box 
                      key={i} 
                      sx={{ 
                        flex: { 
                          xs: "1 1 calc(50% - 6px)", 
                          sm: "1 1 calc(33.333% - 12px)", 
                          md: "1 1 calc(33.333% - 16px)" 
                        }, 
                        minWidth: { xs: "140px", sm: "180px", md: "200px" } 
                      }}
                    >
                      <Skeleton 
                        variant="rectangular" 
                        height={isXs ? 120 : isSm ? 130 : 140} 
                        sx={{ borderRadius: "12px" }} 
                      />
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </Box>

          {/* Charts Section - Lazy Loaded */}
          <Box sx={{ paddingBottom: { xs: "16px", sm: "20px", md: "28px" } }}>
            <Suspense
              fallback={
                <CustomCard>
                  <CardHeader title="Project Status Charts" />
                  <Box 
                    sx={{ 
                      padding: { xs: "20px", sm: "30px", md: "40px" }, 
                      display: "flex", 
                      flexDirection: "column", 
                      gap: { xs: "16px", sm: "20px" } 
                    }}
                  >
                    <Skeleton 
                      variant="rectangular" 
                      height={isXs ? 200 : isSm ? 250 : 300} 
                      sx={{ borderRadius: "12px" }} 
                    />
                    <Skeleton 
                      variant="rectangular" 
                      height={isXs ? 200 : isSm ? 250 : 300} 
                      sx={{ borderRadius: "12px" }} 
                    />
                  </Box>
                </CustomCard>
              }
            >
              <ProjectStatusChart />
            </Suspense>
          </Box>

          {/* Individual Project Statistics */}
          <Box sx={{ paddingBottom: { xs: "16px", sm: "20px", md: "28px" } }}>
            <CardHeader title="Project Statistics" link="/#" />
            <Box 
              sx={{ 
                display: "flex", 
                flexDirection: "column", 
                gap: { xs: "12px", sm: "16px", md: "20px" }, 
                marginTop: { xs: "12px", sm: "16px", md: "20px" } 
              }}
            >
              {projectStatisticsData?.projects && projectStatisticsData.projects.length > 0 ? (
                projectStatisticsData.projects.map((project) => (
                  <ProjectStatisticsWidget key={project.id} project={project} />
                ))
              ) : projectStatisticsData === undefined ? (
                // Show skeleton while loading
                <>
                  {[1, 2, 3].map((i) => (
                    <Skeleton 
                      key={i} 
                      variant="rectangular" 
                      height={isXs ? 150 : isSm ? 175 : 200} 
                      sx={{ borderRadius: "12px" }} 
                    />
                  ))}
                </>
              ) : (
                <Typography 
                  color="secondary"
                  sx={{ fontSize: { xs: "12px", sm: "14px" } }}
                >
                  No project statistics available
                </Typography>
              )}
            </Box>
          </Box>
          
          {/* Original Projects List */}
          <Box sx={{ paddingBottom: { xs: "16px", sm: "20px", md: "28px" } }}>
            <CardHeader title="Projects" link="/#" />
            {isLoading ? (
              // Show skeleton while loading projects
              <>
                {[1, 2, 3].map((i) => (
                  <Skeleton 
                    key={i} 
                    variant="rectangular" 
                    height={isXs ? 100 : isSm ? 110 : 120} 
                    sx={{ 
                      borderRadius: { xs: "12px", sm: "20px", md: "24px" }, 
                      marginBottom: { xs: "8px", sm: "10px", md: "12px" } 
                    }} 
                  />
                ))}
              </>
            ) : projects.length > 0 ? (
              projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))
            ) : (
              <Typography 
                color="secondary"
                sx={{ fontSize: { xs: "12px", sm: "14px" } }}
              >
                No projects found
              </Typography>
            )}
          </Box>
        </Box>

        {/* Right Side: Fixed Calendar Events and Activity Stream */}
        <Box
          sx={{
            width: { xs: "100%", sm: "100%", md: "32%", lg: "30%" },
            display: "flex",
            flexDirection: "column",
            gap: { xs: "16px", md: "10px" },
            position: { xs: "relative", md: "sticky" },
            top: { xs: "auto", md: "20px" },
            alignSelf: { xs: "stretch", md: "flex-start" },
            maxHeight: { xs: "none", md: "calc(100vh - 220px)" },
            overflowY: { xs: "visible", md: "auto" },
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
