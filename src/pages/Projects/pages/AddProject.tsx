import {
  Box,
  Button,
  SvgIcon,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  OutlinedInput,
  Chip,
} from "@mui/material";
import PageHeader from "../../../common/components/PageHeader/PageHeader";
import Icon1 from "../../../assets/icons/project/Image-1.svg?react";
import Icon2 from "../../../assets/icons/project/Image-2.svg?react";
import Icon3 from "../../../assets/icons/project/Image-3.svg?react";
import Icon4 from "../../../assets/icons/project/Image-4.svg?react";
import Icon5 from "../../../assets/icons/project/Image-5.svg?react";
import Icon6 from "../../../assets/icons/project/Image-6.svg?react";
import Icon7 from "../../../assets/icons/project/Image-7.svg?react";
import Icon8 from "../../../assets/icons/project/Image-8.svg?react";
import Icon9 from "../../../assets/icons/project/Image-9.svg?react";
import Icon10 from "../../../assets/icons/project/Image-10.svg?react";
import Icon from "../../../assets/icons/project/Image.svg?react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { addProjectAction } from "../../../store/features/projects/projectAction";
import type { AppDispatch, RootState } from "../../../store/store";
import { getUsersAction } from "../../../store/features/user/userAction";
import type { SelectChangeEvent } from "@mui/material";
import { DateRangePicker } from "../../../common/components/DateRangePicker/DateRangePicker";

const AddProject = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { users } = useSelector((state: RootState) => state.userReducer);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadLine: "",
    membersIds: [] as string[],
    ownerId: localStorage.getItem("uid") ?? "",
    logoUrl: "",
  });

  useEffect(() => {
    dispatch(getUsersAction());
  }, [dispatch]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      deadLine: endDate ? endDate.toISOString() : "",
    }));
  }, [endDate]);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string[]>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    dispatch(
      addProjectAction(formData, () => {
        navigate("/app/projects");
      })
    );
  };

  const arrayIcons = [
    { name: "Icon", component: Icon },
    { name: "Icon1", component: Icon1 },
    { name: "Icon2", component: Icon2 },
    { name: "Icon3", component: Icon3 },
    { name: "Icon4", component: Icon4 },
    { name: "Icon5", component: Icon5 },
    { name: "Icon6", component: Icon6 },
    { name: "Icon7", component: Icon7 },
    { name: "Icon8", component: Icon8 },
    { name: "Icon9", component: Icon9 },
    { name: "Icon10", component: Icon10 },
  ];

  const handleIconClick = (iconName: string) => {
    setFormData({ ...formData, logoUrl: iconName });
  };
  return (
    <Box
      sx={{
        backgroundColor: "background.paper",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <PageHeader title="Add Project" />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyItems: "center",
          gap: "24px",
          width: "100%",
        }}
      >
        <Box sx={{ width: "50%", padding: "12px 16px" }}>
          <Box sx={{ width: "100%", paddingTop: "16px" }}>
            <Typography color="secondary" sx={{ fontWeight: "bold" }}>
              Project Name
            </Typography>
            <TextField
              sx={{ width: "100%" }}
              placeholder="Enter Project Name"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
          </Box>
          <Box sx={{ width: "100%", paddingTop: "16px" }}>
            <Typography color="secondary" sx={{ fontWeight: "bold" }}>
              Select Date
            </Typography>
            <DateRangePicker
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
            />
          </Box>
          <Box sx={{ width: "100%", paddingTop: "16px" }}>
            <Typography color="secondary" sx={{ fontWeight: "bold" }}>
              Description
            </Typography>
            <TextField
              sx={{ width: "100%" }}
              placeholder="Enter Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </Box>
          <Box sx={{ width: "100%", paddingTop: "16px" }}>
            <Typography color="secondary" sx={{ fontWeight: "bold" }}>
              Team Members
            </Typography>
            <FormControl sx={{ width: "100%" }}>
              <InputLabel>Team Members</InputLabel>
              <Select
                multiple
                value={formData.membersIds}
                onChange={handleChange}
                input={<OutlinedInput label="Team Members" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip
                        key={value}
                        label={
                          users.find((user) => user.id === value)?.name ?? ""
                        }
                      />
                    ))}
                  </Box>
                )}
                name="membersIds"
              >
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
        <Box
          sx={(theme) => ({
            background: theme.palette.primary.light,
            border: `1px solid ${theme.palette.grey[300]}`,
            borderRadius: "24px",
            padding: "24px",
            width: "30%",
          })}
        >
          <Typography sx={{ fontSize: "18px", fontWeight: "bold" }}>
            Select image
          </Typography>
          <Typography color="secondary" sx={{ padding: "12px 0px" }}>
            Select or upload an avatar for the project (available formats: jpg,
            png)
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
            {arrayIcons.map((icon, index) => (
              <SvgIcon
                key={index}
                sx={{
                  width: "48px",
                  height: "48px",
                  cursor: "pointer",
                  border:
                    formData.logoUrl === icon.name
                      ? "2px solid #3F8CFF"
                      : "none",
                }}
                component={icon.component}
                onClick={() => handleIconClick(icon.name)}
              />
            ))}
          </Box>
        </Box>
      </Box>
      <Box>
        <Button variant="contained" onClick={handleSubmit}>
          Save Project
        </Button>
      </Box>
    </Box>
  );
};

export default AddProject;
