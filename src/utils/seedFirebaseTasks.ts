import { doc, setDoc, collection, addDoc } from "firebase/firestore";
import { db } from "../config/firebase";

// Sample project data
const sampleProject = {
  title: "Sample Project",
  description: "A sample project for testing the drag and drop board",
  ownerId: "user1",
  membersIds: ["user1", "user2", "user3", "user4"],
  deadLine: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
};

// Sample tasks data
const sampleTasks = [
  {
    subject: "Animation for buttons",
    code: "TS0001245",
    status: "Backlog",
    duration: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours from now
    priority: "Low",
    assignTo: ["user1"],
    projectId: "project1",
  },
  {
    subject: "Animation for Landing page",
    code: "TS0001246",
    status: "Backlog",
    duration: new Date(Date.now() + 8 * 60 * 60 * 1000),
    priority: "Low",
    assignTo: ["user1"],
    projectId: "project1",
  },
  {
    subject: "Preloader",
    code: "TS0001247",
    status: "Backlog",
    duration: new Date(Date.now() + 6 * 60 * 60 * 1000),
    priority: "Low",
    assignTo: ["user1"],
    projectId: "project1",
  },
  {
    subject: "UX sketches",
    code: "TS0001248",
    status: "In Progress",
    duration: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
    priority: "Medium",
    assignTo: ["user2"],
    projectId: "project1",
  },
  {
    subject: "Mind Map",
    code: "TS0001249",
    status: "In Progress",
    duration: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000), // 2d 4h
    priority: "Medium",
    assignTo: ["user2"],
    projectId: "project1",
  },
  {
    subject: "UX Login + Registration",
    code: "TS0001250",
    status: "In Progress",
    duration: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    priority: "Medium",
    assignTo: ["user2"],
    projectId: "project1",
  },
  {
    subject: "Research reports",
    code: "TS0001251",
    status: "In Review",
    duration: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    priority: "Medium",
    assignTo: ["user3"],
    projectId: "project1",
  },
  {
    subject: "Research",
    code: "TS0001252",
    status: "In Review",
    duration: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    priority: "Medium",
    assignTo: ["user3"],
    projectId: "project1",
  },
  {
    subject: "Research reports (presentation for client)",
    code: "TS0001253",
    status: "In Review",
    duration: new Date(Date.now() + 6 * 60 * 60 * 1000),
    priority: "Low",
    assignTo: ["user3"],
    projectId: "project1",
  },
  {
    subject: "UI Login + Registration\n(+ other screens)",
    code: "TS0001254",
    status: "Done",
    duration: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000), // 1d 6h
    priority: "Medium",
    assignTo: ["user4"],
    projectId: "project1",
  },
];

export const seedFirebaseTasks = async (projectId: string = "project1"): Promise<void> => {
  try {
    // Create the project document
    const projectRef = doc(db, "projects", projectId);
    await setDoc(projectRef, {
      ...sampleProject,
      id: projectId,
    }, { merge: true });
    
    // Add tasks to the tasks subcollection
    const tasksRef = collection(db, "projects", projectId, "tasks");
    
    for (const task of sampleTasks) {
      const taskWithProjectId = { ...task, projectId };
      await addDoc(tasksRef, taskWithProjectId);
    }
  } catch {
    // Error seeding project and tasks
  }
};

// Function to clear all tasks for a project
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const clearProjectTasks = async (projectId: string): Promise<void> => {
  try {
    // Note: In a real app, you'd want to batch delete or use a cloud function
    // For now, this is just a placeholder
    // projectId parameter is kept for API consistency
  } catch {
    // Error clearing tasks
  }
};
