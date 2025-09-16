import { Box, Button, SvgIcon, Modal, CircularProgress, Alert } from "@mui/material";
import PageHeader from "../../common/components/PageHeader/PageHeader";
import PlusIcon from "../../assets/icons/general/plus.svg?react";
import Tab from "../../common/components/Tab/Tab";
import EmpVacationCard from "./components/EmpVacationCard";
import { useState, useEffect, useMemo } from "react";
// import VacationsCalender from "./components/VacationCalender";
import VacationForm from "../Profile/components/VacationForm";
import { useVacation } from "../../store/hooks/useVacation";
import { useAppSelector } from "../../store/store";
import { getUsersAction } from "../../store/features/user/userAction";
import { useAppDispatch } from "../../store/store";

const tabList = ["Employee's Vacations", "Calendar"];

const VacationPage = () => {
  const [currentTab, setCurrentTab] = useState(tabList[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const dispatch = useAppDispatch();
  const { requests, loading, error, getAllRequests } = useVacation();
  const { users, loading: usersLoading } = useAppSelector((state) => state.userReducer);

  // Calculate employee vacation stats by mapping requests to users
  const employeeStats = useMemo(() => {
    if (!users || !requests) {
      return [];
    }

    return users.map(user => {
      const userRequests = requests.filter(request => request.userId === user.id);
      
      const stats = userRequests.reduce((acc, request) => {
        if (request.requestType === 'vacation') {
          acc.vacations += request.durationType === 'days' ? request.duration : Math.ceil(request.duration / 8);
        } else if (request.requestType === 'sick_leave') {
          acc.sickLeave += request.durationType === 'days' ? request.duration : Math.ceil(request.duration / 8);
        } else if (request.requestType === 'work_remotely') {
          acc.workRemotely += request.durationType === 'days' ? request.duration : Math.ceil(request.duration / 8);
        }
        return acc;
      }, { vacations: 0, sickLeave: 0, workRemotely: 0 });

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        vacationStats: stats
      };
    });
  }, [users, requests]);


  // Load data on component mount
  useEffect(() => {
    getAllRequests();
    dispatch(getUsersAction());
  }, [getAllRequests, dispatch]); // Functions are now memoized with useCallback

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const AddButton = (
    <Button 
      variant="contained" 
      startIcon={<SvgIcon component={PlusIcon} />}
      onClick={handleOpenModal}
    >
      Add Request
    </Button>
  );
  return (
    <Box sx={{ height: "100%" }}>
      <PageHeader
        title="Vacations"
        endElement={
          <>
            <Box sx={{width: "40%"}}>
              <Tab
                tabList={tabList}
                currentTab={currentTab}
                onChangeTab={(tab) => setCurrentTab(tab)}
              />
            </Box>
            {AddButton}
          </>
        }
      />
      {currentTab === "Employee's Vacations" && (
        <Box
          sx={{
            padding: "28px 0px",
          }}
        >
          {(loading || usersLoading) && (
            <Box sx={{ display: "flex", justifyContent: "center", padding: "20px" }}>
              <CircularProgress />
            </Box>
          )}
          
          {error && (
            <Alert severity="error" sx={{ marginBottom: "16px" }}>
              {error}
            </Alert>
          )}
          
          
          {/* Employee vacation cards with calculated stats */}
          {!loading && !usersLoading && employeeStats.length > 0 && (
            <>
              {employeeStats.map((employee) => (
                <EmpVacationCard 
                  key={employee.id}
                  employee={employee}
                />
              ))}
            </>
          )}
          
          {/* Show message when no data */}
          {!loading && !usersLoading && employeeStats.length === 0 && (
            <Box sx={{ textAlign: "center", padding: "40px" }}>
              <p>No employees found.</p>
            </Box>
          )}
        </Box>
      )}
      {/* {currentTab === "Calendar" && <VacationsCalender />} */}
      
      {/* Vacation Request Modal */}
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: "90%",
            maxWidth: "600px",
            maxHeight: "90vh",
            overflow: "auto",
          }}
        >
          <VacationForm onClose={handleCloseModal} />
        </Box>
      </Modal>
    </Box>
  );
};

export default VacationPage;
