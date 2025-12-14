import { Box, Typography } from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";

interface CompletionRateChartProps {
  completionRate: number;
  size?: number;
  showLabel?: boolean;
  strokeWidth?: number;
}

const CompletionRateChart = ({ 
  completionRate, 
  size = 90,
  showLabel = true,
  strokeWidth = 8
}: CompletionRateChartProps) => {
  const theme = useTheme();
  
  // Clamp completion rate between 0 and 100
  const rate = Math.min(Math.max(completionRate, 0), 100);
  
  // Determine color based on completion rate
  const getColor = () => {
    if (rate >= 80) return theme.palette.success.main;
    if (rate >= 50) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  const color = getColor();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (rate / 100) * circumference;

  return (
    <Box
      sx={{
        position: "relative",
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        width={size}
        height={size}
        style={{ transform: "rotate(-90deg)" }}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={alpha(color, 0.1)}
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transition: "stroke-dashoffset 0.6s ease-in-out",
          }}
        />
      </svg>
      
      {showLabel && (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: size * 0.28,
              fontWeight: 700,
              color: color,
              lineHeight: 1,
            }}
          >
            {rate.toFixed(0)}
          </Typography>
          <Typography
            sx={{
              fontSize: size * 0.15,
              fontWeight: 500,
              color: "text.secondary",
              lineHeight: 1,
              marginTop: "2px",
            }}
          >
            %
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default CompletionRateChart;

