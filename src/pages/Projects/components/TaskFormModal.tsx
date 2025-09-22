import Modal from "../../../common/components/Modal/Modal";
import TaskForm from "./TaskForm";
import type { ITask } from "../../../store/types/Task/Task";

interface TaskFormModalProps {
  show: boolean;
  onClose: () => void;
  task?: ITask; // Optional task for edit mode
  isEditMode?: boolean;
}

const TaskFormModal = ({ show, onClose, task, isEditMode = false }: TaskFormModalProps) => {
  return (
    <Modal show={show} onClose={onClose}>
      <TaskForm onClose={onClose} task={task} isEditMode={isEditMode} />
    </Modal>
  );
};

export default TaskFormModal;
