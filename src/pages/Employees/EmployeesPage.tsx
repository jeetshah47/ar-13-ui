import { Box, Button, SvgIcon, CircularProgress, Alert, Typography } from "@mui/material";
import PlusIcon from "../../assets/icons/general/plus.svg?react";
import PageHeader from "../../common/components/PageHeader/PageHeader";
import { useState, useEffect } from "react";
import Tab from "../../common/components/Tab/Tab";
import EmpCard from "./components/EmpCard";
import type { EmployeeResponse } from "../../store/types/Employee/EmployeeResponse";
import ActivitySection from "./components/ActivitySection";
import Modal from "../../common/components/Modal/Modal";
import EmployeeForm from "./components/EmployeeForm";
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
  const AddButton = (
    <RequirePermission permission="users:write">
      <Button
        onClick={handleOnClickAddButton}
        variant="contained"
        startIcon={<SvgIcon component={PlusIcon} />}
      >
        Add Employees
      </Button>
    </RequirePermission>
  );

  return (
    <Box sx={{ height: "100%" }}>
      <PageHeader
        title={`Employees (${totalEmployees})`}
        endElement={
          <>
            <Box sx={{width: "30%"}}>
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
      {currentTab === "List" && (
        <Box sx={{ padding: "28px 0px" }}>
          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", padding: "40px" }}>
              <CircularProgress />
            </Box>
          )}
          {error && (
            <Alert severity="error" sx={{ margin: "20px 0" }}>
              {error}
            </Alert>
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
      {currentTab === "Activity" && (
        <Box sx={{ padding: "28px 0px" }}>
          <ActivitySection />
        </Box>
      )}
      <Modal onClose={handleOnCloseModal} show={showFormModal}>
        <EmployeeForm onClose={handleOnCloseModal} />
      </Modal>
    </Box>
  );
};

export default EmployeesPage;
