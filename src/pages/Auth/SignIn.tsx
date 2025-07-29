import { Box, Button, TextField, Typography } from "@mui/material";
import defaultTheme from "../../theme";
import { useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_API_KEY,
  authDomain: import.meta.env.VITE_APP_AUTHDOMAIN,
  projectId: import.meta.env.VITE_APP_PROJECTID,
  // ... other config fields as needed
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      // Get ID token
      const token = await user.getIdToken();
      localStorage.setItem("token", token);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100%", width: "100%" }}>
      <Box
        sx={{
          width: "50%",
          backgroundColor: defaultTheme.palette.primary.main,
          p: 6,
          display: "flex",
          //   alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Typography color="white" fontWeight={"bold"} variant="h3">
          Your place to work Plan. Create. Control.
        </Typography>
        <img width={"80%"} src="/illustration/workspace.svg" />
      </Box>
      <Box
        sx={{
          width: "50%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h6" fontWeight={"bold"}>
          Sign in to woorkroom
        </Typography>
        <Box sx={{ py: 2, width: "50%" }}>
          <TextField
            fullWidth
            label="First Name"
            placeholder="First Name"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
          />
          <Box sx={{ py: 2 }} />
          <TextField
            fullWidth
            label="Password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
          />
          <Box sx={{ py: 2 }} />
          <Button variant="contained" onClick={handleSubmit}>
            Login
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default SignIn;
