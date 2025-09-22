import { Box, Typography, Button } from "@mui/material";
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
import Modal from "../../common/components/Modal/Modal";
import SupportModal from "../../common/components/SupportModal/SupportModal";

const DashboardPage = () => {
  const [calenderState, setCalendarState] = useState<{
    start_date: Date | null;
    end_date: Date | null;
  }>({
    start_date: new Date(),
    end_date: new Date(),
  });
  const [showSupportModal, setShowSupportModal] = useState(false);

  const dashboardData = useAppSelector(
    (state: RootState) => state.dashboardReducer.api
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

  const { employees, projects } = dashboardData.data.datas;
  console.log("datas", dashboardData);

  useEffect(() => {
    dispatch(getDashboardActions("10", "5"));
  }, [dispatch]);

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
              }}
            >
              {employees.map((emp) => (
                <EmployeeCard key={emp.id} />
              ))}
            </Box>
          </CustomCard>
          <Box sx={{ paddingTop: "36px" }}>
            <CardHeader title="Projects" link="/#" />
            {projects.map((project) => (
              <ProjectCard key={project.id} />
            ))}
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

      <Modal onClose={handleOnCloseSupportModal} show={showSupportModal}>
        <SupportModal onClose={handleOnCloseSupportModal} />
      </Modal>
    </Box>
  );
};

export default DashboardPage;
