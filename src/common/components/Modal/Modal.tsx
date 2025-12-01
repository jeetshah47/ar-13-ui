import { Box, Portal } from "@mui/material";

type ModalProps = {
  show: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const Modal = ({ show, onClose, children }: ModalProps) => {
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only close if clicking directly on the backdrop, not on its children
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!show) return null;

  return (
    <Portal>
      <Box
        onClick={handleBackdropClick}
        sx={{
          backgroundColor: "rgba(33, 85, 163, 0.16)",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100vw",
          height: "100vh",
          minWidth: "100vw",
          minHeight: "100vh",
          maxWidth: "100vw",
          maxHeight: "100vh",
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
          zIndex: 1300,
          overflow: "auto",
          margin: 0,
          padding: 0,
        }}
      >
        {children}
      </Box>
    </Portal>
  );
};

export default Modal;
