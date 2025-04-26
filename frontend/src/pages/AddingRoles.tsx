import React, {useState} from "react";
import {Typography, Box, CircularProgress, Button} from "@mui/material";
import BpmnViewerComponent from '../components/BPMNViewer';



const AddingRoles: React.FC = ({}) => {
    const [bpmnXml, setBpmnXml] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        setLoading(true);
        try {
            const reader = new FileReader();
            reader.onload = () => {
                if (typeof reader.result === 'string') {
                    const content: string = reader.result;
                    console.log('BPMN XML content:', content);
                    setBpmnXml(content);
                } else {
                    console.error('Failed to read the file content as a string');
                }
            };
            reader.readAsText(file);
        } catch (error) {
            console.error('Error uploading file:', error);
        } finally {
            setLoading(false);
        }
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
        <Typography variant="body2" sx={{fontSize: '0.875rem', textAlign: "center"}}>
            Let's add the roles!<br/>
            Please follow the steps below.
        </Typography>
        <Button variant="contained" component="label" sx={{marginTop: 1}}>
            Upload BPMN
        <input type="file" hidden accept=".bpmn" onChange={handleFileUpload} />
        </Button>
        <Box sx={{ marginTop: 4, width: '100%' }}>
          {loading ? (
            <CircularProgress sx={{ marginTop: 2 }} />
          ) : (
            <BpmnViewerComponent bpmnXml={bpmnXml} />
          )}
        </Box>
      </Box>
  );
};

export default AddingRoles;