import { Box } from "@mui/material";

type TabProps = {
  tabList: string[];
  currentTab: string;
  onChangeTab: (tab: string) => void;
};

const activeStyle = {
  borderRadius: "20px",
  backgroundColor: "primary.main",
  color: "#fff",
  fontWeight: 700,
  textAlign: "center",
  padding: "8px",
  transition: "0.3s",
  cursor: "pointer",
  width: "100%"
};

const inActiveStyle = {
  textAlign: "center",
  padding: "8px",
  transition: "0.3s",
  cursor: "pointer",
  width: "100%"
};

const Tab = ({ tabList, currentTab, onChangeTab }: TabProps) => {
  return (
    <Box
      sx={{
        backgroundColor: "#E6EDF5",
        borderRadius: "24px",
        padding: "4px",
        display: "flex",
        alignItems: "center",
        width: "100%",
      }}
    >
      {tabList.map((tab) => (
        <Box
          sx={tab === currentTab ? activeStyle : inActiveStyle}
          onClick={() => onChangeTab(tab)}
        >
          {tab}
        </Box>
      ))}
    </Box>
  );
};

export default Tab;
