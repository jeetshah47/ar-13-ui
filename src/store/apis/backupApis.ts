import { http } from "../../config/http";

export interface BackupResponse {
  message: string;
  backupLocation?: string;
}

/**
 * Create backup with default location (upload/backups/)
 * POST /api/backup/all
 */
export async function createBackup(): Promise<BackupResponse> {
  const url = `http://localhost:3000/api/backup/all`;
  const result = await http.post(url);
  return result.data;
}

/**
 * Create backup with custom location
 * POST /api/backup/all?dir=/path/to/backup
 */
export async function createBackupWithCustomLocation(
  customDir: string
): Promise<BackupResponse> {
  const url = `http://localhost:3000/api/backup/all`;
  const result = await http.post(url, null, {
    params: {
      dir: customDir,
    },
  });
  return result.data;
}

