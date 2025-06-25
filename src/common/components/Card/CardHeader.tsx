import { Box, Link, Typography } from "@mui/material";

type CardHeaderProps = {
  title: string;
  link?: string;
};

const CardHeader = ({ title, link }: CardHeaderProps) => {
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
      {link && <Link href={link}>View all</Link>}
    </Box>
  );
};

export default CardHeader;
