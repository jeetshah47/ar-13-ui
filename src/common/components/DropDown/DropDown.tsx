import { useState } from "react";

const DropDown = () => {
  const [status, setStatus] = useState("");
  const colorMaps = {
    success: { bg: "#E0F9F2", text: "#00D097" },
    pending: { bg: "rgba(125,133,146,14%)", text: "#7D8592" },
    progress: { bg: "rgba(63,140,255,11.99%)", text: "#3F8CFF" },
    review: { bg: "rgba(196,24,230,11%)", text: "#C418E6" },
  };
  return <div>DropDown</div>;
};

export default DropDown;
