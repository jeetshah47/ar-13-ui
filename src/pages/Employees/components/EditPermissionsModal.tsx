import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Divider,
  Chip,
  CircularProgress,
  Alert,
  alpha,
  useTheme,
} from "@mui/material";
import { useState, useEffect } from "react";
import type { Permission, UserRole } from "../../../store/types/RBAC";
import { ROLE_PERMISSIONS, getPermissionsForRole } from "../../../store/types/RBAC/config";

// Get all available permissions
const getAllAvailablePermissions = (): Permission[] => {
  const allPermissions = new Set<Permission>();
  Object.values(ROLE_PERMISSIONS).forEach((perms) => {
    perms.forEach((perm) => allPermissions.add(perm));
  });
  return Array.from(allPermissions).sort();
};

interface EditPermissionsModalProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  currentPermissions: Permission[];
  currentRole: UserRole;
  onSave: (permissions: Permission[], role?: UserRole) => Promise<void>;
}

const EditPermissionsModal = ({
  open,
  onClose,
  userId,
  currentPermissions,
  currentRole,
  onSave,
}: EditPermissionsModalProps) => {
  const theme = useTheme();
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentRole);
  const [selectedPermissions, setSelectedPermissions] = useState<Set<Permission>>(
    new Set(currentPermissions)
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setSelectedRole(currentRole);
      setSelectedPermissions(new Set(currentPermissions));
      setError(null);
    }
  }, [open, currentRole, currentPermissions]);

  const allPermissions = getAllAvailablePermissions();

  const handleRoleChange = (newRole: UserRole) => {
    setSelectedRole(newRole);
    // Optionally auto-select permissions for the role
    const rolePermissions = getPermissionsForRole(newRole);
    setSelectedPermissions(new Set(rolePermissions));
  };

  const handlePermissionToggle = (permission: Permission) => {
    const newPermissions = new Set(selectedPermissions);
    if (newPermissions.has(permission)) {
      newPermissions.delete(permission);
    } else {
      newPermissions.add(permission);
    }
    setSelectedPermissions(newPermissions);
  };

  const handleSelectAllForCategory = (categoryPrefix: string) => {
    const categoryPermissions = allPermissions.filter((p) => p.startsWith(categoryPrefix));
    const newPermissions = new Set(selectedPermissions);
    const allSelected = categoryPermissions.every((p) => newPermissions.has(p));
    
    if (allSelected) {
      // Deselect all
      categoryPermissions.forEach((p) => newPermissions.delete(p));
    } else {
      // Select all
      categoryPermissions.forEach((p) => newPermissions.add(p));
    }
    setSelectedPermissions(newPermissions);
  };

  const handleSelectRolePermissions = () => {
    const rolePermissions = getPermissionsForRole(selectedRole);
    setSelectedPermissions(new Set(rolePermissions));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const permissionsArray = Array.from(selectedPermissions);
      await onSave(permissionsArray, selectedRole);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update permissions";
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // Group permissions by category
  const groupedPermissions: Record<string, Permission[]> = {};
  allPermissions.forEach((permission) => {
    const category = permission.split(":")[0];
    if (!groupedPermissions[category]) {
      groupedPermissions[category] = [];
    }
    groupedPermissions[category].push(permission);
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "16px",
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Edit Permissions
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ marginBottom: 2 }}>
            {error}
          </Alert>
        )}

        {/* Role Selection */}
        <Box sx={{ marginBottom: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Role</InputLabel>
            <Select
              value={selectedRole}
              onChange={(e) => handleRoleChange(e.target.value as UserRole)}
              input={<OutlinedInput label="Role" />}
            >
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="Standard">Standard</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            size="small"
            onClick={handleSelectRolePermissions}
            sx={{ mt: 1 }}
          >
            Load Default Permissions for {selectedRole}
          </Button>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Permissions by Category */}
        <Box sx={{ maxHeight: "400px", overflowY: "auto", pr: 1 }}>
          {Object.entries(groupedPermissions).map(([category, permissions]) => {
            const allSelected = permissions.every((p) => selectedPermissions.has(p));
            const someSelected = permissions.some((p) => selectedPermissions.has(p));

            return (
              <Box key={category} sx={{ marginBottom: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 1,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600, textTransform: "capitalize" }}>
                    {category}
                  </Typography>
                  <Button
                    size="small"
                    onClick={() => handleSelectAllForCategory(`${category}:`)}
                    sx={{ textTransform: "none" }}
                  >
                    {allSelected ? "Deselect All" : "Select All"}
                  </Button>
                </Box>
                <FormGroup>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                      gap: 1,
                    }}
                  >
                    {permissions.map((permission) => {
                      const [, action] = permission.split(":");
                      const isChecked = selectedPermissions.has(permission);
                      return (
                        <FormControlLabel
                          key={permission}
                          control={
                            <Checkbox
                              checked={isChecked}
                              onChange={() => handlePermissionToggle(permission)}
                              size="small"
                            />
                          }
                          label={
                            <Typography variant="body2" sx={{ textTransform: "capitalize" }}>
                              {action}
                            </Typography>
                          }
                        />
                      );
                    })}
                  </Box>
                </FormGroup>
              </Box>
            );
          })}
        </Box>

        {/* Selected Permissions Summary */}
        <Divider sx={{ my: 2 }} />
        <Box>
          <Typography variant="subtitle2" sx={{ marginBottom: 1, fontWeight: 600 }}>
            Selected Permissions ({selectedPermissions.size})
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              maxHeight: "100px",
              overflowY: "auto",
              p: 1,
              backgroundColor: alpha(theme.palette.primary.main, 0.05),
              borderRadius: "8px",
            }}
          >
            {Array.from(selectedPermissions).map((permission) => (
              <Chip
                key={permission}
                label={permission}
                size="small"
                sx={{
                  fontSize: "0.7rem",
                }}
              />
            ))}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ padding: "16px 24px" }}>
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={saving || selectedPermissions.size === 0}
          startIcon={saving ? <CircularProgress size={16} /> : null}
        >
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditPermissionsModal;

