import React, { useEffect, useMemo } from "react";
import {
  Avatar,
  Box,
  LinearProgress,
  Paper,
  styled,
  Tooltip,
  tooltipClasses,
  Typography,
  type TooltipProps,
} from "@mui/material";
import { blurAnimation } from "../../../common/animation/cssAnimation";
import { useVacation } from "../../../store/hooks/useVacation";
import { useAppSelector, useAppDispatch } from "../../../store/store";
import { getUsersAction } from "../../../store/features/user/userAction";
import type { VacationResponse } from "../../../store/types/Vacation/VacationTypes";

// Vacation data structure
interface VacationEntry {
  date: string;
  leaveType: "sick_leave" | "work_remotely" | "vacation";
  status: "approved" | "pending" | "rejected" | "cancelled";
}

interface EmployeeVacation {
  id: string;
  name: string;
  avatar?: string;
  vacations: VacationEntry[];
}
// Helper function to get all dates between start and end date
const getDatesBetween = (startDate: string, endDate?: string): Date[] => {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date(startDate);
  const dates: Date[] = [];
  
  const current = new Date(start);
  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  
  return dates;
};

// Transform API data to calendar format
const transformVacationData = (
  requests: VacationResponse[],
  users: Array<{ id: string; name: string; email: string }>
): EmployeeVacation[] => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Filter requests for current month
  const currentMonthRequests = requests.filter((request) => {
    const startDate = new Date(request.startDate);
    const endDate = request.endDate ? new Date(request.endDate) : new Date(request.startDate);
    
    // Check if request overlaps with current month
    return (
      (startDate.getMonth() === currentMonth && startDate.getFullYear() === currentYear) ||
      (endDate.getMonth() === currentMonth && endDate.getFullYear() === currentYear) ||
      (startDate <= new Date(currentYear, currentMonth + 1, 0) && 
       endDate >= new Date(currentYear, currentMonth, 1))
    );
  });

  // Group by user
  const userVacationsMap = new Map<string, VacationEntry[]>();

  currentMonthRequests.forEach((request) => {
    const dates = getDatesBetween(request.startDate, request.endDate);
    
    dates.forEach((dateObj) => {
      // Only include dates in current month
      if (dateObj.getMonth() === currentMonth && dateObj.getFullYear() === currentYear) {
        const dayString = String(dateObj.getDate());
        
        if (!userVacationsMap.has(request.userId)) {
          userVacationsMap.set(request.userId, []);
        }
        
        userVacationsMap.get(request.userId)!.push({
          date: dayString,
          leaveType: request.requestType,
          status: request.status as "approved" | "pending" | "rejected" | "cancelled",
        });
      }
    });
  });

  // Convert to EmployeeVacation array
  return users.map((user) => ({
    id: user.id,
    name: user.name,
    vacations: userVacationsMap.get(user.id) || [],
  }));
};

// Helper to get vacation for a specific day
const getVacationForDay = (
  vacations: VacationEntry[],
  day: number
): VacationEntry | null => {
  const dayString = String(day);
  return vacations.find((v) => v.date === dayString) || null;
};

// Get days in current month
const getDaysInMonth = (): number[] => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const lastDay = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: lastDay }, (_, i) => i + 1);
};

// Get weekday abbreviation
const getWeekdayAbbr = (day: number): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const date = new Date(year, month, day);
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return weekdays[date.getDay()];
};

// Color mapping based on Figma design
const getVacationCellStyle = (
  vacation: VacationEntry | null
): {
  backgroundColor: string;
  borderColor?: string;
  borderWidth?: string;
} => {
  if (!vacation) {
    return { backgroundColor: "#F4F9FD" };
  }

  const { leaveType, status } = vacation;

  // Handle cancelled status - gray color for all types
  if (status === "cancelled") {
    return {
      backgroundColor: "#9E9E9E",
    };
  }

  // Handle rejected status - light gray with border
  if (status === "rejected") {
    return {
      backgroundColor: "rgba(158, 158, 158, 0.12)",
      borderColor: "#9E9E9E",
      borderWidth: "1px",
    };
  }

  if (leaveType === "sick_leave") {
    if (status === "approved") {
      return { backgroundColor: "#F65160" };
    } else {
      // pending
      return {
        backgroundColor: "rgba(246, 81, 96, 0.12)",
        borderColor: "#F65160",
        borderWidth: "1px",
      };
    }
  }

  if (leaveType === "work_remotely") {
    if (status === "approved") {
      return { backgroundColor: "#6D5DD3" };
    } else {
      // pending
      return {
        backgroundColor: "rgba(109, 93, 211, 0.14)",
        borderColor: "#6D5DD3",
        borderWidth: "1px",
      };
    }
  }

  if (leaveType === "vacation") {
    if (status === "approved") {
      return { backgroundColor: "#15C0E6" };
    } else {
      // pending
      return {
        backgroundColor: "rgba(21, 192, 230, 0.12)",
        borderColor: "#15C0E6",
        borderWidth: "1px",
      };
    }
  }

  return { backgroundColor: "#F4F9FD" };
};

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    maxWidth: 200,
    fontSize: theme.typography.pxToRem(12),
    boxShadow: theme.shadows[6],
    borderRadius: "14px",
    padding: theme.spacing(1.5),
  },
}));

const VacationsCalender: React.FC = () => {
  const dispatch = useAppDispatch();
  const { requests, loading, getAllRequests } = useVacation();
  const { users, loading: usersLoading } = useAppSelector((state) => state.userReducer);
  
  const days = getDaysInMonth();
  const now = new Date();
  const monthName = now.toLocaleString("default", { month: "long" });

  // Fetch data on mount
  useEffect(() => {
    getAllRequests();
    dispatch(getUsersAction());
  }, [getAllRequests, dispatch]);

  // Transform API data to calendar format
  const employees = useMemo(() => {
    if (!requests || !users || requests.length === 0 || users.length === 0) {
      return [];
    }
    return transformVacationData(requests, users);
  }, [requests, users]);

  return (
    <Box sx={{ width: "100%", ...blurAnimation }}>
      {(loading || usersLoading) && (
        <Box sx={{ width: "100%", mb: 2 }}>
          <LinearProgress />
        </Box>
      )}
      <Paper sx={{ 
        p: 0, 
        backgroundColor: "background.paper", 
        borderRadius: "24px", 
        overflow: "hidden",
        width: "100%",
        opacity: loading || usersLoading ? 0.6 : 1,
        transition: "opacity 0.3s ease",
      }}>
        <Box sx={{ display: "flex", width: "100%" }}>
          {/* Fixed Employee Name Sidebar */}
          <Box
            sx={(theme) => ({
              minWidth: "240px",
              borderRight: `1px solid ${theme.palette.divider}`,
              flexShrink: 0,
            })}
          >
            <Box
              height={"78px"}
              sx={(theme) => ({
                borderBottom: `1px solid ${theme.palette.divider}`,
                display: "flex",
                alignItems: "center",
                px: 2,
              })}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: "16px" }}>
                Employees
              </Typography>
            </Box>
            {employees.map((employee) => (
              <Box
                key={employee.id}
                sx={(theme) => ({
                  color: theme.palette.text.primary,
                  height: "52px",
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  px: 2,
                })}
              >
                <Avatar
                  sx={{
                    width: "24px",
                    height: "24px",
                    fontSize: "12px",
                    bgcolor: theme => theme.palette.primary.main,
                  }}
                >
                  {employee.name.split(" ").map((n) => n[0]).join("")}
                </Avatar>
                <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>
                  {employee.name}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Scrollable Calendar Section */}
          <Box sx={{ overflowX: "auto", flex: 1, width: "100%", minWidth: 0 }}>
            <Box
              height={"78px"}
              sx={(theme) => ({
                borderBottom: `1px solid ${theme.palette.divider}`,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              })}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                  fontSize: "16px",
                  px: 1,
                  mb: 0.5,
                }}
              >
                First month ({monthName})
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  px: 1,
                  minWidth: "fit-content",
                  alignItems: "center",
                }}
              >
                {days.map((day) => (
                  <Box
                    key={day}
                    sx={{
                      width: "28px",
                      height: "40px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#F4F9FD",
                      borderRadius: "7px",
                      flexShrink: 0,
                      margin: "0 2px",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "13px",
                        fontWeight: 700,
                        color: "#7D8593",
                        lineHeight: 1.38,
                      }}
                    >
                      {day}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "11px",
                        fontWeight: 400,
                        color: "#7D8594",
                        lineHeight: 1.64,
                        opacity: 0.7,
                      }}
                    >
                      {getWeekdayAbbr(day)}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
            {employees.map((employee) => (
              <Box
                key={employee.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  height: "52px",
                  minWidth: "fit-content",
                  px: 1,
                }}
              >
                {days.map((day) => {
                  const vacation = getVacationForDay(employee.vacations, day);
                  const cellStyle = getVacationCellStyle(vacation);

                  const formatLeaveType = (type: string): string => {
                    return type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
                  };

                  return (
                    <Box
                      key={day}
                      sx={{
                        width: "28px",
                        height: "44px",
                        borderRadius: "7px",
                        backgroundColor: "#F4F9FD",
                        margin: "0 2px",
                        transition: "all 0.2s ease",
                        position: "relative",
                        flexShrink: 0,
                        overflow: "hidden",
                      }}
                    >
                      <HtmlTooltip
                        title={
                          vacation ? (
                            <Box>
                              <Typography
                                color="inherit"
                                variant="subtitle2"
                                sx={{ fontWeight: 700, mb: 0.5 }}
                              >
                                {employee.name}
                              </Typography>
                              <Typography variant="body2" sx={{ mb: 0.5 }}>
                                Date: {day}/{now.getMonth() + 1}/{now.getFullYear()}
                              </Typography>
                              <Typography variant="body2" sx={{ mb: 0.5 }}>
                                Type: {formatLeaveType(vacation.leaveType)}
                              </Typography>
                              <Typography variant="body2">
                                Status: {vacation.status.charAt(0).toUpperCase() + vacation.status.slice(1)}
                              </Typography>
                            </Box>
                          ) : (
                            <Typography variant="body2">No vacation</Typography>
                          )
                        }
                      >
                        <Box
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            backgroundColor: cellStyle.backgroundColor,
                            border:
                              cellStyle.borderColor && cellStyle.borderWidth
                                ? `${cellStyle.borderWidth} solid ${cellStyle.borderColor}`
                                : "none",
                            borderRadius: "7px",
                            transition: "all 0.2s ease",
                          }}
                        />
                      </HtmlTooltip>
                    </Box>
                  );
                })}
              </Box>
            ))}
          </Box>
        </Box>
        
        {/* Legend Section */}
        <Box
          sx={(theme) => ({
            borderTop: `1px solid ${theme.palette.divider}`,
            display: "flex",
            gap: 4,
            px: 3,
            py: 2,
            flexWrap: "wrap",
          })}
        >
          {/* Sick Leave Legend */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Typography
              variant="body2"
              sx={{
                fontSize: "14px",
                fontWeight: 700,
                color: theme => theme.palette.text.primary,
                minWidth: "69px",
              }}
            >
              Sick Leave
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Box
                  sx={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: "#F65160",
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "16px",
                    fontWeight: 400,
                    color: theme => theme.palette.text.primary,
                  }}
                >
                  Approved
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Box
                  sx={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(246, 81, 96, 0.12)",
                    border: "1px solid #F65160",
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "16px",
                    fontWeight: 400,
                    color: theme => theme.palette.text.primary,
                  }}
                >
                  Pending
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Work Remotely Legend */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Typography
              variant="body2"
              sx={{
                fontSize: "14px",
                fontWeight: 700,
                color: theme => theme.palette.text.primary,
                minWidth: "96px",
              }}
            >
              Work remotely
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Box
                  sx={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: "#6D5DD3",
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "16px",
                    fontWeight: 400,
                    color: theme => theme.palette.text.primary,
                  }}
                >
                  Approved
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Box
                  sx={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(109, 93, 211, 0.14)",
                    border: "1px solid #6D5DD3",
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "16px",
                    fontWeight: 400,
                    color: theme => theme.palette.text.primary,
                  }}
                >
                  Pending
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Vacation Legend */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Typography
              variant="body2"
              sx={{
                fontSize: "14px",
                fontWeight: 700,
                color: theme => theme.palette.text.primary,
                minWidth: "57px",
              }}
            >
              Vacation
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Box
                  sx={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: "#15C0E6",
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "16px",
                    fontWeight: 400,
                    color: theme => theme.palette.text.primary,
                  }}
                >
                  Approved
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Box
                  sx={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(21, 192, 230, 0.12)",
                    border: "1px solid #15C0E6",
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "16px",
                    fontWeight: 400,
                    color: theme => theme.palette.text.primary,
                  }}
                >
                  Pending
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Cancelled Legend */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Typography
              variant="body2"
              sx={{
                fontSize: "14px",
                fontWeight: 700,
                color: theme => theme.palette.text.primary,
                minWidth: "70px",
              }}
            >
              Cancelled
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Box
                sx={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: "#9E9E9E",
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  fontSize: "16px",
                  fontWeight: 400,
                  color: theme => theme.palette.text.primary,
                }}
              >
                Cancelled
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default VacationsCalender;
