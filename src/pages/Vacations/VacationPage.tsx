import { Box, Button, SvgIcon, Modal, CircularProgress, Alert } from "@mui/material";
import PageHeader from "../../common/components/PageHeader/PageHeader";
import PlusIcon from "../../assets/icons/general/plus.svg?react";
import Tab from "../../common/components/Tab/Tab";
import EmpVacationCard from "./components/EmpVacationCard";
import VacationRequestCard from "./components/VacationRequestCard";
import { useState, useEffect, useMemo } from "react";
import VacationsCalender from "./components/VacationCalender";
import VacationForm from "../Profile/components/VacationForm";
import { useVacation } from "../../store/hooks/useVacation";
import { useAppSelector } from "../../store/store";
import { getUsersAction } from "../../store/features/user/userAction";
import { useAppDispatch } from "../../store/store";
import { RequirePermission } from "../../common/components/RBAC";
import { usePermissions } from "../../store/hooks/usePermissions";
import toast from "react-hot-toast";

const VacationPage = () => {
  const { isAdmin } = usePermissions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const dispatch = useAppDispatch();
  const { requests, loading, error, getAllRequests, updateRequestStatus } = useVacation();
  const { users, loading: usersLoading } = useAppSelector((state) => state.userReducer);
  
  // Get tab list based on user role
  const tabList = useMemo(() => {
    const baseTabs = ["Employee's Vacations"];
    if (isAdmin()) {
      return ["Vacation Requests","Calendar", ...baseTabs];
    }
    return baseTabs;
  }, [isAdmin]);
  
  // Set initial tab based on user role
  const [currentTab, setCurrentTab] = useState(() => {
    return isAdmin() ? "Vacation Requests" : "Employee's Vacations";
  });

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

  const handleApproveRequest = async (requestId: string, reviewComments?: string) => {
    try {
      await updateRequestStatus(requestId, "approved", reviewComments);
      toast.success("Request approved successfully");
      getAllRequests(); // Refresh requests
    } catch {
      toast.error("Failed to approve request");
    }
  };

  const handleRejectRequest = async (requestId: string, reviewComments?: string) => {
    try {
      await updateRequestStatus(requestId, "rejected", reviewComments);
      toast.success("Request rejected successfully");
      getAllRequests(); // Refresh requests
    } catch {
      toast.error("Failed to reject request");
    }
  };

  // Get user info for a request
  const getUserInfo = (userId: string) => {
    const user = users?.find(u => u.id === userId);
    return {
      name: user?.name || "Unknown User",
      email: user?.email || "",
    };
  };

  const AddButton = (
    <RequirePermission permission="vacation:write">
      <Button 
        variant="contained" 
        startIcon={<SvgIcon component={PlusIcon} />}
        onClick={handleOpenModal}
        sx={{
          width: { xs: "100%", md: "auto" },
          mt: { xs: 1, md: 0 }
        }}
      >
        Add Request
      </Button>
    </RequirePermission>
  );
  return (
    <Box sx={{ height: "100%" }}>
      <PageHeader
        title="Vacations"
        endElement={
          <Box sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "column", md: "row", lg: "row" },
            gap: { xs: "12px", sm: "14px", md: "14px", lg: "16px" },
            width: { xs: "100%", sm: "100%", md: "auto", lg: "auto" },
            alignItems: { xs: "stretch", sm: "stretch", md: "center", lg: "center" },
            flex: { xs: "1 1 100%", sm: "1 1 100%", md: "0 0 auto", lg: "0 0 auto" }
          }}>
            <Box sx={{ width: { xs: "100%", sm: "100%", md: "auto", lg: "auto" }, minWidth: { md: "280px", lg: "300px" } }}>
              <Tab
                tabList={tabList}
                currentTab={currentTab}
                onChangeTab={(tab) => setCurrentTab(tab)}
              />
            </Box>
            {AddButton}
          </Box>
        }
      />
      {currentTab === "Vacation Requests" && isAdmin() && (
        <Box
          sx={{
            padding: { xs: "10px", sm: "16px", md: "24px 0px", lg: "28px 0px" },
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
          
          {/* Vacation request cards */}
          {!loading && !usersLoading && requests.length > 0 && (
            <>
              {requests.map((request) => {
                const userInfo = getUserInfo(request.userId);
                return (
                  <VacationRequestCard
                    key={request.id}
                    request={request}
                    userName={userInfo.name}
                    userEmail={userInfo.email}
                    onApprove={handleApproveRequest}
                    onReject={handleRejectRequest}
                    isLoading={loading}
                  />
                );
              })}
            </>
          )}
          
          {/* Show message when no data */}
          {!loading && !usersLoading && requests.length === 0 && (
            <Box sx={{ textAlign: "center", padding: "40px" }}>
              <p>No vacation requests found.</p>
            </Box>
          )}
        </Box>
      )}
      
      {currentTab === "Employee's Vacations" && (
        <Box
          sx={{
            padding: { xs: "10px", sm: "20px", md: "28px 0px" },
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
      {currentTab === "Calendar" && (
        <Box
          sx={{
            padding: { xs: "10px", sm: "20px", md: "28px 0px" },
            width: "100%",
            display: { xs: "none", md: "block" },
          }}
        >
          <VacationsCalender />
        </Box>
      )}
      
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
