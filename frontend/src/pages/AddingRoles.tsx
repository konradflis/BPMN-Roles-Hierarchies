import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Checkbox,
  FormControlLabel
} from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import BpmnViewerComponent from "../components/BPMNViewer";

const AddingRoles: React.FC = () => {
  const [bpmnFile, setBpmnFile] = useState<File | null>(null);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [columns, setColumns] = useState<string[]>([]);
  const [taskColumn, setTaskColumn] = useState<string>("");
  const [roleColumn, setRoleColumn] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [modifiedBpmnXml, setModifiedBpmnXml] = useState<string>("");
  const [adjustInOut, setAdjustInOut] = useState<boolean>(false); // Stan dla checkboxa
  const [useOptimal, setUseOptimal] = useState(false);

  const [bpmnUploaded, setBpmnUploaded] = useState(false);
  const [csvUploaded, setCsvUploaded] = useState(false);

  const [roles, setRoles] = useState<string[]>([]);
  const [roleOrder, setRoleOrder] = useState<string[]>([]);
  const [rolesFetched, setRolesFetched] = useState(false);

  const handleBpmnUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setBpmnFile(file);
      setBpmnUploaded(true);
    }
  };

  const handleCsvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCsvFile(file);
      setCsvUploaded(true);
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          const lines = reader.result
            .split(/\r\n|\n|\r/)
            .filter((line) => line.trim() !== "");
          if (lines.length > 0) {
            const headers = lines[0].split(",").map((cell) => cell.trim());
            setColumns(headers);
          }
        }
      };
      reader.readAsText(file);
    }
  };

  const fetchRolesFromBackend = async () => {
    if (!csvFile || !taskColumn || !roleColumn) return;

    const formData = new FormData();
    formData.append("csvFile", csvFile);
    formData.append("taskColumn", taskColumn);
    formData.append("roleColumn", roleColumn);

    const response = await fetch("api/extract-roles", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    setRoles(data.roles);
    setRoleOrder(data.roles);
    setRolesFetched(true);
  };

  useEffect(() => {
    if (taskColumn && roleColumn && csvFile) {
      fetchRolesFromBackend();
    }
  }, [taskColumn, roleColumn]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
    const sourceIndex = Number(e.dataTransfer.getData("text/plain"));
    const updated = [...roleOrder];
    const [moved] = updated.splice(sourceIndex, 1);
    updated.splice(targetIndex, 0, moved);
    setRoleOrder(updated);
  };

  const handleSendToBackend = async () => {
  if (!bpmnFile || !csvFile || !taskColumn || !roleColumn) {
    alert("Upload files and select columns first!");
    return;
  }

  setLoading(true);
  try {
    const formData = new FormData();
    formData.append("bpmnFile", bpmnFile);
    formData.append("csvFile", csvFile);
    formData.append("adjust_in_out", adjustInOut.toString());
    formData.append("taskColumn", taskColumn);
    formData.append("roleColumn", roleColumn);

    if (!useOptimal) {
      formData.append("role_order", JSON.stringify(roleOrder));
    }

    const endpoint = useOptimal ? "api/add-roles-optim" : "api/add-roles";

    const response = await fetch(endpoint, {
      method: "POST",
      body: formData,
    });

    const result = await response.text();
    setModifiedBpmnXml(result);
  } catch (error) {
    console.error("Error sending to backend:", error);
  } finally {
    setLoading(false);
  }
};

  return (
    <Box
      component="main"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 2,
      }}
    >
      <Typography variant="h5" gutterBottom fontWeight="bold">
        BPMN File Upload
      </Typography>

      <Typography variant="body2" sx={{ fontSize: "0.875rem", textAlign: "center" }}>
        Let's add the roles!
        <br />
        Please follow the steps below.
      </Typography>

      <Box
        sx={{
          border: "2px solid #202122",
          padding: 2,
          borderRadius: 3,
          minWidth: 600,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          marginTop: 3,
        }}
      >
        <Typography variant="body2" sx={{ fontSize: "0.875rem", textAlign: "center" }}>
          Select the BPMN model that you would like to add roles to.
        </Typography>
        <Button variant="contained" component="label" sx={{ marginTop: 1 }}>
          Upload BPMN
          <input type="file" hidden accept=".bpmn" onChange={handleBpmnUpload} />
        </Button>
        {bpmnUploaded && <CheckCircle sx={{ color: "black", fontSize: 24, marginTop: 1 }} />}
      </Box>

      <Box
        sx={{
          border: "2px solid #202122",
          padding: 2,
          borderRadius: 3,
          minWidth: 600,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          marginTop: 2,
        }}
      >
        <Typography variant="body2" sx={{ fontSize: "0.875rem", textAlign: "center" }}>
          Choose the event logs associated with the uploaded BPMN model.
        </Typography>

        <Button variant="contained" component="label" sx={{ marginTop: 1 }}>
          Upload CSV
          <input type="file" hidden accept=".csv" onChange={handleCsvUpload} />
        </Button>
        {csvUploaded && <CheckCircle sx={{ color: "black", fontSize: 24, marginTop: 1 }} />}
      </Box>

      {columns.length > 0 && (
        <Box sx={{ marginTop: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              border: "2px solid #202122",
              padding: 2,
              borderRadius: 3,
              minWidth: 600,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Typography variant="body2" sx={{ fontSize: "0.875rem", textAlign: "center" }}>
              Select the columns from event logs that should be treated as roles and activities.
            </Typography>
            <Box
              sx={{
                backgroundColor: "#202122",
                padding: 2,
                borderRadius: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                marginTop: 2,
                color: "white", // Ustawia biały kolor tekstu wewnątrz Boxa
              }}
            >
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel id="task-column-label" sx={{ color: "white" }}>Task Column</InputLabel>
                <Select
                  labelId="task-column-label"
                  value={taskColumn || ""}
                  label="Task Column"
                  onChange={(e) => setTaskColumn(e.target.value)}
                  sx={{ color: "white", '& .MuiSvgIcon-root': { color: 'white' } }}
                >
                  {columns.map((col) => (
                    <MenuItem key={col} value={col}>
                      {col}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel id="role-column-label" sx={{ color: "white" }}>Role Column</InputLabel>
                <Select
                  labelId="role-column-label"
                  value={roleColumn || ""}
                  label="Role Column"
                  onChange={(e) => setRoleColumn(e.target.value)}
                  sx={{ color: "white", '& .MuiSvgIcon-root': { color: 'white' } }}
                >
                  {columns.map((col) => (
                    <MenuItem key={col} value={col}>
                      {col}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={adjustInOut}
                    onChange={(e) => setAdjustInOut(e.target.checked)}
                    name="adjustInOut"
                    sx={{
                      color: "white",
                      '&.Mui-checked': {
                        color: "#00e676", // Zielony checkbox gdy zaznaczony
                      },
                      '& .MuiSvgIcon-root': {
                        fontSize: 26,
                      },
                    }}
                  />
                }
                label="Adjust In/Out"
                sx={{ color: "white" }}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={useOptimal}
                    onChange={(e) => setUseOptimal(e.target.checked)}
                    name="useOptimal"
                    sx={{
                      color: "white",
                      '&.Mui-checked': {
                        color: "#00e676",
                      },
                      '& .MuiSvgIcon-root': {
                        fontSize: 26,
                      },
                    }}
                  />
                }
                label="Use Optimal Scenario"
                sx={{ color: "white" }}
              />
            </Box>

            {taskColumn && roleColumn && (
              <CheckCircle sx={{ color: "white", fontSize: 24, marginTop: 1 }} />
            )}

          </Box>

          {rolesFetched && !useOptimal &&(
            <Box sx={{ marginTop: 4, width: 600 }}>
              <Typography variant="h6" gutterBottom>
                Sort roles:
              </Typography>
              <Box
                sx={{
                  border: "1px solid #ccc",
                  borderRadius: 2,
                  padding: 2,
                  backgroundColor: "#f7f7f7",
                }}
              >
                {roleOrder.map((role, index) => (
                  <Box
                    key={role}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDrop(e, index)}
                    sx={{
                      padding: 1,
                      marginY: 1,
                      backgroundColor: "white",
                      borderRadius: 1,
                      cursor: "move",
                      boxShadow: 1,
                      "&:hover": {
                        backgroundColor: "#eee",
                      },
                    }}
                  >
                    {role}
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          <Button
            variant="contained"
            color="primary"
            onClick={handleSendToBackend}
            sx={{ marginTop: 2 }}
            disabled={!taskColumn || !roleColumn || !bpmnUploaded || !csvUploaded}
          >
            Generate BPMN with Roles
          </Button>
        </Box>
      )}

      <Box sx={{ marginTop: 4, width: "100%" }}>
        {loading ? (
          <CircularProgress sx={{ marginTop: 2 }} />
        ) : (
          <BpmnViewerComponent bpmnXml={modifiedBpmnXml || ""} />
        )}
      </Box>
    </Box>
  );
};

export default AddingRoles;
