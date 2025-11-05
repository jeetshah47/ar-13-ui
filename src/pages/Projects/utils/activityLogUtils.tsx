import CalendarIcon from "../../../assets/icons/sidebar/calendar/inactive.svg?react";
import AttachmentIcon from "../../../assets/icons/general/calendar-19.svg?react";
import FilesIcon from "../../../assets/icons/general/calendar-20.svg?react";
import UploadIcon from "../../../assets/icons/general/upload.svg?react";
import FilterIcon from "../../../assets/icons/general/calendar-5.svg?react";
import type { ActivityLog } from "../../../store/types/Task/TaskTypes";

/**
 * Get icon component for activity log type
 */
export const getActivityIcon = (type: ActivityLog["type"]): React.ComponentType => {
  switch (type) {
    case "time_spent_added":
      return CalendarIcon;
    case "file_uploaded":
      return UploadIcon;
    case "task_assigned":
      return AttachmentIcon;
    case "status_changed":
      return FilterIcon;
    case "task_created":
      return FilesIcon;
    default:
      return UploadIcon;
  }
};
