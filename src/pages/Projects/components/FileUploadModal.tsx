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
        sx={{
          width: "584px",
          maxHeight: "90vh",
          backgroundColor: "white",
          boxShadow: "0px 6px 58px rgba(121, 145, 173, 0.2)",
          borderRadius: "24px",
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
        }}
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
            sx={{
              fontWeight: 700,
              fontSize: "20px",
              lineHeight: "1.2",
              color: "#2D3748",
            }}
          >
            Upload Files
          </Typography>
          <IconButton
            onClick={handleClose}
            sx={{
              backgroundColor: "#F4F9FD",
              borderRadius: "14px",
              width: "44px",
              height: "44px",
            }}
          >
            <Crossicon />
          </IconButton>
        </Box>

        {/* Content */}
        <Box sx={{ padding: "30px", flex: 1, display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Drag and Drop Area */}
          <Box
            sx={{
              border: dragActive ? "2px dashed #3F8CFF" : "2px dashed #D8E0F0",
              borderRadius: "14px",
              padding: "40px",
              textAlign: "center",
              backgroundColor: dragActive ? "#F4F9FD" : "#FAFBFC",
              cursor: "pointer",
              transition: "all 0.2s ease",
              "&:hover": {
                borderColor: "#3F8CFF",
                backgroundColor: "#F4F9FD",
              },
            }}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadIcon />
            <Typography
              sx={{
                marginTop: "16px",
                fontWeight: 700,
                fontSize: "16px",
                color: "#2D3748",
              }}
            >
              Drag & drop files here, or click to select
            </Typography>
            <Typography
              sx={{
                marginTop: "8px",
                fontSize: "14px",
                color: "#7D8592",
              }}
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
                sx={{
                  fontWeight: 700,
                  fontSize: "14px",
                  color: "#7D8592",
                  marginBottom: "12px",
                }}
              >
                Selected Files ({selectedFiles.length})
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {selectedFiles.map((file, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "12px",
                      backgroundColor: "#F4F9FD",
                      borderRadius: "8px",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <UploadIcon />
                      <Box>
                        <Typography
                          sx={{
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "#2D3748",
                          }}
                        >
                          {file.name}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "12px",
                            color: "#7D8592",
                          }}
                        >
                          {formatFileSize(file.size)}
                        </Typography>
                      </Box>
                    </Box>
                    <IconButton
                      onClick={() => handleRemoveFile(index)}
                      sx={{
                        color: "#E53E3E",
                        "&:hover": {
                          backgroundColor: "#FED7D7",
                        },
                      }}
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
                sx={{
                  fontWeight: 700,
                  fontSize: "14px",
                  color: "#7D8592",
                  marginBottom: "8px",
                }}
              >
                Uploading...
              </Typography>
              <LinearProgress
                variant="determinate"
                value={uploadProgress}
                sx={{
                  height: "8px",
                  borderRadius: "4px",
                  backgroundColor: "#E2E8F0",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "#3F8CFF",
                  },
                }}
              />
              <Typography
                sx={{
                  fontSize: "12px",
                  color: "#7D8592",
                  marginTop: "4px",
                }}
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
            sx={{
              color: "#7D8592",
              fontWeight: 600,
              padding: "12px 20px",
              borderRadius: "14px",
              "&:hover": {
                backgroundColor: "#F4F9FD",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={selectedFiles.length === 0 || uploading || loading}
            sx={{
              backgroundColor: "#3F8CFF",
              color: "#FFFFFF",
              borderRadius: "14px",
              padding: "12px 20px",
              fontWeight: 700,
              "&:hover": {
                backgroundColor: "#2B77E5",
              },
              "&:disabled": {
                backgroundColor: "#D8E0F0",
                color: "#A0AEC0",
              },
            }}
          >
            {uploading ? "Uploading..." : `Upload ${selectedFiles.length} file${selectedFiles.length !== 1 ? 's' : ''}`}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default FileUploadModal;
