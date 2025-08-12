import { Box, Button, SvgIcon } from "@mui/material";
import PageHeader from "../../common/components/PageHeader/PageHeader";
import PlusIcon from "../../assets/icons/general/plus.svg?react";
import Tab from "../../common/components/Tab/Tab";

const VacationPage = () => {
  const AddButton = (
    <Button variant="contained" startIcon={<SvgIcon component={PlusIcon} />}>
      Add Project
    </Button>
  );
  return (
    <Box sx={{ height: "100%" }}>
      <PageHeader
        title="Vacations"
        endElement={
          <Box
            sx={{
              display: "flex",
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box sx={{width: "100%"}}>
              <Tab />
            </Box>
            
            {AddButton}
          </Box>
        }
      />
    </Box>
  );
};

export default VacationPage;
