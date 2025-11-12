import { Box, Typography, Button, Avatar, TextField, Chip, useTheme, useMediaQuery } from "@mui/material";
import { Check as CheckIcon, Close as CloseIcon } from "@mui/icons-material";
import { useState } from "react";
import type { VacationResponse } from "../../../store/types/Vacation/VacationTypes";

interface VacationRequestCardProps {
  request: VacationResponse;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  onApprove: (requestId: string, reviewComments?: string) => void;
  onReject: (requestId: string, reviewComments?: string) => void;
  isLoading?: boolean;
}

const VacationRequestCard = ({
  request,
  userName,
  userEmail,
  userAvatar,
  onApprove,
  onReject,
  isLoading = false,
}: VacationRequestCardProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [reviewComments, setReviewComments] = useState("");
  const [showCommentField, setShowCommentField] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "#4CAF50";
      case "rejected":
        return "#F44336";
      default:
        return "#FF9800";
    }
  };

  const getRequestTypeLabel = (type: string) => {
    switch (type) {
      case "vacation":
        return "Vacation";
      case "sick_leave":
        return "Sick Leave";
      case "work_remotely":
        return "Work Remotely";
      default:
        return type;
    }
  };

  const formatDate = (dateValue: string | { _seconds: number; _nanoseconds?: number } | undefined) => {
    if (!dateValue) {
      return "N/A";
    }

    try {
      let dateObj: Date;
      
      // Handle Firestore timestamp objects with _seconds and _nanoseconds
      if (typeof dateValue === 'object' && dateValue !== null && '_seconds' in dateValue) {
        const timestamp = dateValue as { _seconds: number; _nanoseconds?: number };
        // Convert Firestore timestamp to Date (seconds * 1000 for milliseconds)
        dateObj = new Date(timestamp._seconds * 1000 + (timestamp._nanoseconds || 0) / 1000000);
      } 
      // Handle Firestore timestamp objects with toDate method
      else if (typeof dateValue === 'object' && dateValue !== null && 'toDate' in dateValue && typeof (dateValue as { toDate: () => Date }).toDate === 'function') {
        dateObj = (dateValue as { toDate: () => Date }).toDate();
      } 
      // Handle string dates
      else if (typeof dateValue === 'string') {
        dateObj = new Date(dateValue);
      } else {
        return "N/A";
      }

      // Check if date is valid
      if (isNaN(dateObj.getTime())) {
        return "Invalid Date";
      }

      return dateObj.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  const handleApprove = () => {
    if (showCommentField && reviewComments.trim()) {
      onApprove(request.id, reviewComments);
    } else {
      onApprove(request.id);
    }
    setReviewComments("");
    setShowCommentField(false);
  };

  const handleReject = () => {
    if (showCommentField && reviewComments.trim()) {
      onReject(request.id, reviewComments);
    } else {
      onReject(request.id);
    }
    setReviewComments("");
    setShowCommentField(false);
  };

  return (
    <Box
      sx={(theme) => ({
        background: theme.palette.background.paper,
        boxShadow: theme.shadows[1],
        borderRadius: { xs: "24px", md: "24px" },
        padding: { xs: "20px 18px", md: "28px" },
        marginTop: { xs: "16px", md: "20px" },
      })}
    >
      {/* Header with user info and status */}
      <Box sx={{ 
        display: "flex", 
        flexDirection: { xs: "column", md: "row" },
        justifyContent: { xs: "flex-start", md: "space-between" }, 
        alignItems: { xs: "flex-start", md: "flex-start" }, 
        gap: { xs: "12px", md: 0 },
        marginBottom: { xs: "16px", md: "20px" } 
      }}>
        <Box sx={{ display: "flex", gap: { xs: "12px", md: "18px" }, alignItems: "center", width: "100%" }}>
          <Avatar 
            sx={{ width: { xs: "40px", md: "50px" }, height: { xs: "40px", md: "50px" } }}
            src={userAvatar}
          >
            {userName.split(' ').map(n => n[0]).join('')}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography 
              sx={(theme) => ({ 
                fontWeight: 700, 
                fontSize: { xs: "14px", md: "16px" }, 
                lineHeight: { xs: "20px", md: "24px" },
                color: theme.palette.text.primary,
                marginBottom: "2px"
              })}
            >
              {userName}
            </Typography>
            <Typography 
              sx={(theme) => ({ 
                fontSize: { xs: "12px", md: "14px" }, 
                lineHeight: { xs: "16px", md: "19px" },
                color: theme.palette.text.secondary
              })}
            >
              {userEmail}
            </Typography>
          </Box>
        </Box>
        <Chip
          label={request.status.toUpperCase()}
          sx={(theme) => ({
            backgroundColor: getStatusColor(request.status),
            color: theme.palette.getContrastText(getStatusColor(request.status)),
            fontWeight: 600,
            fontSize: { xs: "10px", md: "12px" },
            alignSelf: { xs: "flex-start", md: "auto" }
          })}
        />
      </Box>

      {/* Request details */}
      <Box sx={{ marginBottom: { xs: "16px", md: "20px" } }}>
        <Box sx={{ 
          display: "flex", 
          gap: { xs: "16px", md: "24px" }, 
          marginBottom: { xs: "10px", md: "12px" }, 
          flexWrap: "wrap" 
        }}>
          <Box sx={{ minWidth: { xs: "calc(50% - 8px)", md: "auto" } }}>
            <Typography 
              sx={(theme) => ({ 
                fontSize: { xs: "12px", md: "14px" }, 
                lineHeight: { xs: "16px", md: "19px" },
                color: theme.palette.text.secondary,
                marginBottom: "4px"
              })}
            >
              Request Type
            </Typography>
            <Typography 
              sx={(theme) => ({ 
                fontSize: { xs: "14px", md: "16px" }, 
                lineHeight: { xs: "20px", md: "24px" },
                color: theme.palette.text.primary,
                fontWeight: 500
              })}
            >
              {getRequestTypeLabel(request.requestType)}
            </Typography>
          </Box>
          <Box sx={{ minWidth: { xs: "calc(50% - 8px)", md: "auto" } }}>
            <Typography 
              sx={(theme) => ({ 
                fontSize: { xs: "12px", md: "14px" }, 
                lineHeight: { xs: "16px", md: "19px" },
                color: theme.palette.text.secondary,
                marginBottom: "4px"
              })}
            >
              Start Date
            </Typography>
            <Typography 
              sx={(theme) => ({ 
                fontSize: { xs: "14px", md: "16px" }, 
                lineHeight: { xs: "20px", md: "24px" },
                color: theme.palette.text.primary,
                fontWeight: 500
              })}
            >
              {formatDate(request.startDate as any)}
            </Typography>
          </Box>
          {request.endDate && (
            <Box sx={{ minWidth: { xs: "calc(50% - 8px)", md: "auto" } }}>
              <Typography 
                sx={(theme) => ({ 
                  fontSize: { xs: "12px", md: "14px" }, 
                  lineHeight: { xs: "16px", md: "19px" },
                  color: theme.palette.text.secondary,
                  marginBottom: "4px"
                })}
              >
                End Date
              </Typography>
              <Typography 
                sx={(theme) => ({ 
                  fontSize: { xs: "14px", md: "16px" }, 
                  lineHeight: { xs: "20px", md: "24px" },
                  color: theme.palette.text.primary,
                  fontWeight: 500
                })}
              >
                {formatDate(request.endDate as any)}
              </Typography>
            </Box>
          )}
          <Box sx={{ minWidth: { xs: "calc(50% - 8px)", md: "auto" } }}>
            <Typography 
              sx={(theme) => ({ 
                fontSize: { xs: "12px", md: "14px" }, 
                lineHeight: { xs: "16px", md: "19px" },
                color: theme.palette.text.secondary,
                marginBottom: "4px"
              })}
            >
              Duration
            </Typography>
            <Typography 
              sx={(theme) => ({ 
                fontSize: { xs: "14px", md: "16px" }, 
                lineHeight: { xs: "20px", md: "24px" },
                color: theme.palette.text.primary,
                fontWeight: 500
              })}
            >
              {request.duration} {request.durationType}
            </Typography>
          </Box>
          {request.workingHours && (
            <Box sx={{ minWidth: { xs: "calc(50% - 8px)", md: "auto" } }}>
              <Typography 
                sx={(theme) => ({ 
                  fontSize: { xs: "12px", md: "14px" }, 
                  lineHeight: { xs: "16px", md: "19px" },
                  color: theme.palette.text.secondary,
                  marginBottom: "4px"
                })}
              >
                Working Hours
              </Typography>
              <Typography 
                sx={(theme) => ({ 
                  fontSize: { xs: "14px", md: "16px" }, 
                  lineHeight: { xs: "20px", md: "24px" },
                  color: theme.palette.text.primary,
                  fontWeight: 500
                })}
              >
                {request.workingHours.from} - {request.workingHours.to}
              </Typography>
            </Box>
          )}
        </Box>
        
        {request.comments && (
          <Box sx={{ marginTop: { xs: "12px", md: "16px" } }}>
            <Typography 
              sx={(theme) => ({ 
                fontSize: { xs: "12px", md: "14px" }, 
                lineHeight: { xs: "16px", md: "19px" },
                color: theme.palette.text.secondary,
                marginBottom: "4px"
              })}
            >
              Comments
            </Typography>
            <Typography 
              sx={(theme) => ({ 
                fontSize: { xs: "14px", md: "16px" }, 
                lineHeight: { xs: "20px", md: "24px" },
                color: theme.palette.text.primary,
              })}
            >
              {request.comments}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Action buttons - only show for pending requests */}
      {request.status === "pending" && (
        <Box sx={{ 
          display: "flex", 
          flexDirection: { xs: "column", md: "row" },
          gap: { xs: "8px", md: "12px" }, 
          alignItems: { xs: "stretch", md: "flex-start" } 
        }}>
          {!showCommentField && (
            <>
              <Button
                variant="contained"
                startIcon={<CheckIcon />}
                onClick={handleApprove}
                disabled={isLoading}
                sx={{
                  backgroundColor: "#4CAF50",
                  "&:hover": {
                    backgroundColor: "#45a049",
                  },
                  textTransform: "none",
                  fontWeight: 600,
                  width: { xs: "100%", md: "auto" },
                }}
              >
                Approve
              </Button>
              <Button
                variant="contained"
                startIcon={<CloseIcon />}
                onClick={handleReject}
                disabled={isLoading}
                sx={{
                  backgroundColor: "#F44336",
                  "&:hover": {
                    backgroundColor: "#da190b",
                  },
                  textTransform: "none",
                  fontWeight: 600,
                  width: { xs: "100%", md: "auto" },
                }}
              >
                Reject
              </Button>
              <Button
                variant="outlined"
                onClick={() => setShowCommentField(true)}
                disabled={isLoading}
                sx={(theme) => ({
                  textTransform: "none",
                  fontWeight: 600,
                  borderColor: theme.palette.text.secondary,
                  color: theme.palette.text.secondary,
                  "&:hover": {
                    borderColor: theme.palette.text.primary,
                    color: theme.palette.text.primary,
                  },
                  width: { xs: "100%", md: "auto" },
                })}
              >
                Add Comment
              </Button>
            </>
          )}
          {showCommentField && (
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: { xs: "8px", md: "12px" }, width: "100%" }}>
              <TextField
                multiline
                rows={3}
                placeholder="Add review comments (optional)"
                value={reviewComments}
                onChange={(e) => setReviewComments(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                }}
              />
              <Box sx={{ 
                display: "flex", 
                flexDirection: { xs: "column", md: "row" },
                gap: { xs: "8px", md: "12px" } 
              }}>
                <Button
                  variant="contained"
                  startIcon={<CheckIcon />}
                  onClick={handleApprove}
                  disabled={isLoading}
                  sx={{
                    backgroundColor: "#4CAF50",
                    "&:hover": {
                      backgroundColor: "#45a049",
                    },
                    textTransform: "none",
                    fontWeight: 600,
                    width: { xs: "100%", md: "auto" },
                  }}
                >
                  Approve
                </Button>
                <Button
                  variant="contained"
                  startIcon={<CloseIcon />}
                  onClick={handleReject}
                  disabled={isLoading}
                  sx={{
                    backgroundColor: "#F44336",
                    "&:hover": {
                      backgroundColor: "#da190b",
                    },
                    textTransform: "none",
                    fontWeight: 600,
                    width: { xs: "100%", md: "auto" },
                  }}
                >
                  Reject
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setShowCommentField(false);
                    setReviewComments("");
                  }}
                  disabled={isLoading}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    width: { xs: "100%", md: "auto" },
                  }}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default VacationRequestCard;

