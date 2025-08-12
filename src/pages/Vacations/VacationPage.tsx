import { Box, Button, SvgIcon } from "@mui/material";
import PageHeader from "../../common/components/PageHeader/PageHeader";
import PlusIcon from "../../assets/icons/general/plus.svg?react";
import Tab from "../../common/components/Tab/Tab";
import EmpVacationCard from "./components/EmpVacationCard";
import { useState } from "react";
import VacationsCalender from "./components/VacationCalender";

const tabList = ["Employee's Vacations", "Calender"];

const VacationPage = () => {
  const [currentTab, setCurrentTab] = useState("Calender");

  const AddButton = (
    <Button variant="contained" startIcon={<SvgIcon component={PlusIcon} />}>
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
          <EmpVacationCard />
          <EmpVacationCard />
          <EmpVacationCard />
          <EmpVacationCard />
          <EmpVacationCard />
        </Box>
      )}
      {currentTab === "Calender" && <VacationsCalender />}
    </Box>
  );
};

export default VacationPage;
