import { Box, Typography } from "@mui/material";
import type React from "react";

type PageHeaderProps = {
  title: string;
  endElement?: React.ReactNode;
};

const PageHeader = ({ title, endElement }: PageHeaderProps) => {
  return (
    <Box 
      sx={{ 
        display: "flex", 
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: { xs: "flex-start", sm: "space-between" }, 
        alignItems: { xs: "flex-start", sm: "center" },
        gap: { xs: "12px", sm: 0 }
      }}
    >
      <Typography 
        variant="h4" 
        sx={{
          fontWeight: "bold",
          fontSize: { xs: "20px", sm: "24px", md: "32px" }
        }}
      >
        {title}
      </Typography>
      {endElement}
    </Box>
  );
};

export default PageHeader;
