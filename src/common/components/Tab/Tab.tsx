import { Box, Typography } from "@mui/material";

type TabProps = {
  tabList: string[];
  currentTab: string;
  onChangeTab: (tab: string) => void;
};

const Tab = ({ tabList, currentTab, onChangeTab }: TabProps) => {
  return (
    <Box
      sx={(theme) => ({
        backgroundColor: theme.palette.grey[100],
        borderRadius: "12px",
        padding: "4px",
        display: "flex",
        alignItems: "center",
        width: "100%",
        gap: "4px",
      })}
    >
      {tabList.map((tab) => {
        const isActive = tab === currentTab;
        return (
          <Box
            key={tab}
            onClick={() => onChangeTab(tab)}
            sx={(theme) => ({
              flex: 1,
              borderRadius: "8px",
              padding: { xs: "8px 12px", sm: "10px 16px" },
              textAlign: "center",
              cursor: "pointer",
              transition: "all 0.2s ease-in-out",
              backgroundColor: isActive ? theme.palette.primary.main : "transparent",
              color: isActive ? theme.palette.primary.contrastText : theme.palette.text.secondary,
              "&:hover": {
                backgroundColor: isActive 
                  ? theme.palette.primary.main 
                  : theme.palette.action.hover,
              },
            })}
          >
            <Typography
              sx={(theme) => ({
                fontSize: { xs: "12px", sm: "14px" },
                fontWeight: isActive ? 600 : 500,
                whiteSpace: "nowrap",
                color: isActive ? theme.palette.primary.contrastText : theme.palette.text.secondary,
              })}
            >
              {tab}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default Tab;
