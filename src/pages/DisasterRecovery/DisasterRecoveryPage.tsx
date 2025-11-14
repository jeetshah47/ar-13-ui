import { Box, Button, TextField, Alert, CircularProgress, Card, CardContent, Typography, Stack } from "@mui/material";
import PageHeader from "../../common/components/PageHeader/PageHeader";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { createBackupAction, createBackupWithCustomLocationAction } from "../../store/features/backup/backupActions";

const BackupPage = () => {
  const dispatch = useAppDispatch();
  const backupState = useAppSelector((state) => state.backupReducer.api);
  const [customDir, setCustomDir] = useState("");

  const loading = backupState.loading;
  const lastBackupLocation = backupState.data.lastBackupLocation;

  const handleDefaultBackup = async () => {
    try {
      await dispatch(createBackupAction());
    } catch {
      // Error is already handled by the action with toast
    }
  };

  const handleCustomBackup = async () => {
    if (!customDir.trim()) {
      return;
    }

    try {
      await dispatch(createBackupWithCustomLocationAction(customDir.trim()));
    } catch {
      // Error is already handled by the action with toast
    }
  };

  return (
    <Box sx={{ height: "100%" }}>
        <PageHeader title="Backup" />
        
        <Box
          sx={{
            padding: { xs: "16px 0px", sm: "20px 0px", md: "24px 0px", lg: "28px 0px" },
            maxWidth: { xs: "100%", sm: "100%", md: "750px", lg: "800px" },
            margin: { xs: "0", sm: "0", md: "0 auto", lg: "0 auto" },
          }}
        >
          <Card sx={{ marginBottom: "24px" }}>
            <CardContent>
              <Typography variant="h6" sx={{ marginBottom: "16px", fontWeight: "bold" }}>
                Backup Operations
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ marginBottom: "24px" }}>
                Create backups of your system data. You can use the default backup location or specify a custom directory.
              </Typography>

              {lastBackupLocation && (
                <Alert severity="success" sx={{ marginBottom: "24px" }}>
                  Last backup location: {lastBackupLocation}
                </Alert>
              )}

              <Stack spacing={3}>
                <Box>
                  <Typography variant="subtitle1" sx={{ marginBottom: "12px", fontWeight: "medium" }}>
                    Default Backup Location
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ marginBottom: "16px" }}>
                    Creates a backup in the default location: <code>upload/backups/</code>
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={handleDefaultBackup}
                    disabled={loading}
                    sx={{ minWidth: "200px" }}
                  >
                    {loading ? <CircularProgress size={20} /> : "Create Default Backup"}
                  </Button>
                </Box>

                <Box>
                  <Typography variant="subtitle1" sx={{ marginBottom: "12px", fontWeight: "medium" }}>
                    Custom Backup Location
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ marginBottom: "16px" }}>
                    Specify a custom directory path for the backup.
                  </Typography>
                  <Stack direction={{ xs: "column", sm: "column", md: "row", lg: "row" }} spacing={2} alignItems={{ xs: "stretch", sm: "stretch", md: "flex-start", lg: "flex-start" }}>
                    <TextField
                      fullWidth
                      label="Backup Directory Path"
                      placeholder="/path/to/backup"
                      value={customDir}
                      onChange={(e) => setCustomDir(e.target.value)}
                      disabled={loading}
                      size="small"
                      helperText="Enter the full path where you want to store the backup"
                    />
                    <Button
                      variant="contained"
                      onClick={handleCustomBackup}
                      disabled={loading || !customDir.trim()}
                      sx={{ minWidth: { xs: "100%", sm: "100%", md: "200px", lg: "200px" }, marginTop: { xs: "0", sm: "0", md: "8px", lg: "8px" } }}
                    >
                      {loading ? <CircularProgress size={20} /> : "Create Custom Backup"}
                    </Button>
                  </Stack>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ marginBottom: "16px", fontWeight: "bold" }}>
                Important Notes
              </Typography>
              <Box component="ul" sx={{ paddingLeft: "24px", margin: 0 }}>
                <Typography component="li" variant="body2" color="text.secondary" sx={{ marginBottom: "8px" }}>
                  Backups may take some time depending on the amount of data
                </Typography>
                <Typography component="li" variant="body2" color="text.secondary" sx={{ marginBottom: "8px" }}>
                  Ensure you have sufficient disk space before creating a backup
                </Typography>
                <Typography component="li" variant="body2" color="text.secondary" sx={{ marginBottom: "8px" }}>
                  Custom backup paths must be absolute paths (e.g., /home/user/backups)
                </Typography>
                <Typography component="li" variant="body2" color="text.secondary">
                  Only administrators can access this page
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
  );
};

export default BackupPage;

