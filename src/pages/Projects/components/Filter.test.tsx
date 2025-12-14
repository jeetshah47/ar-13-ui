import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderWithProviders, screen, userEvent } from '../../../test/utils';
import Filter from './Filter';
import type { FilterState } from './Filter';
import type { TaskResponse } from '../../../store/types/Task/TaskResponse';
import type { TaskStatus } from '../../../store/types/Task/TaskTypes';

// Mock DateRangePicker
vi.mock('../../../common/components/DateRangePicker/DateRangePicker', () => ({
  DateRangePicker: ({ onDateRangeChange }: { onDateRangeChange: (start: Date | null, end: Date | null) => void }) => (
    <div data-testid="date-range-picker">
      <button onClick={() => onDateRangeChange(new Date('2024-01-01'), new Date('2024-01-31'))}>
        Set Date Range
      </button>
    </div>
  ),
}));

describe('Filter', () => {
  const mockTasks: TaskResponse[] = [
    {
      id: 'task1',
      subject: 'Task 1',
      status: 'pending',
      assignTo: { id: 'user1', name: 'User One' },
    } as TaskResponse,
    {
      id: 'task2',
      subject: 'Task 2',
      status: 'in_progress',
      assignTo: { id: 'user2', name: 'User Two' },
    } as TaskResponse,
    {
      id: 'task3',
      subject: 'Task 3',
      status: 'completed',
      assignTo: { id: 'user1', name: 'User One' },
    } as TaskResponse,
  ];

  const mockTaskStatuses: TaskStatus[] = [
    { id: '1', value: 'pending', displayName: 'Pending', description: '', category: 'active', isActive: true, isCompleted: false, order: 1, createdAt: '', updatedAt: '' },
    { id: '2', value: 'in_progress', displayName: 'In Progress', description: '', category: 'active', isActive: true, isCompleted: false, order: 2, createdAt: '', updatedAt: '' },
    { id: '3', value: 'completed', displayName: 'Completed', description: '', category: 'completed', isActive: true, isCompleted: true, order: 3, createdAt: '', updatedAt: '' },
  ];

  const mockOnClose = vi.fn();
  const mockOnApplyFilters = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders filter component', () => {
    renderWithProviders(
      <Filter
        onClose={mockOnClose}
        tasks={mockTasks}
        taskStatuses={mockTaskStatuses}
        onApplyFilters={mockOnApplyFilters}
      />
    );

    expect(screen.getByText(/filter/i)).toBeInTheDocument();
  });

  it('displays all task statuses as checkboxes', () => {
    renderWithProviders(
      <Filter
        onClose={mockOnClose}
        tasks={mockTasks}
        taskStatuses={mockTaskStatuses}
        onApplyFilters={mockOnApplyFilters}
      />
    );

    expect(screen.getByLabelText(/pending/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/in progress/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/completed/i)).toBeInTheDocument();
  });

  it('displays unique assignees from tasks', () => {
    renderWithProviders(
      <Filter
        onClose={mockOnClose}
        tasks={mockTasks}
        taskStatuses={mockTaskStatuses}
        onApplyFilters={mockOnApplyFilters}
      />
    );

    expect(screen.getByText(/user one/i)).toBeInTheDocument();
    expect(screen.getByText(/user two/i)).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    renderWithProviders(
      <Filter
        onClose={mockOnClose}
        tasks={mockTasks}
        taskStatuses={mockTaskStatuses}
        onApplyFilters={mockOnApplyFilters}
      />
    );

    const closeButton = screen.getByRole('button', { name: /close/i });
    await userEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('allows toggling task status checkboxes', async () => {
    renderWithProviders(
      <Filter
        onClose={mockOnClose}
        tasks={mockTasks}
        taskStatuses={mockTaskStatuses}
        onApplyFilters={mockOnApplyFilters}
      />
    );

    const pendingCheckbox = screen.getByLabelText(/pending/i);
    expect(pendingCheckbox).toBeChecked();

    await userEvent.click(pendingCheckbox);
    expect(pendingCheckbox).not.toBeChecked();

    await userEvent.click(pendingCheckbox);
    expect(pendingCheckbox).toBeChecked();
  });

  it('allows toggling assignee checkboxes', async () => {
    renderWithProviders(
      <Filter
        onClose={mockOnClose}
        tasks={mockTasks}
        taskStatuses={mockTaskStatuses}
        onApplyFilters={mockOnApplyFilters}
      />
    );

    const userOneCheckbox = screen.getByLabelText(/user one/i);
    expect(userOneCheckbox).toBeChecked();

    await userEvent.click(userOneCheckbox);
    expect(userOneCheckbox).not.toBeChecked();
  });

  it('calls onApplyFilters with correct filter state when apply is clicked', async () => {
    renderWithProviders(
      <Filter
        onClose={mockOnClose}
        tasks={mockTasks}
        taskStatuses={mockTaskStatuses}
        onApplyFilters={mockOnApplyFilters}
      />
    );

    const applyButton = screen.getByRole('button', { name: /apply/i });
    await userEvent.click(applyButton);

    expect(mockOnApplyFilters).toHaveBeenCalledTimes(1);
    const callArgs = mockOnApplyFilters.mock.calls[0][0] as FilterState;
    expect(callArgs.selectedStatuses).toContain('pending');
    expect(callArgs.selectedStatuses).toContain('in_progress');
    expect(callArgs.selectedStatuses).toContain('completed');
    expect(callArgs.selectedAssignees).toContain('user1');
    expect(callArgs.selectedAssignees).toContain('user2');
  });

  it('handles empty tasks array', () => {
    renderWithProviders(
      <Filter
        onClose={mockOnClose}
        tasks={[]}
        taskStatuses={mockTaskStatuses}
        onApplyFilters={mockOnApplyFilters}
      />
    );

    expect(screen.getByText(/filter/i)).toBeInTheDocument();
  });

  it('handles empty task statuses array', () => {
    renderWithProviders(
      <Filter
        onClose={mockOnClose}
        tasks={mockTasks}
        taskStatuses={[]}
        onApplyFilters={mockOnApplyFilters}
      />
    );

    expect(screen.getByText(/filter/i)).toBeInTheDocument();
  });

  it('updates filters when task statuses change', () => {
    const { rerender } = renderWithProviders(
      <Filter
        onClose={mockOnClose}
        tasks={mockTasks}
        taskStatuses={mockTaskStatuses}
        onApplyFilters={mockOnApplyFilters}
      />
    );

    const newStatuses: TaskStatus[] = [
      { id: '4', value: 'new_status', displayName: 'New Status', description: '', category: 'active', isActive: true, isCompleted: false, order: 4, createdAt: '', updatedAt: '' },
    ];

    rerender(
      <Filter
        onClose={mockOnClose}
        tasks={mockTasks}
        taskStatuses={newStatuses}
        onApplyFilters={mockOnApplyFilters}
      />
    );

    expect(screen.getByLabelText(/new status/i)).toBeInTheDocument();
  });
});

