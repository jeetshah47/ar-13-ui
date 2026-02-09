import { Box, Button, SvgIcon, CircularProgress, Alert, Typography, Fab } from "@mui/material";
import { Lock } from "@mui/icons-material";
import PlusIcon from "../../assets/icons/general/plus.svg?react";
import PageHeader from "../../common/components/PageHeader/PageHeader";
import { useState, useEffect } from "react";
import Tab from "../../common/components/Tab/Tab";
import EmpCard from "./components/EmpCard";
import type { EmployeeResponse } from "../../store/types/Employee/EmployeeResponse";
import ActivitySection from "./components/ActivitySection";
import Modal from "../../common/components/Modal/Modal";
import EmployeeRegistrationModal from "./components/EmployeeRegistrationModal";
import { RequirePermission } from "../../common/components/RBAC";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { getAllEmployeesAction } from "../../store/features/employees/employeeActions";
const tabList = ["List", "Activity"];
const EmployeesPage = () => {
  const [currentTab, setCurrentTab] = useState("Activity");
  const [showFormModal, setShowFormModal] = useState(false);
  
  const dispatch = useAppDispatch();
  const { employees, totalEmployees, loading, error } = useAppSelector(
    (state) => state.employeeReducer
  );

  useEffect(() => {
    dispatch(getAllEmployeesAction());
  }, [dispatch]);
  const handleOnCloseModal = () => {
    setShowFormModal(false);
  };
  const handleOnClickAddButton = () => {
    setShowFormModal(true);
  };
  const handleEmployeeCreated = () => {
    dispatch(getAllEmployeesAction());
    setShowFormModal(false);
  };
  const AddButton = (
    <RequirePermission permission="users:write">
      <Button
        onClick={handleOnClickAddButton}
        variant="contained"
        disabled={!!error || loading}
        startIcon={<SvgIcon component={PlusIcon} />}
        sx={{
          display: { xs: "none", sm: "flex" }
        }}
      >
        Add Employees
      </Button>
    </RequirePermission>
  );

  const FloatingActionButton = (
    <RequirePermission permission="users:write">
      <Fab
        onClick={handleOnClickAddButton}
        disabled={!!error || loading}
        color="primary"
        sx={{
          position: "fixed",
          bottom: { xs: "24px", sm: "32px" },
          right: { xs: "20px", sm: "32px" },
          display: { xs: "flex", sm: "none" },
          zIndex: (theme) => theme.zIndex.speedDial,
          boxShadow: "0px 6px 12px 0px rgba(63, 140, 255, 0.26)",
          "&:hover": {
            boxShadow: "0px 8px 16px 0px rgba(63, 140, 255, 0.35)",
          }
        }}
      >
        <SvgIcon component={PlusIcon} sx={{ color: "#fff" }} />
      </Fab>
    </RequirePermission>
  );

  return (
    <Box 
      sx={{ 
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: { xs: "#F4F9FD", sm: "transparent" },
        minHeight: 0,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          padding: { xs: "20px", sm: "0 0 20px 0", md: "0 0 20px 0", lg: "0 0 20px 0" },
          paddingX: { xs: "20px", sm: 0, md: 0, lg: 0 },
          flexShrink: 0,
        }}
      >
        <PageHeader
          title={`Employees (${totalEmployees})`}
          endElement={
          <>
            <Box 
              sx={{
                width: { xs: "100%", sm: "100%", md: "35%", lg: "30%" },
                marginBottom: { xs: "16px", sm: "16px", md: 0, lg: 0 },
                order: { xs: -1, sm: -1, md: 0, lg: 0 }
              }}
            >
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
      </Box>
      {/* Error Display - shown regardless of tab */}
      {error && error.toLowerCase().includes("admin access required") ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "60px 20px",
            textAlign: "center",
            minHeight: "400px",
          }}
        >
          <Box
            sx={{
              width: "200px",
              height: "200px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "24px",
              position: "relative",
            }}
          >
            {/* Background gradient circle */}
            <Box
              sx={{
                position: "absolute",
                width: "180px",
                height: "180px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, rgba(211, 47, 47, 0.1) 0%, rgba(244, 67, 54, 0.05) 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Lock
                sx={(theme) => ({
                  fontSize: "80px",
                  color: theme.palette.error.main,
                  zIndex: 1,
                })}
              />
            </Box>
          </Box>
          <Typography
            variant="h5"
            sx={(theme) => ({
              fontWeight: "bold",
              color: theme.palette.text.primary,
              marginBottom: "12px",
            })}
          >
            Admin Access Required
          </Typography>
          <Typography
            variant="body1"
            sx={(theme) => ({
              color: theme.palette.text.secondary,
              maxWidth: "500px",
              lineHeight: 1.6,
              marginBottom: "8px",
            })}
          >
            You need administrator privileges to access the employees section.
          </Typography>
          <Typography
            variant="body2"
            sx={(theme) => ({
              color: theme.palette.text.secondary,
              maxWidth: "500px",
            })}
          >
            Please contact your administrator if you believe this is an error.
          </Typography>
        </Box>
      ) : error ? (
        <Box sx={{ padding: { xs: "0 20px", sm: "0" } }}>
          <Alert 
            severity="error" 
            sx={{ 
              margin: "20px 0", 
              borderRadius: "12px",
              "& .MuiAlert-message": {
                width: "100%"
              }
            }}
          >
            <Typography variant="body1" component="div">
              {error}
            </Typography>
          </Alert>
        </Box>
      ) : null}
      <Box sx={{ 
        flex: 1,
        minHeight: 0,
        overflowY: "auto",
        overflowX: "hidden",
        paddingBottom: { xs: "100px", sm: "0" },
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
      }}>
      {currentTab === "List" && !error && (
        <Box 
          sx={{ 
            padding: { xs: "20px", sm: "28px 0px" },
            paddingX: { xs: "20px", sm: 0 }
          }}
        >
          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", padding: "40px" }}>
              <CircularProgress />
            </Box>
          )}
          {!loading && !error && employees.length === 0 && (
            <Box sx={{ textAlign: "center", padding: "40px" }}>
              <Typography color="text.secondary">No employees found</Typography>
            </Box>
          )}
          {!loading && !error && employees.map((employee: EmployeeResponse) => (
            <EmpCard key={employee.userId} employee={employee} />
          ))}
        </Box>
      )}
      {currentTab === "Activity" && !error && (
        <Box 
          sx={{ 
            padding: { xs: "20px", sm: "28px 0px" },
            paddingX: { xs: "20px", sm: 0 }
          }}
        >
          <ActivitySection />
        </Box>
      )}
      </Box>
      {FloatingActionButton}
      <Modal onClose={handleOnCloseModal} show={showFormModal}>
        <Box
          onClick={(e) => e.stopPropagation()}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <EmployeeRegistrationModal
            onClose={handleOnCloseModal}
            onSuccess={handleEmployeeCreated}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default EmployeesPage;
