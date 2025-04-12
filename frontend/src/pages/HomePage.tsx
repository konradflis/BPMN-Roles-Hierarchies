import React, {useState} from "react";
import {Typography, Box, CircularProgress} from "@mui/material";
import BpmnViewerComponent from '../components/BPMNViewer';



const HomePage: React.FC = ({}) => {
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
          marginTop: '520px',
          padding: 2,
        }}
      >
        <Typography variant="h4" gutterBottom>
          BPMN File Upload
        </Typography>
        <input type="file" accept=".bpmn" onChange={handleFileUpload} />
        {loading ? (
          <CircularProgress sx={{ marginTop: 2 }} />
        ) : (
          <BpmnViewerComponent bpmnXml={bpmnXml} />
        )}
      </Box>
  );
};

export default HomePage;