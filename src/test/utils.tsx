import type { ReactElement } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { configureStore } from '@reduxjs/toolkit';
// PreloadedState is not exported from @reduxjs/toolkit, using RootState directly
import { ThemeProvider } from '@emotion/react';
import { createAppTheme } from '../theme';
import { ThemeProvider as CustomThemeProvider } from '../contexts/ThemeContext';
import { NetworkErrorProvider } from '../contexts/NetworkErrorContext';
import type { RootState } from '../store/store';

// Import all reducers
import { authReducer } from '../store/features/auth/authSlice';
import { projectListReducer } from '../store/features/projects/projectSlice';
import { projectDetailReducer } from '../store/features/projects/projectDetailSlice';
import { projectStatisticsReducer } from '../store/features/projects/projectStatisticsSlice';
import { taskListReducer } from '../store/features/task/taskSlice';
import { timeTrackingReducer } from '../store/features/task/timeTrackingSlice';
import { dashboardReducer } from '../store/features/dashboard/dashboardSlice';
import { userReducer } from '../store/features/user/userSlice';
import { calendarReducer } from '../store/features/calendar/calendarSlice';
import { vacationReducer } from '../store/features/vacation/vacationSlice';
import { employeeReducer } from '../store/features/employees/employeeSlice';
import { activityLogsReducer } from '../store/features/activityLogs/activityLogsSlice';
import { activityLogRepliesReducer } from '../store/features/activityLogReplies/activityLogRepliesSlice';
import { infoPortalReducer } from '../store/features/infoPortal/infoPortalSlice';
import { googleAccountReducer } from '../store/features/googleAccount/googleAccountSlice';
import { backupReducer } from '../store/features/backup/backupSlice';
import { drawingListReducer } from '../store/features/drawingList/drawingListSlice';

interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: Partial<RootState>;
  store?: ReturnType<typeof configureStore>;
}

export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState = {},
    store = configureStore({
      reducer: {
        authReducer,
        projectListReducer,
        projectDetailReducer,
        projectStatisticsReducer,
        taskListReducer,
        timeTrackingReducer,
        dashboardReducer,
        userReducer,
        calendarReducer,
        vacationReducer,
        employeeReducer,
        activityLogsReducer,
        activityLogRepliesReducer,
        infoPortalReducer,
        googleAccountReducer,
        backupReducer,
        drawingListReducer,
      } as any,
      preloadedState,
    }),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  const theme = createAppTheme('light');

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <CustomThemeProvider>
        <NetworkErrorProvider>
          <Provider store={store}>
            <BrowserRouter>
              <ThemeProvider theme={theme}>
                {children}
              </ThemeProvider>
            </BrowserRouter>
          </Provider>
        </NetworkErrorProvider>
      </CustomThemeProvider>
    );
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

// Re-export everything from React Testing Library
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';

