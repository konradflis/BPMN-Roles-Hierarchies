import React, {useState} from "react";
import {Typography, Box, Grid, Paper} from "@mui/material";
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
                marginTop: '200px',
                padding: 2,
            }}
        >
            <Grid container spacing={12} justifyContent="center">
                {/* First Column */}
                <Grid item xs={12} md={4}>
                    <Box
                        sx={{
                            border: '2px solid #202122',
                            padding: 2,
                            borderRadius: 3,
                            minWidth: 400,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: 300,
                            flexDirection: 'column',
                        }}
                    >
                        <Typography variant="h6" gutterBottom fontWeight="bold">
                            About the project
                        </Typography>
                        <Typography variant="body2" align="center">
                            This project aims to automate adding roles to BPMN model. Doing so manually is a painstaking process.
                            We created a backend algorithm that process .xml structure based on event logs with roles,
                            automatically assigning tasks to swimlanes and moving them up and down.
                        </Typography>
                    </Box>
                </Grid>

                {/* Second Column */}
                <Grid item xs={12} md={4}>
                    <Box
                        sx={{
                            border: '2px solid #202122',
                            padding: 2,
                            borderRadius: 3,
                            minWidth: 400,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: 300,
                            flexDirection: 'column',
                            marginTop: 20,
                        }}
                    >
                        <Typography variant="h6" gutterBottom fontWeight='bold'>
                            How to use this website
                        </Typography>
                        <Typography variant="body2" align="center">
                            You can preview your event logs (in .csv format) in Visualise Event Logs tab.
                            To preview any BPMN model (no matter with or without roles), see Visualise Any BPMN Model tab.
                            To use the algorithm adding roles, please see Adding Roles tab and follow the uploading instructions there.
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default HomePage;