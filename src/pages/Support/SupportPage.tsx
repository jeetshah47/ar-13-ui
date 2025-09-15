import { Box, Button, SvgIcon } from "@mui/material";
import PageHeader from "../../common/components/PageHeader/PageHeader";
import { useState } from "react";
import Modal from "../../common/components/Modal/Modal";
import SupportModal from "../../common/components/SupportModal/SupportModal";

const SupportPage = () => {
  const [showSupportModal, setShowSupportModal] = useState(false);

  const handleOnCloseModal = () => {
    setShowSupportModal(false);
  };

  const handleOnClickSupportButton = () => {
    setShowSupportModal(true);
  };

  const SupportButton = (
    <Button
      onClick={handleOnClickSupportButton}
      variant="contained"
    >
      Get Support
    </Button>
  );

  return (
    <Box sx={{ height: "100%" }}>
      <PageHeader
        title="Support"
        endElement={SupportButton}
      />
      
      <Box sx={{ padding: "28px 0px" }}>
        <Box
          sx={{
            background: "#FFFFFF",
            borderRadius: "24px",
            boxShadow: "0px 6px 58px rgba(196, 203, 214, 0.103611)",
            padding: "40px",
            textAlign: "center",
          }}
        >
          <h2>Need Help?</h2>
          <p>Click the "Get Support" button to open the support modal and submit your request.</p>
        </Box>
      </Box>

      <Modal onClose={handleOnCloseModal} show={showSupportModal}>
        <SupportModal onClose={handleOnCloseModal} />
      </Modal>
    </Box>
  );
};

export default SupportPage;
