import { useState, useRef, useEffect } from "react";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  SvgIcon,
  TextField,
  Typography,
} from "@mui/material";
import { InsertEmoticon, AlternateEmail, Send } from "@mui/icons-material";
import EmojiPicker, { type EmojiClickData } from "emoji-picker-react";
import AttachIcon from "../../../assets/icons/general/attach/dark.svg?react";
import AddLinkIcon from "../../../assets/icons/general/addlink/dark.svg?react";
import type { ActivityLog } from "../../../store/types/Task/TaskTypes";

interface Reply {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
}

interface ActivityLogItemProps {
  activity: ActivityLog;
  activityIcon: React.ComponentType;
  formattedDate: string;
  formattedTime: string;
  replies?: Reply[];
  currentUserName?: string;
  onReplySubmit?: (activityId: string, message: string) => void;
}

const ActivityLogItem = ({
  activity,
  activityIcon: ActivityIcon,
  formattedDate,
  formattedTime,
  replies = [],
  currentUserName = "You",
  onReplySubmit,
}: ActivityLogItemProps) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);

  const hasReplies = replies.length > 0;

  const handleToggleReplyInput = () => {
    setShowReplyInput((prev) => !prev);
    if (showReplyInput) {
      setReplyText("");
    }
  };

  const handleReplyChange = (value: string) => {
    setReplyText(value);
  };

  const handleSubmitReply = () => {
    if (replyText.trim() && onReplySubmit) {
      onReplySubmit(activity.id, replyText.trim());
      setReplyText("");
      setShowReplyInput(false);
    }
  };

  const toggleReplies = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setReplyText((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker((prev) => !prev);
  };

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

  return (
    <Box sx={{ marginBottom: "24px" }}>
      {/* Activity Header */}
      <Box sx={{ display: "flex", gap: "16px", paddingY: "12px" }}>
        <Avatar sx={{ width: "50px", height: "50px" }}>
          {activity.userName.charAt(0).toUpperCase()}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography fontWeight={700}>{activity.userName}</Typography>
          <Typography color="secondary.main">
            {formattedDate} | {formattedTime}
          </Typography>
        </Box>
      </Box>

      {/* Activity Description */}
      <Box
        sx={{
          background: "#F4F9FD",
          borderRadius: "14px",
          padding: "15px 20px",
          width: "fit-content",
          display: "flex",
          marginTop: "12px",
          marginBottom: "12px",
        }}
      >
        <SvgIcon component={ActivityIcon} sx={{ marginRight: "8px" }} />
        <Typography>{activity.description}</Typography>
      </Box>

      {/* Reply Section */}
      <Box sx={{ marginLeft: "66px" }}>
        {/* Reply button and replies count */}
        <Box sx={{ display: "flex", alignItems: "center", gap: "12px", mb: 1 }}>
          <Button
            size="small"
            onClick={handleToggleReplyInput}
            sx={{
              textTransform: "none",
              color: "#3F8CFF",
              fontSize: "14px",
              fontWeight: 500,
              padding: "4px 8px",
              minWidth: "auto",
              "&:hover": {
                backgroundColor: "rgba(63, 140, 255, 0.08)",
              },
            }}
          >
            Reply
          </Button>
          {hasReplies && (
            <Button
              size="small"
              onClick={toggleReplies}
              sx={{
                textTransform: "none",
                color: "#7D8592",
                fontSize: "14px",
                fontWeight: 400,
                padding: "4px 8px",
                minWidth: "auto",
              }}
            >
              {isExpanded ? "Hide" : "Show"} {replies.length}{" "}
              {replies.length === 1 ? "reply" : "replies"}
            </Button>
          )}
        </Box>

        {/* Replies list */}
        {hasReplies && isExpanded && (
          <Box sx={{ marginTop: "12px", marginBottom: "12px" }}>
            {replies.map((reply) => {
              const replyFormattedDate = reply.timestamp.toLocaleDateString(
                "en-GB",
                {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                }
              );
              const replyFormattedTime = reply.timestamp.toLocaleTimeString(
                [],
                {
                  hour: "2-digit",
                  minute: "2-digit",
                }
              );

              return (
                <Box
                  key={reply.id}
                  sx={{
                    display: "flex",
                    gap: "12px",
                    marginBottom: "16px",
                    paddingLeft: "16px",
                    borderLeft: "2px solid #E4E6E8",
                  }}
                >
                  <Avatar sx={{ width: "32px", height: "32px" }}>
                    {reply.userName.charAt(0).toUpperCase()}
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
                        {reply.userName}
                      </Typography>
                      <Typography color="secondary.main" fontSize="12px">
                        {replyFormattedDate} | {replyFormattedTime}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        background: "#FFFFFF",
                        borderRadius: "12px",
                        padding: "10px 14px",
                        border: "1px solid #E4E6E8",
                      }}
                    >
                      <Typography fontSize="14px">{reply.message}</Typography>
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}

        {/* Reply input - Based on Figma design */}
        {showReplyInput && (
          <Box
            sx={{
              marginTop: "12px",
              paddingLeft: "16px",
              borderLeft: "2px solid #3F8CFF",
            }}
          >
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: "56px",
                backgroundColor: "#FFFFFF",
                borderRadius: "14px",
                border: "1px solid #D8E0F0",
                boxShadow: "0px 1px 2px 0px rgba(184, 200, 224, 0.22)",
                display: "flex",
                alignItems: "center",
                padding: "0 12px",
              }}
            >
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
                onClick={() => {
                  // TODO: Handle attach file
                }}
              >
                <SvgIcon component={AttachIcon} sx={{ fontSize: "24px" }} />
              </IconButton>

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
                  // TODO: Handle add link
                }}
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
                  // TODO: Handle mention
                }}
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
                      theme="light"
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
                disabled={!replyText.trim()}
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
              >
                <Send sx={{ color: "#FFFFFF", fontSize: "24px" }} />
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ActivityLogItem;

