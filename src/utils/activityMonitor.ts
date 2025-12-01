/**
 * Activity monitor utility to detect user activity and idle state
 */

export interface ActivityMonitorCallbacks {
  onActivity?: () => void;
  onIdle?: () => void;
  onActive?: () => void;
}

export class ActivityMonitor {
  private lastActivityTime: number;
  private idleTimeout: number; // in milliseconds (default: 10 minutes)
  private checkInterval: number; // in milliseconds (default: 30 seconds)
  private isIdle: boolean;
  private intervalId: NodeJS.Timeout | null = null;
  private callbacks: ActivityMonitorCallbacks;

  constructor(
    idleTimeoutMinutes: number = 10,
    checkIntervalSeconds: number = 30,
    callbacks: ActivityMonitorCallbacks = {}
  ) {
    this.idleTimeout = idleTimeoutMinutes * 60 * 1000; // Convert to milliseconds
    this.checkInterval = checkIntervalSeconds * 1000; // Convert to milliseconds
    this.lastActivityTime = Date.now();
    this.isIdle = false;
    this.callbacks = callbacks;
  }

  /**
   * Start monitoring user activity
   */
  start(): void {
    if (this.intervalId !== null) {
      return; // Already started
    }

    // Listen to user activity events
    this.attachEventListeners();

    // Check for idle state periodically
    this.intervalId = setInterval(() => {
      this.checkIdleState();
    }, this.checkInterval);

    // Initial check
    this.checkIdleState();
  }

  /**
   * Stop monitoring user activity
   */
  stop(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.detachEventListeners();
  }

  /**
   * Record user activity
   */
  recordActivity(): void {
    const wasIdle = this.isIdle;
    this.lastActivityTime = Date.now();

    if (wasIdle) {
      this.isIdle = false;
      if (this.callbacks.onActive) {
        this.callbacks.onActive();
      }
    }

    if (this.callbacks.onActivity) {
      this.callbacks.onActivity();
    }
  }

  /**
   * Get the last activity timestamp
   */
  getLastActivityTime(): number {
    return this.lastActivityTime;
  }

  /**
   * Check if user is currently idle
   */
  isUserIdle(): boolean {
    return this.isIdle;
  }

  /**
   * Get time since last activity in milliseconds
   */
  getTimeSinceLastActivity(): number {
    return Date.now() - this.lastActivityTime;
  }

  /**
   * Attach event listeners for user activity
   */
  private attachEventListeners(): void {
    // Mouse events
    const mouseEvents = ["mousedown", "mousemove", "mouseup", "click", "scroll", "wheel"];
    mouseEvents.forEach((event) => {
      document.addEventListener(event, this.handleActivity, { passive: true });
    });

    // Keyboard events
    const keyboardEvents = ["keydown", "keyup", "keypress"];
    keyboardEvents.forEach((event) => {
      document.addEventListener(event, this.handleActivity, { passive: true });
    });

    // Touch events (for mobile)
    const touchEvents = ["touchstart", "touchmove", "touchend"];
    touchEvents.forEach((event) => {
      document.addEventListener(event, this.handleActivity, { passive: true });
    });

    // Visibility change (when user switches tabs)
    document.addEventListener("visibilitychange", this.handleVisibilityChange);
  }

  /**
   * Detach event listeners
   */
  private detachEventListeners(): void {
    const mouseEvents = ["mousedown", "mousemove", "mouseup", "click", "scroll", "wheel"];
    mouseEvents.forEach((event) => {
      document.removeEventListener(event, this.handleActivity);
    });

    const keyboardEvents = ["keydown", "keyup", "keypress"];
    keyboardEvents.forEach((event) => {
      document.removeEventListener(event, this.handleActivity);
    });

    const touchEvents = ["touchstart", "touchmove", "touchend"];
    touchEvents.forEach((event) => {
      document.removeEventListener(event, this.handleActivity);
    });

    document.removeEventListener("visibilitychange", this.handleVisibilityChange);
  }

  /**
   * Handle activity events
   */
  private handleActivity = (): void => {
    this.recordActivity();
  };

  /**
   * Handle visibility change (tab switch)
   */
  private handleVisibilityChange = (): void => {
    if (document.hidden) {
      // Tab is hidden - don't count this as activity, but don't mark as idle either
      // We'll let the idle timeout handle it
    } else {
      // Tab is visible again - record activity
      this.recordActivity();
    }
  };

  /**
   * Check if user is idle based on last activity time
   */
  private checkIdleState(): void {
    const timeSinceLastActivity = this.getTimeSinceLastActivity();

    if (timeSinceLastActivity >= this.idleTimeout && !this.isIdle) {
      this.isIdle = true;
      if (this.callbacks.onIdle) {
        this.callbacks.onIdle();
      }
    } else if (timeSinceLastActivity < this.idleTimeout && this.isIdle) {
      this.isIdle = false;
      if (this.callbacks.onActive) {
        this.callbacks.onActive();
      }
    }
  }

  /**
   * Reset the monitor (useful when starting a new tracking session)
   */
  reset(): void {
    this.lastActivityTime = Date.now();
    this.isIdle = false;
  }
}

