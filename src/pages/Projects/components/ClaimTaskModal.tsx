import React from "react";
import { Box, Button, IconButton, Typography, SvgIcon } from "@mui/material";
import CloseIcon from "../../../assets/icons/general/close/blue.svg?react";
import Modal from "../../../common/components/Modal/Modal";

interface ClaimTaskModalProps {
  show: boolean;
  onClose: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  isLoading?: boolean;
}

const ClaimTaskModal = ({ show, onClose, onApprove, onReject, isLoading = false }: ClaimTaskModalProps) => {
  const handleApprove = () => {
    onApprove?.();
    // The parent component will handle closing the modal after successful claim
  };

  const handleReject = () => {
    onReject?.();
    onClose();
  };

  return (
    <Modal show={show} onClose={onClose}>
      <Box
        sx={{
          width: "584px",
          height: "518px",
          backgroundColor: "#FFFFFF",
          borderRadius: "24px",
          boxShadow: "0px 6px 58px 0px rgba(121, 145, 173, 0.2)",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Close Button */}
        <Box
          sx={{
            position: "absolute",
            top: "30px",
            right: "30px",
            zIndex: 10,
          }}
        >
          <IconButton
            onClick={onClose}
            sx={{
              backgroundColor: "#F4F9FD",
              borderRadius: "14px",
              width: "44px",
              height: "44px",
              "&:hover": {
                backgroundColor: "#E6EDF5",
              },
            }}
          >
            <SvgIcon component={CloseIcon} />
          </IconButton>
        </Box>

        {/* Illustration Background Container */}
        <Box
          sx={{
            position: "absolute",
            top: "99px",
            left: "60px",
            width: "464px",
            height: "208px",
            borderRadius: "24px",
            overflow: "hidden",
            zIndex: 0,
          }}
        >
          {/* Background gradient with abstract shapes */}
          <Box
            sx={{
              position: "absolute",
              width: "100%",
              height: "100%",
              background: "linear-gradient(180deg, rgba(63, 140, 255, 0.1) 0%, rgba(63, 140, 255, 0.05) 100%)",
              borderRadius: "24px",
              "&::before": {
                content: '""',
                position: "absolute",
                top: "20px",
                left: "20px",
                width: "80px",
                height: "80px",
                background: "rgba(255, 215, 72, 0.15)",
                borderRadius: "50%",
                filter: "blur(20px)",
              },
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: "30px",
                right: "40px",
                width: "60px",
                height: "60px",
                background: "rgba(63, 140, 255, 0.2)",
                borderRadius: "50%",
                filter: "blur(15px)",
              },
            }}
          />
          
          {/* Main illustration elements */}
          <Box
            sx={{
              position: "absolute",
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
              paddingX: "40px",
            }}
          >
            {/* Clipboard (left) */}
            <Box
              sx={{
                position: "relative",
                width: "120px",
                height: "148px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  width: "100px",
                  height: "130px",
                  backgroundColor: "#D1E3FF",
                  borderRadius: "8px",
                  position: "relative",
                  border: "2px solid #B7D3FF",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: "-8px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "40px",
                    height: "8px",
                    backgroundColor: "#D1E3FF",
                    borderRadius: "4px 4px 0 0",
                    border: "2px solid #B7D3FF",
                    borderBottom: "none",
                  },
                }}
              >
                {/* Checklist lines */}
                <Box
                  sx={{
                    position: "absolute",
                    top: "20px",
                    left: "15px",
                    right: "15px",
                    height: "80px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  {[1, 2, 3, 4].map((i) => (
                    <Box
                      key={i}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <Box
                        sx={{
                          width: "12px",
                          height: "12px",
                          border: "2px solid #87AFED",
                          borderRadius: "2px",
                          backgroundColor: i <= 2 ? "#87AFED" : "transparent",
                          position: "relative",
                          "&::after": i <= 2
                            ? {
                                content: '""',
                                position: "absolute",
                                top: "1px",
                                left: "3px",
                                width: "4px",
                                height: "8px",
                                border: "2px solid white",
                                borderTop: "none",
                                borderLeft: "none",
                                transform: "rotate(45deg)",
                              }
                            : {},
                        }}
                      />
                      <Box
                        sx={{
                          flex: 1,
                          height: "2px",
                          backgroundColor: "#A3C2F2",
                          borderRadius: "1px",
                        }}
                      />
                    </Box>
                  ))}
                </Box>
                {/* Pen */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: "10px",
                    right: "15px",
                    width: "4px",
                    height: "20px",
                    backgroundColor: "#6D5DD3",
                    borderRadius: "2px",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: "-4px",
                      right: "-2px",
                      width: "8px",
                      height: "6px",
                      backgroundColor: "#87AFED",
                      clipPath: "polygon(50% 100%, 0 0, 100% 0)",
                    },
                  }}
                />
              </Box>
            </Box>

            {/* Person with laptop (center) */}
            <Box
              sx={{
                position: "relative",
                width: "160px",
                height: "148px",
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
              }}
            >
              {/* Desk */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: "20px",
                  left: "10px",
                  width: "140px",
                  height: "8px",
                  backgroundColor: "#87AFED",
                  borderRadius: "4px",
                }}
              />
              {/* Laptop */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: "28px",
                  left: "30px",
                  width: "80px",
                  height: "50px",
                  backgroundColor: "#3F8CFF",
                  borderRadius: "4px 4px 0 0",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: "-2px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "70px",
                    height: "35px",
                    backgroundColor: "#5AA0FF",
                    borderRadius: "3px",
                  },
                }}
              />
              {/* Person torso */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: "36px",
                  left: "55px",
                  width: "50px",
                  height: "60px",
                  backgroundColor: "#FDC748",
                  borderRadius: "25px 25px 0 0",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: "25px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "40px",
                    height: "35px",
                    backgroundColor: "#ED975D",
                    borderRadius: "20px 20px 0 0",
                  },
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    top: "-15px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "35px",
                    height: "35px",
                    backgroundColor: "#D6A637",
                    borderRadius: "50%",
                  },
                }}
              />
            </Box>

            {/* Stacked documents (right) */}
            <Box
              sx={{
                position: "relative",
                width: "120px",
                height: "148px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Document 1 (back) */}
              <Box
                sx={{
                  position: "absolute",
                  width: "90px",
                  height: "110px",
                  backgroundColor: "#B7D3FF",
                  borderRadius: "6px",
                  transform: "rotate(-3deg)",
                  border: "1px solid #A3C2F2",
                }}
              />
              {/* Document 2 (front with checkmark) */}
              <Box
                sx={{
                  position: "absolute",
                  width: "100px",
                  height: "120px",
                  backgroundColor: "#D1E3FF",
                  borderRadius: "6px",
                  transform: "rotate(2deg)",
                  border: "1px solid #B7D3FF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    width: "30px",
                    height: "30px",
                    backgroundColor: "#00D097",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  },
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    width: "12px",
                    height: "6px",
                    border: "3px solid white",
                    borderTop: "none",
                    borderRight: "none",
                    transform: "rotate(-45deg)",
                    marginTop: "-2px",
                  },
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Content Container */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
            zIndex: 1,
          }}
        >
          {/* Title - positioned at y: 59 according to Figma */}
          <Box
            sx={{
              position: "absolute",
              top: "59px",
              left: "60px",
              right: "60px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "22px",
                lineHeight: 1.364,
                color: "#0A1629",
                textAlign: "center",
                maxWidth: "401px",
              }}
            >
              Are you sure you are claiming this task?
            </Typography>
          </Box>

          {/* Description - positioned at y: 337 according to Figma */}
          <Box
            sx={{
              position: "absolute",
              top: "337px",
              left: "60px",
              right: "60px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{
                fontWeight: 400,
                fontSize: "16px",
                lineHeight: 1.5,
                color: "#0A1629",
                textAlign: "center",
                opacity: 0.7028,
                maxWidth: "401px",
              }}
            >
              The task will be moved to the Completed section and will be closed.
            </Typography>
          </Box>

          {/* Buttons - positioned at y: 415 according to Figma */}
          <Box
            sx={{
              position: "absolute",
              top: "415px",
              left: "60px",
              right: "60px",
              display: "flex",
              justifyContent: "center",
              gap: "30px",
            }}
          >
            <Button
              variant="contained"
              onClick={handleReject}
              disabled={isLoading}
              sx={{
                backgroundColor: "rgba(63, 140, 255, 0.8)",
                color: "#FFFFFF",
                borderRadius: "14px",
                padding: "13px 20px",
                fontWeight: 700,
                fontSize: "16px",
                lineHeight: 1.364,
                minWidth: "141px",
                height: "48px",
                boxShadow: "0px 6px 12px 0px rgba(63, 140, 255, 0.26)",
                "&:hover": {
                  backgroundColor: "rgba(63, 140, 255, 0.9)",
                  boxShadow: "0px 6px 12px 0px rgba(63, 140, 255, 0.42)",
                },
                "&:disabled": {
                  backgroundColor: "#CED5E0",
                  color: "#FFFFFF",
                  boxShadow: "none",
                },
              }}
            >
              Reject Task
            </Button>
            <Button
              variant="contained"
              onClick={handleApprove}
              disabled={isLoading}
              sx={{
                backgroundColor: "#3F8CFF",
                color: "#FFFFFF",
                borderRadius: "14px",
                padding: "13px 20px",
                fontWeight: 700,
                fontSize: "16px",
                lineHeight: 1.364,
                minWidth: "141px",
                height: "48px",
                boxShadow: "0px 6px 12px 0px rgba(63, 140, 255, 0.26)",
                "&:hover": {
                  backgroundColor: "#3A81EB",
                  boxShadow: "0px 6px 12px 0px rgba(63, 140, 255, 0.42)",
                },
                "&:disabled": {
                  backgroundColor: "#CED5E0",
                  color: "#FFFFFF",
                  boxShadow: "none",
                },
              }}
            >
              {isLoading ? "Claiming..." : "Approve Task"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default ClaimTaskModal;
