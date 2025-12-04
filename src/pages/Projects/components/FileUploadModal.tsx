import React, { useState, useRef } from "react";
import {
  Box,
  IconButton,
  Typography,
  Button,
  LinearProgress,
} from "@mui/material";
import Crossicon from "../../../assets/icons/general/close/blue.svg?react";
import UploadIcon from "../../../assets/icons/general/upload.svg?react";
import { useAppDispatch, useAppSelector, type RootState } from "../../../store/store";
import { addFileAttachmentAction } from "../../../store/features/task/projectAction";

interface FileUploadModalProps {
  onClose?: () => void;
  projectId?: string;
  taskId?: string;
}

const FileUploadModal = ({ onClose, projectId, taskId }: FileUploadModalProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const dispatch = useAppDispatch();
  const taskListState = useAppSelector((state: RootState) => state.taskListReducer);
  const { loading } = taskListState.api;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      setSelectedFiles(prev => [...prev, ...files]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...files]);
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0 || !projectId || !taskId) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        await dispatch(addFileAttachmentAction(projectId, taskId, file));
        setUploadProgress(((i + 1) / selectedFiles.length) * 100);
      }
      
      // Reset and close modal after successful upload
      setSelectedFiles([]);
      setUploadProgress(0);
      onClose?.();
    } catch {
      // Upload failed - error handling can be added here
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleClose = () => {
    setSelectedFiles([]);
    setUploadProgress(0);
    onClose?.();
  };

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        position: "fixed",
        zIndex: 50,
        backgroundColor: "#2155A316",
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        top: 0,
        left: 0,
      }}
    >
      <Box
        sx={(theme) => ({
          width: "584px",
          maxHeight: "90vh",
          backgroundColor: theme.palette.background.paper,
          boxShadow: theme.shadows[6],
          borderRadius: "24px",
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
        })}
      >
        {/* Header */}
        <Box
          sx={{
            padding: "30px 30px 0 30px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            sx={(theme) => ({
              fontWeight: 700,
              fontSize: "20px",
              lineHeight: "1.2",
              color: theme.palette.text.primary,
            })}
          >
            Upload Files
          </Typography>
          <IconButton
            onClick={handleClose}
            sx={(theme) => ({
              backgroundColor: theme.palette.grey[50],
              borderRadius: "14px",
              width: "44px",
              height: "44px",
            })}
          >
            <Crossicon />
          </IconButton>
        </Box>

        {/* Content */}
        <Box sx={{ padding: "30px", flex: 1, display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Drag and Drop Area */}
          <Box
            sx={(theme) => ({
              border: dragActive 
                ? `2px dashed ${theme.palette.primary.main}` 
                : `2px dashed ${theme.palette.grey[300]}`,
              borderRadius: "14px",
              padding: "40px",
              textAlign: "center",
              backgroundColor: dragActive 
                ? theme.palette.grey[50] 
                : theme.palette.mode === "dark" ? theme.palette.grey[100] : "#FAFBFC",
              cursor: "pointer",
              transition: "all 0.2s ease",
              "&:hover": {
                borderColor: theme.palette.primary.main,
                backgroundColor: theme.palette.grey[50],
              },
            })}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadIcon />
            <Typography
              sx={(theme) => ({
                marginTop: "16px",
                fontWeight: 700,
                fontSize: "16px",
                color: theme.palette.text.primary,
              })}
            >
              Drag & drop files here, or click to select
            </Typography>
            <Typography
              sx={(theme) => ({
                marginTop: "8px",
                fontSize: "14px",
                color: theme.palette.text.secondary,
              })}
            >
              Supports: Images, PDFs, Documents (Max 10MB per file)
            </Typography>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileInput}
              style={{ display: "none" }}
              accept="image/*,.pdf,.doc,.docx,.txt"
            />
          </Box>

          {/* Selected Files */}
          {selectedFiles.length > 0 && (
            <Box>
              <Typography
                sx={(theme) => ({
                  fontWeight: 700,
                  fontSize: "14px",
                  color: theme.palette.text.secondary,
                  marginBottom: "12px",
                })}
              >
                Selected Files ({selectedFiles.length})
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {selectedFiles.map((file, index) => (
                  <Box
                    key={index}
                    sx={(theme) => ({
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "12px",
                      backgroundColor: theme.palette.grey[50],
                      borderRadius: "8px",
                    })}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <UploadIcon />
                      <Box>
                        <Typography
                          sx={(theme) => ({
                            fontSize: "14px",
                            fontWeight: 600,
                            color: theme.palette.text.primary,
                          })}
                        >
                          {file.name}
                        </Typography>
                        <Typography
                          sx={(theme) => ({
                            fontSize: "12px",
                            color: theme.palette.text.secondary,
                          })}
                        >
                          {formatFileSize(file.size)}
                        </Typography>
                      </Box>
                    </Box>
                    <IconButton
                      onClick={() => handleRemoveFile(index)}
                      sx={(theme) => ({
                        color: theme.palette.error.main,
                        "&:hover": {
                          backgroundColor: theme.palette.error.light,
                        },
                      })}
                    >
                      ×
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {/* Upload Progress */}
          {uploading && (
            <Box>
              <Typography
                sx={(theme) => ({
                  fontWeight: 700,
                  fontSize: "14px",
                  color: theme.palette.text.secondary,
                  marginBottom: "8px",
                })}
              >
                Uploading...
              </Typography>
              <LinearProgress
                variant="determinate"
                value={uploadProgress}
                sx={(theme) => ({
                  height: "8px",
                  borderRadius: "4px",
                  backgroundColor: theme.palette.grey[300],
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: theme.palette.primary.main,
                  },
                })}
              />
              <Typography
                sx={(theme) => ({
                  fontSize: "12px",
                  color: theme.palette.text.secondary,
                  marginTop: "4px",
                })}
              >
                {Math.round(uploadProgress)}% complete
              </Typography>
            </Box>
          )}
        </Box>

        {/* Footer */}
        <Box
          sx={{
            padding: "0 30px 30px 30px",
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
          }}
        >
          <Button
            onClick={handleClose}
            disabled={uploading}
            sx={(theme) => ({
              color: theme.palette.text.secondary,
              fontWeight: 600,
              padding: "12px 20px",
              borderRadius: "14px",
              "&:hover": {
                backgroundColor: theme.palette.grey[50],
              },
            })}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={selectedFiles.length === 0 || uploading || loading}
            sx={(theme) => ({
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              borderRadius: "14px",
              padding: "12px 20px",
              fontWeight: 700,
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
              },
              "&:disabled": {
                backgroundColor: theme.palette.action.disabledBackground,
                color: theme.palette.action.disabled,
              },
            })}
          >
            {uploading ? "Uploading..." : `Upload ${selectedFiles.length} file${selectedFiles.length !== 1 ? 's' : ''}`}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default FileUploadModal;
