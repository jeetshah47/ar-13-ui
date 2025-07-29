import { Box } from "@mui/material";

type ModalProps = {
  show: boolean;
  onClose: () => void;
};

const Modal = ({ onClose, show }: ModalProps) => {
  return (
    <Box
      sx={{
        backgroundColor: "rgba(33, 85, 163, 0.16)",
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        justifyItems: "center",
        alignItems: "center",
        display: show ? "block" : "none",
      }}
      onClick={onClose}
    >
      Modal
    </Box>
  );
};

export default Modal;
