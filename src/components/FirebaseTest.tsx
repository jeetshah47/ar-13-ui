import React, { useState } from "react";
import { Box, Button, Typography, Alert } from "@mui/material";
import { seedFirebaseTasks } from "../utils/seedFirebaseTasks";
import { addTask } from "../services/firebaseTaskService";

const FirebaseTest: React.FC = () => {
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string>("");

  const testConnection = async () => {
    try {
      setError("");
      setStatus("Testing Firebase connection...");
      
      // Try to add a simple task
      await addTask({
        subject: "Test Task",
        code: "TEST001",
        status: "Backlog",
        duration: new Date(),
        priority: "Low",
        assignTo: ["test-user"],
        projectId: "test-project",
      });
      
      setStatus("✅ Firebase connection successful!");
    } catch (err) {
      setError(`❌ Firebase connection failed: ${err}`);
      setStatus("");
    }
  };

  const seedData = async () => {
    try {
      setError("");
      setStatus("Seeding sample data...");
      
      await seedFirebaseTasks("test-project");
      
      setStatus("✅ Sample data seeded successfully!");
    } catch (err) {
      setError(`❌ Failed to seed data: ${err}`);
      setStatus("");
    }
  };

  return (
    <Box sx={{ p: 2, maxWidth: 400 }}>
      <Typography variant="h6" gutterBottom>
        Firebase Test
      </Typography>
      
      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        <Button 
          variant="contained" 
          onClick={testConnection}
          disabled={!!status}
        >
          Test Connection
        </Button>
        
        <Button 
          variant="outlined" 
          onClick={seedData}
          disabled={!!status}
        >
          Seed Data
        </Button>
      </Box>
      
      {status && (
        <Alert severity="success" sx={{ mb: 1 }}>
          {status}
        </Alert>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 1 }}>
          {error}
        </Alert>
      )}
      
      <Typography variant="body2" color="text.secondary">
        Make sure your Firestore security rules allow read/write access.
      </Typography>
    </Box>
  );
};

export default FirebaseTest;
