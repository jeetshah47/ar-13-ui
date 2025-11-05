import { Box, Typography } from "@mui/material";
import CustomCard from "../../../common/components/Card/CustomCard";

interface StatisticsCardProps {
  title: string;
  value: number;
  subtitle: string;
  growth?: string;
  growthColor?: string;
}

const StatisticsCard = ({
  title,
  value,
  subtitle,
  growth,
  growthColor = "#0AC947",
}: StatisticsCardProps) => {
  return (
    <CustomCard>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          position: "relative",
          minHeight: "186px",
        }}
      >
        {/* Title */}
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: 700,
            lineHeight: 1.714,
            color: "#7D8592",
          }}
        >
          {title}
        </Typography>

        {/* Value */}
        <Typography
          sx={{
            fontSize: "54px",
            fontWeight: 700,
            lineHeight: 1.074,
            color: "#0A1629",
          }}
        >
          {value}
        </Typography>

        {/* Growth */}
        {growth && (
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 600,
              lineHeight: 1.364,
              color: growthColor,
            }}
          >
            {growth}
          </Typography>
        )}

        {/* Subtitle */}
        <Typography
          sx={{
            fontSize: "12px",
            fontWeight: 400,
            lineHeight: 1.364,
            color: "#91929E",
            marginTop: "8px",
          }}
        >
          {subtitle}
        </Typography>

        {/* Statistics Icon */}
        <Box
          sx={{
            position: "absolute",
            right: "28px",
            bottom: "62px",
            width: "104.9px",
            height: "61.76px",
            opacity: 0.8,
          }}
        >
          <svg
            width="105"
            height="62"
            viewBox="0 0 105 62"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <ellipse
              cx="52.5"
              cy="31"
              rx="52.5"
              ry="31"
              fill="#FFFFFF"
              stroke="#0AC947"
              strokeWidth="2"
            />
            <path
              d="M26 20L39 33L52 20L65 33L79 20"
              stroke="#0AC947"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Box>
      </Box>
    </CustomCard>
  );
};

export default StatisticsCard;
