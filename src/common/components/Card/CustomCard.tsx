import { Card } from "@mui/material";

type CustomCardProps = {
  children?: React.ReactNode;
};

const CustomCard = ({ children }: CustomCardProps) => {
  return (
    <Card
      elevation={0}
      sx={{
        paddingY: "32px",
        paddingX: "20px",
        borderRadius: "24px",
        boxShadow: "0px 6px 58px rgba(196, 203, 214, 0.103611)",
      }}
    >
      {children}
    </Card>
  );
};

export default CustomCard;
