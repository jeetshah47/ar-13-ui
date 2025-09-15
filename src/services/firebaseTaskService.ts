import {
  doc,
  collection,
  onSnapshot,
  updateDoc,
  addDoc,
  deleteDoc,
  query,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "../config/firebase";

export interface FirebaseTask {
  id: string;
  subject: string;
  code: string;
  status: string;
  duration: Date | { toDate: () => Date } | string;
  priority: string;
  assignTo: string[];
  projectId: string;
}

export interface FirebaseProject {
  id: string;
  title: string;
  description: string;
  ownerId: string;
  membersIds: string[] | null;
  deadLine: Date | { toDate: () => Date };
  tasks: FirebaseTask[];
}

export const taskStatuses = {
  backlog: "Backlog",
  todo: "To Do", 
  inprogress: "In Progress",
  review: "In Review",
  done: "Done"
} as const;

export type TaskStatus = keyof typeof taskStatuses;

// Listen to tasks for a specific project in real-time
export const subscribeToProjectTasks = (
  projectId: string,
  callback: (tasks: FirebaseTask[]) => void
): Unsubscribe => {
  const tasksRef = collection(db, "projects", projectId, "tasks");
  
  // Query tasks without orderBy to avoid index requirement
  const q = query(tasksRef);

  return onSnapshot(q, 
    (snapshot) => {
      const tasks: FirebaseTask[] = [];
      snapshot.forEach((doc) => {
        tasks.push({
          id: doc.id,
          ...doc.data(),
        } as FirebaseTask);
      });
      
      // Sort tasks by status for better organization
      const sortedTasks = tasks.sort((a, b) => {
        const statusOrder = ["Backlog", "To Do", "In Progress", "In Review", "Done"];
        const aIndex = statusOrder.indexOf(a.status);
        const bIndex = statusOrder.indexOf(b.status);
        return aIndex - bIndex;
      });
      
      callback(sortedTasks);
    },
    () => {
      callback([]);
    }
  );
};

// Update task status when dragging
export const updateTaskStatus = async (
  projectId: string,
  taskId: string,
  newStatus: string
): Promise<void> => {
  const taskRef = doc(db, "projects", projectId, "tasks", taskId);
  
  // Update the task status directly
  await updateDoc(taskRef, {
    status: newStatus
  });
};

// Add a new task to a project
export const addTask = async (
  projectId: string,
  task: Omit<FirebaseTask, 'id'>
): Promise<string> => {
  const tasksRef = collection(db, "projects", projectId, "tasks");
  
  // Add the new task to the tasks subcollection
  const docRef = await addDoc(tasksRef, {
    ...task,
    projectId: projectId
  });
  
  return docRef.id;
};

// Update a task
export const updateTask = async (
  projectId: string,
  taskId: string,
  updates: Partial<FirebaseTask>
): Promise<void> => {
  const taskRef = doc(db, "projects", projectId, "tasks", taskId);
  
  // Update the task directly
  await updateDoc(taskRef, updates);
};

// Delete a task
export const deleteTask = async (
  projectId: string,
  taskId: string
): Promise<void> => {
  const taskRef = doc(db, "projects", projectId, "tasks", taskId);
  
  // Delete the task directly
  await deleteDoc(taskRef);
};
