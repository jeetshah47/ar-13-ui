import { useState, useRef, useEffect } from "react";
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
import { addReplyToCache } from "../../../store/features/activityLogReplies/activityLogRepliesSlice";
import type { ActivityLog } from "../../../store/types/Task/TaskTypes";
import { parseFirebaseTimestamp } from "../utils/taskUtils";
import { useNotifications } from "../../../contexts/NotificationContext";

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

  const repliesState = useAppSelector(
    (state: RootState) => state.activityLogRepliesReducer
  );

  const userState = useAppSelector((state: RootState) => state.userReducer);
  const { users } = userState;
  const { onEvent, offEvent } = useNotifications();

  const replies = repliesState.repliesByActivityLog[activityLog.id] || [];
  const loading = repliesState.loading[activityLog.id] || false;
  const creating = repliesState.creating[activityLog.id] || false;
  const error = repliesState.error[activityLog.id];

  // Fetch replies when sidebar opens
  useEffect(() => {
    if (open && activityLog.id) {
      dispatch(fetchActivityLogReplies(activityLog.id));
    }
  }, [open, activityLog.id, dispatch]);

  // Listen for SSE events for new replies
  useEffect(() => {
    const handleReplyAdded = (data: { activityLogId?: string; replyId?: string }) => {
      console.log("[ActivityLogThreadSidebar] SSE event received:", data);
      if (data.activityLogId && data.activityLogId === activityLog.id) {
        // Re-fetch replies for this activity log
        console.log("[ActivityLogThreadSidebar] Re-fetching replies for activityLogId:", data.activityLogId);
        dispatch(fetchActivityLogReplies(data.activityLogId));
      }
    };

    onEvent("activity-log:reply-added", handleReplyAdded);

    // Cleanup
    return () => {
      offEvent("activity-log:reply-added", handleReplyAdded);
    };
  }, [activityLog.id, dispatch, onEvent, offEvent]);

  // Scroll to bottom when replies change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [replies]);

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

  const handleReplyChange = (value: string) => {
    setReplyText(value);
  };

  const handleSubmitReply = async () => {
    if (!replyText.trim() || creating) return;

    try {
      await dispatch(postActivityLogReply(activityLog.id, replyText.trim()));
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
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "18px" }}>
            Thread
          </Typography>
          <IconButton onClick={onClose} size="small">
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
          <Box sx={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
            <Avatar sx={{ width: "40px", height: "40px" }}>
              {activityLog.userName?.charAt(0).toUpperCase() || "U"}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography fontWeight={600} fontSize="14px">
                {activityLog.userName || "Unknown User"}
              </Typography>
              <Typography color="secondary.main" fontSize="12px">
                {formattedDate} | {formattedTime}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              background: "#FFFFFF",
              borderRadius: "12px",
              padding: "12px 16px",
              border: "1px solid #E4E6E8",
              marginLeft: "52px",
            }}
          >
            <Typography fontSize="14px">{activityLog.description}</Typography>
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

              return (
                <Box
                  key={reply.id}
                  sx={{
                    display: "flex",
                    gap: "12px",
                  }}
                >
                  <Avatar sx={{ width: "32px", height: "32px" }}>
                    {replyUser?.name?.charAt(0).toUpperCase() || "U"}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        mb: 0.5,
                      }}
                    >
                      <Typography fontWeight={600} fontSize="14px">
                        {replyUser?.name || "Unknown User"}
                      </Typography>
                      <Typography color="secondary.main" fontSize="12px">
                        {replyFormattedDate} | {replyFormattedTime}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        background: "#F4F9FD",
                        borderRadius: "12px",
                        padding: "10px 14px",
                        border: "1px solid #E4E6E8",
                      }}
                    >
                      <Typography fontSize="14px" sx={{ whiteSpace: "pre-wrap" }}>
                        {reply.message}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              );
            })
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
              borderRadius: "14px",
              border: "1px solid #D8E0F0",
              boxShadow: "0px 1px 2px 0px rgba(184, 200, 224, 0.22)",
              display: "flex",
              alignItems: "center",
              padding: "0 12px",
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

