import { useState, useRef, useEffect, useCallback } from "react";
import {
  Avatar,
  Box,
  Button,
  Drawer,
  IconButton,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Close as CloseIcon, Send } from "@mui/icons-material";
import { InsertEmoticon, AlternateEmail } from "@mui/icons-material";
import EmojiPicker, { type EmojiClickData, Theme } from "emoji-picker-react";
import AttachIcon from "../../../assets/icons/general/attach/dark.svg?react";
import AddLinkIcon from "../../../assets/icons/general/addlink/dark.svg?react";
import { SvgIcon } from "@mui/material";
import { useAppDispatch, useAppSelector, type RootState } from "../../../store/store";
import { fetchActivityLogReplies, postActivityLogReply } from "../../../store/features/activityLogReplies/activityLogRepliesAction";
import { 
  createReplySuccess,
  getRepliesSuccess,
  createReplyFailed,
  getRepliesFailed,
} from "../../../store/features/activityLogReplies/activityLogRepliesSlice";
import type { ActivityLog } from "../../../store/types/Task/TaskTypes";
import { parseFirebaseTimestamp } from "../utils/taskUtils";
import { useNotifications } from "../../../contexts/NotificationContext";
import { useUserPresence } from "../../../hooks/useUserPresence";

interface ActivityLogThreadSidebarProps {
  open: boolean;
  onClose: () => void;
  activityLog: ActivityLog;
}

const ActivityLogThreadSidebar = ({
  open,
  onClose,
  activityLog,
}: ActivityLogThreadSidebarProps) => {
  const dispatch = useAppDispatch();
  const [replyText, setReplyText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [typingUsers, setTypingUsers] = useState<Map<string, { userId: string; userName: string }>>(new Map());
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastTypingSentRef = useRef<number>(0);

  const repliesState = useAppSelector(
    (state: RootState) => state.activityLogRepliesReducer
  );

  const userState = useAppSelector((state: RootState) => state.userReducer);
  const { users } = userState;
  const currentUser = useAppSelector((state: RootState) => state.userReducer.currentUser);
  const { onEvent, offEvent, sendMessage } = useNotifications();
  const { isUserOnline } = useUserPresence();

  const replies = repliesState.repliesByActivityLog[activityLog.id] || [];
  const loading = repliesState.loading[activityLog.id] || false;
  const creating = repliesState.creating[activityLog.id] || false;
  const error = repliesState.error[activityLog.id];

  // Fetch replies when sidebar opens via WebSocket
  useEffect(() => {
    if (open && activityLog.id && sendMessage) {
      dispatch(fetchActivityLogReplies(activityLog.id, sendMessage));
    }
  }, [open, activityLog.id, dispatch, sendMessage]);

  // Listen for WebSocket events for replies
  useEffect(() => {
    // Handle new reply created
    const handleReplyCreated = (data: { 
      activityLogId?: string; 
      reply?: any;
    }) => {
      console.log("[ActivityLogThreadSidebar] WebSocket reply created event:", data);
      if (data.activityLogId && data.activityLogId === activityLog.id && data.reply) {
        // Add the new reply to the state (slice will handle duplicate prevention)
        dispatch(createReplySuccess({ activityLogId: data.activityLogId, reply: data.reply }));
      }
    };

    // Handle replies response (initial load or refresh)
    const handleRepliesResponse = (data: { 
      activityLogId?: string; 
      replies?: any[];
    }) => {
      console.log("[ActivityLogThreadSidebar] WebSocket replies response:", data);
      if (data.activityLogId && data.activityLogId === activityLog.id && data.replies) {
        dispatch(getRepliesSuccess({ activityLogId: data.activityLogId, replies: data.replies }));
      }
    };

    // Handle errors
    const handleError = (data: { error?: string; messageId?: string }) => {
      if (data.messageId === "activity-log:reply:create" || data.messageId === "activity-log:replies:request") {
        console.error("[ActivityLogThreadSidebar] WebSocket error:", data.error);
        dispatch(createReplyFailed({ activityLogId: activityLog.id, error: data.error || "Unknown error" }));
        dispatch(getRepliesFailed({ activityLogId: activityLog.id, error: data.error || "Unknown error" }));
      }
    };

    // Handle typing indicators
    const handleTypingStart = (data: { 
      activityLogId?: string; 
      userId?: string;
      userName?: string;
    }) => {
      if (data.activityLogId === activityLog.id && data.userId && data.userId !== currentUser?.id) {
        setTypingUsers((prev) => {
          const newMap = new Map(prev);
          newMap.set(data.userId!, { userId: data.userId!, userName: data.userName || "Someone" });
          return newMap;
        });
        
        // Auto-remove typing indicator after 5 seconds if stop event doesn't arrive
        setTimeout(() => {
          setTypingUsers((prev) => {
            const newMap = new Map(prev);
            newMap.delete(data.userId!);
            return newMap;
          });
        }, 5000);
      }
    };

    const handleTypingStop = (data: { 
      activityLogId?: string; 
      userId?: string;
    }) => {
      if (data.activityLogId === activityLog.id && data.userId) {
        setTypingUsers((prev) => {
          const newMap = new Map(prev);
          newMap.delete(data.userId!);
          return newMap;
        });
      }
    };

    onEvent("activity-log:reply:created", handleReplyCreated);
    onEvent("activity-log:replies:response", handleRepliesResponse);
    onEvent("activity-log:typing:start", handleTypingStart);
    onEvent("activity-log:typing:stop", handleTypingStop);
    onEvent("error", handleError);

    // Cleanup
    return () => {
      offEvent("activity-log:reply:created", handleReplyCreated);
      offEvent("activity-log:replies:response", handleRepliesResponse);
      offEvent("activity-log:typing:start", handleTypingStart);
      offEvent("activity-log:typing:stop", handleTypingStop);
      offEvent("error", handleError);
    };
  }, [activityLog.id, dispatch, onEvent, offEvent, currentUser?.id]);

  // Scroll to bottom when replies change or typing indicator appears
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [replies, typingUsers.size]);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        emojiButtonRef.current &&
        !emojiPickerRef.current.contains(event.target as Node) &&
        !emojiButtonRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);

  // Send typing indicator when user types
  const sendTypingIndicator = useCallback((isTyping: boolean) => {
    if (!sendMessage || !activityLog.id) return;
    
    const now = Date.now();
    // Throttle typing events to avoid spam (send at most once per 2 seconds)
    if (isTyping && now - lastTypingSentRef.current < 2000) {
      return;
    }
    
    lastTypingSentRef.current = now;
    
    sendMessage({
      type: isTyping ? "activity-log:typing:start" : "activity-log:typing:stop",
      data: { activityLogId: activityLog.id },
    });
  }, [sendMessage, activityLog.id]);

  const handleReplyChange = (value: string) => {
    setReplyText(value);
    
    // Send typing start when user starts typing
    if (value.length > 0 && typingTimeoutRef.current === null) {
      sendTypingIndicator(true);
    }
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Send typing stop after 3 seconds of no typing
    typingTimeoutRef.current = setTimeout(() => {
      sendTypingIndicator(false);
      typingTimeoutRef.current = null;
    }, 3000);
  };

  // Cleanup typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      // Send typing stop when component unmounts
      sendTypingIndicator(false);
    };
  }, [sendTypingIndicator]);

  const handleSubmitReply = async () => {
    if (!replyText.trim() || creating || !sendMessage) return;

    // Stop typing indicator
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    sendTypingIndicator(false);

    try {
      dispatch(postActivityLogReply(activityLog.id, replyText.trim(), sendMessage));
      setReplyText("");
      setSelectedFiles([]);
    } catch (err) {
      // Error is handled by Redux
      console.error("Failed to post reply:", err);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setReplyText((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker((prev) => !prev);
  };

  const activityDate = parseFirebaseTimestamp(activityLog.timestamp);
  const formattedDate = activityDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const formattedTime = activityDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: "480px", md: "520px" },
          maxWidth: "100vw",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          backgroundColor: "#FFFFFF",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 24px",
            borderBottom: "1px solid #E4E6E8",
            backgroundColor: "#FFFFFF",
            boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.05)",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "18px", color: "#0A1629" }}>
            Thread
          </Typography>
          <IconButton 
            onClick={onClose} 
            size="small"
            sx={{
              color: "#7D8592",
              "&:hover": {
                backgroundColor: "#F4F9FD",
                color: "#0A1629",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Activity Log Header */}
        <Box
          sx={{
            padding: "20px 24px",
            borderBottom: "1px solid #E4E6E8",
            backgroundColor: "#F9FAFB",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "12px" }}>
            <Box sx={{ position: "relative", display: "inline-block", flexShrink: 0 }}>
              <Avatar 
                sx={{ 
                  width: "40px", 
                  height: "40px",
                  backgroundColor: "#3F8CFF",
                  color: "#FFFFFF",
                  fontWeight: 600,
                  fontSize: "16px",
                }}
              >
                {activityLog.userName?.charAt(0).toUpperCase() || "U"}
              </Avatar>
              {/* Online/Offline Status Dot */}
              {activityLog.userId && (
                <Box
                  sx={{
                    position: "absolute",
                    bottom: "0",
                    right: "0",
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: isUserOnline(activityLog.userId) ? "#10B981" : "#9CA3AF",
                    border: "2px solid #FFFFFF",
                    boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.1)",
                    transition: "background-color 0.3s ease",
                  }}
                />
              )}
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography fontWeight={600} fontSize="14px" color="#0A1629">
                {activityLog.userName || "Unknown User"}
              </Typography>
              <Typography color="#7D8592" fontSize="12px" sx={{ mt: 0.5 }}>
                {formattedDate} | {formattedTime}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              background: "#FFFFFF",
              borderRadius: "12px",
              padding: "14px 16px",
              border: "1px solid #E4E6E8",
              marginLeft: "52px",
              boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.04)",
            }}
          >
            <Typography fontSize="14px" color="#0A1629" sx={{ lineHeight: 1.5 }}>
              {activityLog.description}
            </Typography>
          </Box>
        </Box>

        {/* Replies List */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            padding: "20px 24px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "40px",
              }}
            >
              <CircularProgress size={32} />
            </Box>
          ) : replies.length === 0 ? (
            <Box
              sx={{
                textAlign: "center",
                padding: "40px 20px",
                color: "secondary.main",
              }}
            >
              <Typography fontSize="14px">No replies yet</Typography>
              <Typography fontSize="12px" sx={{ mt: 1 }}>
                Be the first to reply!
              </Typography>
            </Box>
          ) : (
            replies.map((reply) => {
              const replyDate = new Date(reply.createdAt);
              const replyFormattedDate = replyDate.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              });
              const replyFormattedTime = replyDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });

              const replyUser = reply.createdByUser || 
                users.find((u) => u.id === reply.createdBy);
              const replyUserId = reply.createdBy || reply.createdByUser?.id;

              return (
                <Box
                  key={reply.id}
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                    transition: "opacity 0.2s",
                    "&:hover": {
                      opacity: 0.9,
                    },
                  }}
                >
                  <Box sx={{ position: "relative", display: "inline-block", flexShrink: 0 }}>
                    <Avatar 
                      sx={{ 
                        width: "36px", 
                        height: "36px",
                        backgroundColor: "#3F8CFF",
                        color: "#FFFFFF",
                        fontWeight: 600,
                        fontSize: "14px",
                      }}
                    >
                      {replyUser?.name?.charAt(0).toUpperCase() || "U"}
                    </Avatar>
                    {/* Online/Offline Status Dot */}
                    {replyUserId && (
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: "0",
                          right: "0",
                          width: "10px",
                          height: "10px",
                          borderRadius: "50%",
                          backgroundColor: isUserOnline(replyUserId) ? "#10B981" : "#9CA3AF",
                          border: "2px solid #FFFFFF",
                          boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.1)",
                          transition: "background-color 0.3s ease",
                        }}
                      />
                    )}
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        mb: 0.5,
                      }}
                    >
                      <Typography fontWeight={600} fontSize="14px" color="#0A1629">
                        {replyUser?.name || "Unknown User"}
                      </Typography>
                      <Typography color="#7D8592" fontSize="12px">
                        {replyFormattedDate} | {replyFormattedTime}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        background: "#F4F9FD",
                        borderRadius: "12px",
                        padding: "12px 16px",
                        border: "1px solid #E4E6E8",
                        boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.04)",
                      }}
                    >
                      <Typography 
                        fontSize="14px" 
                        color="#0A1629"
                        sx={{ 
                          whiteSpace: "pre-wrap",
                          lineHeight: 1.5,
                          wordBreak: "break-word",
                        }}
                      >
                        {reply.message}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              );
            })
          )}
          
          {/* Typing Indicator */}
          {typingUsers.size > 0 && (
            <Box
              sx={{
                display: "flex",
                gap: "12px",
                alignItems: "center",
                padding: "8px 0",
                opacity: 0.7,
              }}
            >
              <Box
                sx={{
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    gap: "4px",
                    "& > div": {
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      backgroundColor: "#7D8592",
                      animation: "typing 1.4s infinite ease-in-out",
                      "&:nth-of-type(1)": {
                        animationDelay: "0s",
                      },
                      "&:nth-of-type(2)": {
                        animationDelay: "0.2s",
                      },
                      "&:nth-of-type(3)": {
                        animationDelay: "0.4s",
                      },
                    },
                    "@keyframes typing": {
                      "0%, 60%, 100%": {
                        transform: "translateY(0)",
                        opacity: 0.7,
                      },
                      "30%": {
                        transform: "translateY(-10px)",
                        opacity: 1,
                      },
                    },
                  }}
                >
                  <div />
                  <div />
                  <div />
                </Box>
              </Box>
              <Typography
                fontSize="13px"
                color="secondary.main"
                sx={{ fontStyle: "italic" }}
              >
                {Array.from(typingUsers.values())
                  .map((u) => u.userName)
                  .join(", ")}{" "}
                {typingUsers.size === 1 ? "is" : "are"} typing...
              </Typography>
            </Box>
          )}
          
          <div ref={messagesEndRef} />
        </Box>

        {/* Reply Input */}
        <Box
          sx={{
            padding: "16px 24px",
            borderTop: "1px solid #E4E6E8",
            backgroundColor: "#FFFFFF",
          }}
        >
          {error && (
            <Typography
              color="error"
              fontSize="12px"
              sx={{ mb: 1, textAlign: "center" }}
            >
              {error}
            </Typography>
          )}
          <Box
            sx={{
              position: "relative",
              width: "100%",
              minHeight: "56px",
              backgroundColor: "#FFFFFF",
              borderRadius: "16px",
              border: "1px solid #E4E6E8",
              boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.06)",
              display: "flex",
              alignItems: "center",
              padding: "0 12px",
              transition: "border-color 0.2s, box-shadow 0.2s",
              "&:focus-within": {
                borderColor: "#3F8CFF",
                boxShadow: "0px 2px 12px rgba(63, 140, 255, 0.15)",
              },
            }}
          >
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              style={{ display: "none" }}
              onChange={handleFileSelect}
              accept="*/*"
            />

            {/* Left Icons */}
            <IconButton
              size="small"
              sx={{
                width: "24px",
                height: "24px",
                padding: 0,
                marginRight: "12px",
                color: "#6D5DD3",
              }}
              onClick={handleAttachClick}
              title="Attach file"
            >
              <SvgIcon component={AttachIcon} sx={{ fontSize: "24px" }} />
            </IconButton>
            {selectedFiles.length > 0 && (
              <Typography
                fontSize="10px"
                color="secondary.main"
                sx={{ marginRight: "8px" }}
              >
                {selectedFiles.length} file{selectedFiles.length > 1 ? "s" : ""}
              </Typography>
            )}

            <IconButton
              size="small"
              sx={{
                width: "24px",
                height: "24px",
                padding: 0,
                marginRight: "12px",
                color: "#15C0E6",
              }}
              onClick={() => {
                // Placeholder - no functionality
                console.log("Add link clicked");
              }}
              title="Add link"
            >
              <SvgIcon component={AddLinkIcon} sx={{ fontSize: "24px" }} />
            </IconButton>

            {/* Text Input */}
            <TextField
              fullWidth
              placeholder="Type your message here…"
              value={replyText}
              onChange={(e) => handleReplyChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && replyText.trim()) {
                  e.preventDefault();
                  handleSubmitReply();
                }
              }}
              disabled={creating}
              sx={{
                flex: 1,
                "& .MuiOutlinedInput-root": {
                  border: "none",
                  backgroundColor: "transparent",
                  "& fieldset": {
                    border: "none",
                  },
                  "&:hover fieldset": {
                    border: "none",
                  },
                  "&.Mui-focused": {
                    backgroundColor: "transparent",
                    "& fieldset": {
                      border: "none",
                    },
                  },
                  fontSize: "16px",
                  fontFamily: '"Nunito Sans", sans-serif',
                  color: "#000000",
                  "&::placeholder": {
                    color: "#7D8592",
                    opacity: 1,
                  },
                },
                "& .MuiInputBase-input": {
                  padding: "0",
                  height: "22px",
                  lineHeight: "22px",
                },
              }}
            />

            {/* Right Icons */}
            <IconButton
              size="small"
              sx={{
                width: "24px",
                height: "24px",
                padding: 0,
                marginRight: "12px",
                color: "#3F8CFF",
              }}
              onClick={() => {
                // Placeholder - no functionality
                console.log("Mention clicked");
              }}
              title="Mention user"
            >
              <AlternateEmail sx={{ fontSize: "20px" }} />
            </IconButton>

            <Box sx={{ position: "relative" }}>
              <IconButton
                ref={emojiButtonRef}
                size="small"
                sx={{
                  width: "24px",
                  height: "24px",
                  padding: 0,
                  marginRight: "16px",
                  color: "#FDC748",
                }}
                onClick={toggleEmojiPicker}
              >
                <InsertEmoticon sx={{ fontSize: "22px" }} />
              </IconButton>

              {/* Emoji Picker */}
              {showEmojiPicker && (
                <Box
                  ref={emojiPickerRef}
                  sx={{
                    position: "absolute",
                    bottom: "100%",
                    right: 0,
                    marginBottom: "8px",
                    zIndex: 1000,
                    "& .EmojiPickerReact": {
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #E4E6E8",
                      borderRadius: "14px",
                      boxShadow: "0px 6px 24px rgba(0, 0, 0, 0.15)",
                    },
                  }}
                >
                  <EmojiPicker
                    onEmojiClick={handleEmojiClick}
                    width={350}
                    height={400}
                    theme={Theme.LIGHT}
                    previewConfig={{
                      showPreview: false,
                    }}
                    searchDisabled={false}
                  />
                </Box>
              )}
            </Box>

            {/* Send Button */}
            <Button
              onClick={handleSubmitReply}
              disabled={!replyText.trim() || creating}
              sx={{
                minWidth: "56px",
                width: "56px",
                height: "44px",
                backgroundColor: "#3F8CFF",
                borderRadius: "14px",
                boxShadow: "0px 6px 12px 0px rgba(63, 140, 255, 0.26)",
                "&:hover": {
                  backgroundColor: "#3A81EB",
                  boxShadow: "0px 6px 12px 0px rgba(63, 140, 255, 0.42)",
                },
                "&:disabled": {
                  backgroundColor: "#D8E0F0",
                  boxShadow: "none",
                },
                padding: 0,
              }}
              title="Send reply"
            >
              {creating ? (
                <CircularProgress size={20} sx={{ color: "#FFFFFF" }} />
              ) : (
                <Send sx={{ color: "#FFFFFF", fontSize: "24px" }} />
              )}
            </Button>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default ActivityLogThreadSidebar;

