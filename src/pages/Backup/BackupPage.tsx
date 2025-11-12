import { Box, Button, TextField, Alert, CircularProgress, Card, CardContent, Typography, Stack } from "@mui/material";
import PageHeader from "../../common/components/PageHeader/PageHeader";
import { useState } from "react";
import { createBackup, createBackupWithCustomLocation } from "../../store/apis/backupApis";
import toast from "react-hot-toast";
import { usePermissions } from "../../store/hooks/usePermissions";
import { RequirePermission } from "../../common/components/RBAC/RequirePermission";

const BackupPage = () => {
  const { checkPermission } = usePermissions();
  const [loading, setLoading] = useState(false);
  const [customDir, setCustomDir] = useState("");
  const [lastBackupLocation, setLastBackupLocation] = useState<string | null>(null);
  
  const canWrite = checkPermission("backup:write");

  const handleDefaultBackup = async () => {
    setLoading(true);
    try {
      const response = await createBackup();
      toast.success(response.message || "Backup created successfully");
      if (response.backupLocation) {
        setLastBackupLocation(response.backupLocation);
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to create backup");
    } finally {
      setLoading(false);
    }
  };

  const handleCustomBackup = async () => {
    if (!customDir.trim()) {
      toast.error("Please enter a backup directory path");
      return;
    }

    setLoading(true);
    try {
      const response = await createBackupWithCustomLocation(customDir.trim());
      toast.success(response.message || "Backup created successfully");
      if (response.backupLocation) {
        setLastBackupLocation(response.backupLocation);
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to create backup");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ height: "100%" }}>
        <PageHeader title="Backup" />
        
        <Box
          sx={{
            padding: "28px 0px",
            maxWidth: "800px",
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
                <RequirePermission permission="backup:write">
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
                    <Stack direction="row" spacing={2} alignItems="flex-start">
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
                        sx={{ minWidth: "200px", marginTop: "8px" }}
                      >
                        {loading ? <CircularProgress size={20} /> : "Create Custom Backup"}
                      </Button>
                    </Stack>
                  </Box>
                </RequirePermission>
                {!canWrite && (
                  <Alert severity="info">
                    You have read-only access to the backup page. You need the <strong>backup:write</strong> permission to create backups.
                  </Alert>
                )}
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
                  Users with <strong>backup:read</strong> permission can view this page
                </Typography>
                <Typography component="li" variant="body2" color="text.secondary">
                  Users with <strong>backup:write</strong> permission can create backups
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
  );
};

export default BackupPage;

