import { Box, Button, SvgIcon, TextField, Typography } from "@mui/material";
import CrossIcon from "../../../assets/icons/general/calendar-6.svg?react";
import { IOSSwitch } from "../../../common/components/Switch/IOSswitch";

type EventFormProps = {
  date: Date | null;
  onClose: () => void;
};

const EventForm = ({ date, onClose }: EventFormProps) => {
  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        borderRadius: "24px",
        padding: "28px",
        width: "500px",
        height: "inherit",
        overflow: "auto"
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingY: "30px",
        }}
      >
        <Typography fontWeight={"bold"} variant="h6">
          Add Event
        </Typography>
        <Box
          sx={{
            background: "#F4F9FD",
            borderRadius: "14px",
            display: "flex",
            padding: "8px",
            cursor: "pointer",
          }}
          // onClick={(handleCrossClick)}
        >
          <SvgIcon fontSize="small" component={CrossIcon} onClick={onClose} />
        </Box>
      </Box>
      <Box>
        <Box sx={{ width: "100%", paddingTop: "10px" }}>
          <Typography
            color="secondary"
            sx={{ fontWeight: "bold", fontSize: "14px" }}
          >
            Event Name
          </Typography>
          <TextField
            sx={{ width: "100%", paddingTop: "7px" }}
            placeholder="Enter Project Name"
          />
        </Box>
      </Box>
      <Box>
        <Box sx={{ width: "100%", paddingTop: "10px" }}>
          <Typography
            color="secondary"
            sx={{ fontWeight: "bold", fontSize: "14px" }}
          >
            Event Category
          </Typography>
          <TextField
            sx={{ width: "100%", paddingTop: "7px" }}
            placeholder="Enter Project Name"
          />
        </Box>
      </Box>
      <Box>
        <Box sx={{ width: "100%", paddingTop: "10px" }}>
          <Typography
            color="secondary"
            sx={{ fontWeight: "bold", fontSize: "14px" }}
          >
            Priority
          </Typography>
          <TextField
            sx={{ width: "100%", paddingTop: "7px" }}
            placeholder="Enter Project Name"
          />
        </Box>
      </Box>
      <Box sx={{ display: "flex", gap: "16px", alignItems: "center" }}>
        <Box>
          <Box sx={{ width: "100%", paddingTop: "10px" }}>
            <Typography
              color="secondary"
              sx={{ fontWeight: "bold", fontSize: "14px" }}
            >
              {date ? "Date" : "Start Date"}
            </Typography>
            <TextField
              sx={{ width: "100%", paddingTop: "7px" }}
              placeholder="Enter Project Name"
              type="date"
              value={date}
            />
          </Box>
        </Box>
        <Box>
          <Box sx={{ width: "100%", paddingTop: "10px" }}>
            <Typography
              color="secondary"
              sx={{ fontWeight: "bold", fontSize: "14px" }}
            >
              Time
            </Typography>
            <TextField
              sx={{ width: "100%", paddingTop: "7px" }}
              placeholder="Select Time"
              type="time"
            />
          </Box>
        </Box>
      </Box>
      <Box sx={{ width: "100%", paddingTop: "10px" }}>
        <Typography
          color="secondary"
          sx={{ fontWeight: "bold", fontSize: "14px" }}
        >
          Description
        </Typography>
        <TextField
          sx={{ width: "100%", paddingTop: "7px" }}
          placeholder="Enter Project Name"
        />
      </Box>
      <Box
        sx={{
          backgroundColor: "#F4F9FD",
          borderRadius: "14px",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "20px",
        }}
      >
        <Typography fontWeight={"700"}>Repeat Event</Typography>
        <IOSSwitch sx={{ m: 1 }} defaultChecked />
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          paddingTop: "12px",
          gap: "16px",
        }}
      >
        <Box
          sx={{
            paddingY: "12px",
            flex: 1,
            border: "1px solid #D8E0F0",
            borderRadius: "10px",
            backgroundColor: "primary.main",
            textAlign: "center",
            color: "#fff",
            fontWeight: "600",
          }}
        >
          Daily
        </Box>
        <Box
          sx={{
            paddingY: "12px",
            flex: 1,
            border: "1px solid #D8E0F0",
            borderRadius: "10px",
            textAlign: "center",
            color: "secondary.main",
          }}
        >
          Weekly
        </Box>
        <Box
          sx={{
            paddingY: "12px",
            flex: 1,
            border: "1px solid #D8E0F0",
            borderRadius: "10px",
            textAlign: "center",
            color: "secondary.main",
          }}
        >
          Monthly
        </Box>
      </Box>
      <Box>
        <Typography color="secondary.main" fontWeight={700}>
          On these days
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            paddingTop: "12px",
            gap: "12px",
          }}
        >
          <Box
            sx={{
              paddingY: "12px",
              flex: 1,
              border: "1px solid #D8E0F0",
              borderRadius: "10px",
              backgroundColor: "primary.main",
              textAlign: "center",
              color: "#fff",
              fontWeight: "600",
            }}
          >
            Mon
          </Box>
          <Box
            sx={{
              paddingY: "12px",
              flex: 1,
              border: "1px solid #D8E0F0",
              borderRadius: "10px",
              textAlign: "center",
              color: "secondary.main",
            }}
          >
            Tue
          </Box>
          <Box
            sx={{
              paddingY: "12px",
              flex: 1,
              border: "1px solid #D8E0F0",
              borderRadius: "10px",
              textAlign: "center",
              color: "secondary.main",
            }}
          >
            Wed
          </Box>
          <Box
            sx={{
              paddingY: "12px",
              flex: 1,
              border: "1px solid #D8E0F0",
              borderRadius: "10px",
              backgroundColor: "primary.main",
              textAlign: "center",
              color: "#fff",
              fontWeight: "600",
            }}
          >
            Thur
          </Box>
          <Box
            sx={{
              paddingY: "12px",
              flex: 1,
              border: "1px solid #D8E0F0",
              borderRadius: "10px",
              textAlign: "center",
              color: "secondary.main",
            }}
          >
            Fri
          </Box>
          <Box
            sx={{
              paddingY: "12px",
              flex: 1,
              border: "1px solid #D8E0F0",
              borderRadius: "10px",
              textAlign: "center",
              color: "secondary.main",
            }}
          >
            Sat
          </Box>
          <Box
            sx={{
              paddingY: "12px",
              flex: 1,
              border: "1px solid #D8E0F0",
              borderRadius: "10px",
              textAlign: "center",
              color: "secondary.main",
            }}
          >
            Sun
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flex: 1,
          justifyContent: "end",
          paddingY: "12px",
          alignItems: "center",
        }}
      >
        <Button variant="contained">Save Event</Button>
      </Box>
    </Box>
  );
};

export default EventForm;
