import { Box, Typography, Button, Avatar, TextField, Chip } from "@mui/material";
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
      sx={{
        background: "#FFFFFF",
        boxShadow: "0px 6px 58px rgba(196, 203, 214, 0.103611)",
        borderRadius: "24px",
        padding: "28px",
        marginTop: "20px",
      }}
    >
      {/* Header with user info and status */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
        <Box sx={{ display: "flex", gap: "18px", alignItems: "center" }}>
          <Avatar 
            sx={{ width: "50px", height: "50px" }}
            src={userAvatar}
          >
            {userName.split(' ').map(n => n[0]).join('')}
          </Avatar>
          <Box>
            <Typography 
              sx={{ 
                fontWeight: 700, 
                fontSize: "16px", 
                lineHeight: "24px",
                color: "#0A1629",
                marginBottom: "2px"
              }}
            >
              {userName}
            </Typography>
            <Typography 
              sx={{ 
                fontSize: "14px", 
                lineHeight: "19px",
                color: "#91929E"
              }}
            >
              {userEmail}
            </Typography>
          </Box>
        </Box>
        <Chip
          label={request.status.toUpperCase()}
          sx={{
            backgroundColor: getStatusColor(request.status),
            color: "#FFFFFF",
            fontWeight: 600,
            fontSize: "12px",
          }}
        />
      </Box>

      {/* Request details */}
      <Box sx={{ marginBottom: "20px" }}>
        <Box sx={{ display: "flex", gap: "24px", marginBottom: "12px", flexWrap: "wrap" }}>
          <Box>
            <Typography 
              sx={{ 
                fontSize: "14px", 
                lineHeight: "19px",
                color: "#91929E",
                marginBottom: "4px"
              }}
            >
              Request Type
            </Typography>
            <Typography 
              sx={{ 
                fontSize: "16px", 
                lineHeight: "24px",
                color: "#0A1629",
                fontWeight: 500
              }}
            >
              {getRequestTypeLabel(request.requestType)}
            </Typography>
          </Box>
          <Box>
            <Typography 
              sx={{ 
                fontSize: "14px", 
                lineHeight: "19px",
                color: "#91929E",
                marginBottom: "4px"
              }}
            >
              Start Date
            </Typography>
            <Typography 
              sx={{ 
                fontSize: "16px", 
                lineHeight: "24px",
                color: "#0A1629",
                fontWeight: 500
              }}
            >
              {formatDate(request.startDate as any)}
            </Typography>
          </Box>
          {request.endDate && (
            <Box>
              <Typography 
                sx={{ 
                  fontSize: "14px", 
                  lineHeight: "19px",
                  color: "#91929E",
                  marginBottom: "4px"
                }}
              >
                End Date
              </Typography>
              <Typography 
                sx={{ 
                  fontSize: "16px", 
                  lineHeight: "24px",
                  color: "#0A1629",
                  fontWeight: 500
                }}
              >
                {formatDate(request.endDate as any)}
              </Typography>
            </Box>
          )}
          <Box>
            <Typography 
              sx={{ 
                fontSize: "14px", 
                lineHeight: "19px",
                color: "#91929E",
                marginBottom: "4px"
              }}
            >
              Duration
            </Typography>
            <Typography 
              sx={{ 
                fontSize: "16px", 
                lineHeight: "24px",
                color: "#0A1629",
                fontWeight: 500
              }}
            >
              {request.duration} {request.durationType}
            </Typography>
          </Box>
          {request.workingHours && (
            <Box>
              <Typography 
                sx={{ 
                  fontSize: "14px", 
                  lineHeight: "19px",
                  color: "#91929E",
                  marginBottom: "4px"
                }}
              >
                Working Hours
              </Typography>
              <Typography 
                sx={{ 
                  fontSize: "16px", 
                  lineHeight: "24px",
                  color: "#0A1629",
                  fontWeight: 500
                }}
              >
                {request.workingHours.from} - {request.workingHours.to}
              </Typography>
            </Box>
          )}
        </Box>
        
        {request.comments && (
          <Box sx={{ marginTop: "16px" }}>
            <Typography 
              sx={{ 
                fontSize: "14px", 
                lineHeight: "19px",
                color: "#91929E",
                marginBottom: "4px"
              }}
            >
              Comments
            </Typography>
            <Typography 
              sx={{ 
                fontSize: "16px", 
                lineHeight: "24px",
                color: "#0A1629",
              }}
            >
              {request.comments}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Action buttons - only show for pending requests */}
      {request.status === "pending" && (
        <Box sx={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
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
                }}
              >
                Reject
              </Button>
              <Button
                variant="outlined"
                onClick={() => setShowCommentField(true)}
                disabled={isLoading}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  borderColor: "#91929E",
                  color: "#91929E",
                  "&:hover": {
                    borderColor: "#0A1629",
                    color: "#0A1629",
                  },
                }}
              >
                Add Comment
              </Button>
            </>
          )}
          {showCommentField && (
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: "12px" }}>
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
              <Box sx={{ display: "flex", gap: "12px" }}>
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

