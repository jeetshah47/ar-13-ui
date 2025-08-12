import { Box, Button, SvgIcon } from "@mui/material";
import PlusIcon from "../../assets/icons/general/plus.svg?react";
import PageHeader from "../../common/components/PageHeader/PageHeader";
import { useState } from "react";
import Tab from "../../common/components/Tab/Tab";
import EmpCard from "./components/EmpCard";
import ActivitySection from "./components/ActivitySection";
import Modal from "../../common/components/Modal/Modal";
import EmployeeForm from "./components/EmployeeForm";
const tabList = ["List", "Activity"];
const EmployeesPage = () => {
  const [currentTab, setCurrentTab] = useState("Activity");
  const [showFormModal, setShowFormModal] = useState(false);
  const handleOnCloseModal = () => {
    setShowFormModal(false);
  };
  const handleOnClickAddButton = () => {
    setShowFormModal(true);
  };
  const AddButton = (
    <Button
      onClick={handleOnClickAddButton}
      variant="contained"
      startIcon={<SvgIcon component={PlusIcon} />}
    >
      Add Employees
    </Button>
  );

  return (
    <Box sx={{ height: "100%" }}>
      <PageHeader
        title="Employees (15)"
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
          <EmpCard />
          <EmpCard />
          <EmpCard />
          <EmpCard />
          <EmpCard />
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
