import { useState, useEffect, useRef, useCallback } from "react";
import { ActivityMonitor } from "../utils/activityMonitor";
import {
  startTimeTracking,
  stopTimeTracking,
  updateActivity,
  getTrackingStatus,
} from "../store/apis/taskApis";

export interface TimeTrackingSession {
  id: string;
  startTime: string;
  lastActive: string;
  totalMinutes: number;
}

export interface UseTimeTrackingReturn {
  isTracking: boolean;
  activeTime: number; // in seconds
  session: TimeTrackingSession | null;
  startTracking: () => Promise<void>;
  stopTracking: () => Promise<void>;
  error: string | null;
}

interface UseTimeTrackingOptions {
  projectId: string;
  taskId: string;
  autoStart?: boolean; // Auto-start when task status is in_progress
  syncInterval?: number; // Sync interval in milliseconds (default: 2 minutes)
  activityUpdateInterval?: number; // Activity update interval in milliseconds (default: 30 seconds)
  idleTimeout?: number; // Idle timeout in minutes (default: 10)
}

export function useTimeTracking(options: UseTimeTrackingOptions): UseTimeTrackingReturn {
  const {
    projectId,
    taskId,
    autoStart = false,
    syncInterval = 2 * 60 * 1000, // 2 minutes
    activityUpdateInterval = 30 * 1000, // 30 seconds
    idleTimeout = 10,
  } = options;

  const [isTracking, setIsTracking] = useState(false);
  const [session, setSession] = useState<TimeTrackingSession | null>(null);
  const [activeTime, setActiveTime] = useState(0); // in seconds
  const [error, setError] = useState<string | null>(null);

  const activityMonitorRef = useRef<ActivityMonitor | null>(null);
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const activityUpdateIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeUpdateIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const sessionStartTimeRef = useRef<number | null>(null);
  const lastActiveTimeRef = useRef<number | null>(null);

  // Define checkTrackingStatus early to avoid hoisting issues
  const checkTrackingStatus = useCallback(async () => {
    try {
      const status = await getTrackingStatus(projectId, taskId);
      setIsTracking(status.isTracking);
      setSession(status.session);

      if (status.isTracking && status.session) {
        sessionStartTimeRef.current = new Date(status.session.startTime).getTime();
        lastActiveTimeRef.current = new Date(status.session.lastActive).getTime();
      } else {
        sessionStartTimeRef.current = null;
        lastActiveTimeRef.current = null;
      }
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to check tracking status";
      setError(errorMessage);
    }
  }, [projectId, taskId]);

  // Initialize activity monitor
  useEffect(() => {
    const monitor = new ActivityMonitor(idleTimeout, 30, {
      onIdle: () => {
        // User is idle - pause time accumulation
        // Time won't be counted during idle period
      },
      onActive: () => {
        // User is active again - resume time accumulation
        if (isTracking && lastActiveTimeRef.current) {
          // Update last active time
          lastActiveTimeRef.current = Date.now();
        }
      },
    });

    activityMonitorRef.current = monitor;
    monitor.start();

    return () => {
      monitor.stop();
    };
  }, [idleTimeout, isTracking]);

  // Check tracking status on mount and when projectId/taskId changes
  useEffect(() => {
    checkTrackingStatus();

    return () => {
      // Cleanup on unmount
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
      if (activityUpdateIntervalRef.current) {
        clearInterval(activityUpdateIntervalRef.current);
      }
      if (timeUpdateIntervalRef.current) {
        clearInterval(timeUpdateIntervalRef.current);
      }
    };
  }, [projectId, taskId, checkTrackingStatus]);

  // Auto-start tracking if enabled and task is in progress
  useEffect(() => {
    if (autoStart && !isTracking && session === null) {
      checkTrackingStatus();
    }
  }, [autoStart, isTracking, session, checkTrackingStatus]);

  // Update active time display
  useEffect(() => {
    if (!isTracking || !session) {
      setActiveTime(0);
      if (timeUpdateIntervalRef.current) {
        clearInterval(timeUpdateIntervalRef.current);
        timeUpdateIntervalRef.current = null;
      }
      return;
    }

    // Update active time every second for real-time display
    timeUpdateIntervalRef.current = setInterval(() => {
      if (sessionStartTimeRef.current && activityMonitorRef.current) {
        const now = Date.now();
        const isIdle = activityMonitorRef.current.isUserIdle();
        const lastActive = lastActiveTimeRef.current || sessionStartTimeRef.current;

        if (!isIdle) {
          // Calculate active time (excluding idle periods)
          const elapsed = Math.floor((now - lastActive) / 1000); // in seconds
          const sessionStart = new Date(session.startTime).getTime();
          const baseTime = Math.floor((lastActive - sessionStart) / 1000);
          setActiveTime(baseTime + elapsed);
        } else {
          // User is idle - don't increment time
          const sessionStart = new Date(session.startTime).getTime();
          const baseTime = Math.floor((lastActive - sessionStart) / 1000);
          setActiveTime(baseTime);
        }
      }
    }, 1000);

    return () => {
      if (timeUpdateIntervalRef.current) {
        clearInterval(timeUpdateIntervalRef.current);
        timeUpdateIntervalRef.current = null;
      }
    };
  }, [isTracking, session]);

  // Sync with backend periodically
  useEffect(() => {
    if (!isTracking) {
      return;
    }

    syncIntervalRef.current = setInterval(() => {
      checkTrackingStatus();
    }, syncInterval);

    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
    };
  }, [isTracking, syncInterval, checkTrackingStatus]);

  // Update activity on backend periodically
  useEffect(() => {
    if (!isTracking || !activityMonitorRef.current) {
      return;
    }

    activityUpdateIntervalRef.current = setInterval(() => {
      if (activityMonitorRef.current && !activityMonitorRef.current.isUserIdle()) {
        updateActivity(projectId, taskId).catch((err) => {
          console.error("Failed to update activity:", err);
        });
        lastActiveTimeRef.current = Date.now();
      }
    }, activityUpdateInterval);

    return () => {
      if (activityUpdateIntervalRef.current) {
        clearInterval(activityUpdateIntervalRef.current);
      }
    };
  }, [isTracking, projectId, taskId, activityUpdateInterval]);

  const startTracking = useCallback(async () => {
    try {
      await startTimeTracking(projectId, taskId);
      await checkTrackingStatus();
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to start tracking";
      setError(errorMessage);
      throw err;
    }
  }, [projectId, taskId, checkTrackingStatus]);

  const stopTracking = useCallback(async () => {
    try {
      await stopTimeTracking(projectId, taskId);
      setIsTracking(false);
      setSession(null);
      sessionStartTimeRef.current = null;
      lastActiveTimeRef.current = null;
      setActiveTime(0);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to stop tracking";
      setError(errorMessage);
      throw err;
    }
  }, [projectId, taskId]);

  return {
    isTracking,
    activeTime,
    session,
    startTracking,
    stopTracking,
    error,
  };
}

