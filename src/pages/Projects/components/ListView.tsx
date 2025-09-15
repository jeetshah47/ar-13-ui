import {
  Avatar,
  AvatarGroup,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";
import StatusTag from "../../../common/components/StatusTag/StatusTag";
import { blurAnimation } from "../../../common/animation/cssAnimation";
import type {
  Created,
  TaskResponse,
} from "../../../store/types/Task/TaskResponse";

type ListViewProps = {
  tasks: TaskResponse[];
};

type StatusType = "progress" | "success" | "review" | "pending";

const ListView = ({ tasks }: ListViewProps) => {
  const getDurationInDays = (date: string) => {
    const date1 = new Date(date);
    const date2 = new Date();
    const diffMs = Math.abs(date1.getTime() - date2.getTime());

    // Calculate days and hours
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(
      (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );

    // Format as "2d 4h"
    return `${diffDays}d ${diffHours}h`;
  };

  const spentTime = (created: Created | undefined | null | string | Date) => {
    if (!created) return "0d 0h";

    let date1: Date;
    
    try {
      // Handle different date formats
      if (typeof created === 'object' && created !== null && '_nanoseconds' in created && '_seconds' in created) {
        // Firestore timestamp object
        const { _nanoseconds, _seconds } = created as { _nanoseconds: number; _seconds: number };
        const milliseconds = _seconds * 1000 + _nanoseconds / 1000000;
        date1 = new Date(milliseconds);
      } else if (typeof created === 'object' && created !== null && 'toDate' in created && typeof (created as { toDate: () => Date }).toDate === 'function') {
        // Firestore timestamp with toDate method
        date1 = (created as { toDate: () => Date }).toDate();
      } else if (typeof created === 'string' || created instanceof Date) {
        // String date or regular Date object
        date1 = new Date(created as string | Date);
      } else {
        return "0d 0h";
      }

      const date2 = new Date();
      const diffMs = Math.abs(date2.getTime() - date1.getTime());
      
      // Calculate days and hours
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor(
        (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );

      // Format as "2d 4h"
      return `${diffDays}d ${diffHours}h`;
    } catch {
      return "0d 0h";
    }
  };

  const TaskCard = (task: TaskResponse) => (
    <Box
      sx={{
        backgroundColor: "white",
        padding: "22px 26px",
        borderRadius: "24px",
        display: "flex",
        justifyContent: "space-between",
        margin: "16px 0px",
        ...blurAnimation,
      }}
    >
      <Box>
        <Typography color="secondary">Task Name</Typography>
        <Typography>{task.subject}</Typography>
      </Box>
      <Box>
        <Typography color="secondary">Estimate</Typography>
        <Typography>{getDurationInDays(task.duration)}</Typography>
      </Box>
      <Box>
        <Typography color="secondary">Spent Time</Typography>
        <Typography>{spentTime(task.created)}</Typography>
      </Box>
      <Box>
        <Typography color="secondary">Assignee</Typography>
        <AvatarGroup spacing={"medium"}>
          {task.assignTo.map((assign) => (
            <Avatar
              alt={assign[0]}
              key={assign}
              sx={{ width: "24px", height: "24px" }}
            />
          ))}
        </AvatarGroup>
      </Box>
      <Box>
        <Typography color="secondary">Priority</Typography>
        <Typography>{task.priority}</Typography>
      </Box>
      <Box>
        <StatusTag status={task.status as StatusType} />
      </Box>
      <Box>
        <CircularProgress variant="determinate" value={25} />
      </Box>
    </Box>
  );

  return (
    <>
      <Box
        sx={{
          background: "#E6EDF5",
          borderRadius: "14px",
          padding: "10px",
          textAlign: "center",
          marginTop: "12px",
        }}
      >
        <Typography sx={{ fontWeight: "bold" }}>Active Task</Typography>
      </Box>
      {tasks?.map((t) => (
        <TaskCard {...t} />
      ))}
    </>
  );
};

export default ListView;
