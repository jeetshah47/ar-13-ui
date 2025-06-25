import { Box, Typography } from "@mui/material";
import type React from "react";

type PageHeaderProps = {
  title: string;
  endElement?: React.ReactNode;
};

const PageHeader = ({ title, endElement }: PageHeaderProps) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Typography variant="h4" sx={{fontWeight: "bold"}}>{title}</Typography>
      {endElement}
    </Box>
  );
};

export default PageHeader;
