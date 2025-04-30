import React, { useState } from "react";
import { Box, Button, CircularProgress, Typography, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import BpmnViewerComponent from '../components/BPMNViewer';
import { sendFilesToBackend } from '../api';

const AddingRoles: React.FC = () => {
  const [bpmnFile, setBpmnFile] = useState<File | null>(null);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [columns, setColumns] = useState<string[]>([]);
  const [taskColumn, setTaskColumn] = useState<string>('');
  const [roleColumn, setRoleColumn] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [modifiedBpmnXml, setModifiedBpmnXml] = useState<string>('');

  const [bpmnUploaded, setBpmnUploaded] = useState(false);
  const [csvUploaded, setCsvUploaded] = useState(false);

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
        if (typeof reader.result === 'string') {
          const lines = reader.result.split(/\r\n|\n|\r/).filter(line => line.trim() !== '');
          if (lines.length > 0) {
            const headers = lines[0].split(',').map(cell => cell.trim());
            setColumns(headers);
          }
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSendToBackend = async () => {
    if (!bpmnFile || !csvFile || !taskColumn || !roleColumn) {
      alert("Upload files and select columns first!");
      return;
    }

    setLoading(true);
    try {
      const result = await sendFilesToBackend({
        bpmnFile,
        csvFile,
        taskColumn,
        roleColumn
      });
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
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 2,
      }}
    >
      <Typography variant="h5" gutterBottom fontWeight="bold">
        BPMN File Upload
      </Typography>

      <Typography variant="body2" sx={{ fontSize: '0.875rem', textAlign: "center" }}>
        Let's add the roles!<br />
        Please follow the steps below.<br />
      </Typography>

      <Box
        sx={{
          border: '2px solid #202122',
          padding: 2,
          borderRadius: 3,
          minWidth: 600,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          flexDirection: 'column',
          marginTop: 3,
        }}
      >
        <Typography variant="body2" sx={{ fontSize: '0.875rem', textAlign: "center" }}>
          Select the BPMN model that you would like to add roles to.
        </Typography>
        <Button variant="contained" component="label" sx={{ marginTop: 1 }}>
          Upload BPMN
          <input type="file" hidden accept=".bpmn" onChange={handleBpmnUpload} />
        </Button>
        {bpmnUploaded && <CheckCircle sx={{ color: 'black', fontSize: 24, marginTop: 1 }} />}
      </Box>

      <Box
        sx={{
          border: '2px solid #202122',
          padding: 2,
          borderRadius: 3,
          minWidth: 600,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          flexDirection: 'column',
          marginTop: 2,
        }}
      >
        <Typography variant="body2" sx={{ fontSize: '0.875rem', textAlign: "center" }}>
          Choose the event logs associated with the uploaded BPMN model.<br />
        </Typography>

        <Button variant="contained" component="label" sx={{ marginTop: 1 }}>
          Upload CSV
          <input type="file" hidden accept=".csv" onChange={handleCsvUpload} />
        </Button>
        {csvUploaded && <CheckCircle sx={{ color: 'black', fontSize: 24, marginTop: 1 }} />}
      </Box>

      {columns.length > 0 && (
        <Box sx={{ marginTop: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Box
                sx={{
                  border: '2px solid #202122',
                  padding: 2,
                  borderRadius: 3,
                  minWidth: 600,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                  flexDirection: 'column',
                }}
              >
              <Typography variant="body2" sx={{ fontSize: '0.875rem', textAlign: "center" }}>
                Select the columns from event logs that should be treated as roles and activities. <br />
              </Typography>
              <Box
                sx={{
                  backgroundColor: '#202122',
                  padding: 2,
                  borderRadius: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2,
                  marginTop: 2
                }}
              >
                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel id="task-column-label">Task Column</InputLabel>
                  <Select
                    labelId="task-column-label"
                    value={taskColumn || ''}
                    label="Task Column"
                    onChange={(e) => setTaskColumn(e.target.value)}
                    sx={{color: 'white'}}
                  >
                    {columns.map((col) => (
                      <MenuItem key={col} value={col}>
                        {col}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel id="role-column-label">Role Column</InputLabel>
                  <Select
                    labelId="role-column-label"
                    value={roleColumn || ''}
                    label="Role Column"
                    onChange={(e) => setRoleColumn(e.target.value)}
                    sx={{color: 'white'}}
                  >
                    {columns.map((col) => (
                      <MenuItem key={col} value={col}>
                        {col}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              {taskColumn && roleColumn && <CheckCircle sx={{ color: 'black', fontSize: 24, marginTop: 1 }} />}
            </Box>

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

      <Box sx={{ marginTop: 4, width: '100%' }}>
        {loading ? (
          <CircularProgress sx={{ marginTop: 2 }} />
        ) : (
          <BpmnViewerComponent bpmnXml={modifiedBpmnXml || ''} />
        )}
      </Box>
    </Box>
  );
};

export default AddingRoles;
