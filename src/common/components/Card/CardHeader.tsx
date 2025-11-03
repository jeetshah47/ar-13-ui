import { Box, Link, Typography } from "@mui/material";
import type { ReactNode } from "react";

type CardHeaderProps = {
  title: string;
  link?: string;
  endElement?: ReactNode;
};

const CardHeader = ({ title, link, endElement }: CardHeaderProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignContent: "center",
      }}
    >
      <Typography sx={{ fontSize: "22px", fontWeight: "bold" }}>
        {title}
      </Typography>
      {endElement ? endElement : link && <Link href={link}>View all</Link>}
    </Box>
  );
};

export default CardHeader;
