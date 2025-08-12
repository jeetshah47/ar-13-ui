import { Box } from "@mui/material";

type ModalProps = {
  show: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const Modal = ({ show, children }: ModalProps) => {
  return (
    <Box
      sx={{
        backgroundColor: "rgba(33, 85, 163, 0.16)",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        display: show ? "flex" : "none",
        zIndex: 10,
      }}
    >
      {children}
    </Box>
  );
};

export default Modal;
