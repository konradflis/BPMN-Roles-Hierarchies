import React, { useEffect, useRef, useState } from 'react';
import BpmnViewer from 'bpmn-js/lib/Viewer';
import { CircularProgress, Box, Typography, Grid, Button } from '@mui/material';

const BpmnViewerComponent: React.FC<{ bpmnXml: string }> = ({ bpmnXml }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [viewer, setViewer] = useState<any>(null);

  useEffect(() => {
    const newViewer = new BpmnViewer({
      container: containerRef.current,
      additionalModules: [
        {
          zoomScroll: {
            minZoom: 0.1,
            maxZoom: 2.0,
            scroll: true,
          },
          dragMove: {
            maxScale: 2,
          },
        },
      ],
    });

    newViewer
      .importXML(bpmnXml)
      .then(() => {
        setLoading(false);
        const canvas = newViewer.get('canvas');
        canvas.zoom('fit-viewport');
      })
      .catch((err: Error | null) => {
        console.error('Error rendering BPMN:', err);
        setLoading(false);
      });

    setViewer(newViewer);

    return () => {
      if (newViewer) {
        newViewer.destroy();
      }
    };
  }, [bpmnXml]);

  const handleZoomIn = () => {
    if (viewer) {
      const canvas = viewer.get('canvas');
      const currentZoom = canvas.zoom();
      canvas.zoom(currentZoom * 1.2);
    }
  };

  const handleZoomOut = () => {
    if (viewer) {
      const canvas = viewer.get('canvas');
      const currentZoom = canvas.zoom();
      canvas.zoom(currentZoom / 1.2);
    }
  };

  const handleResetZoom = () => {
    if (viewer) {
      const canvas = viewer.get('canvas');
      canvas.zoom('fit-viewport');
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '600px',
        position: 'relative',
        overflow: 'auto',
        border: '1px solid #ccc',
      }}
    >
      {loading && <CircularProgress sx={{ position: 'absolute', top: '50%', left: '50%' }} />}

      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
        }}
      />

      <Box sx={{ position: 'absolute', bottom: 10, left: 10, zIndex: 100 }}>
        <Button variant="contained" color="primary" onClick={handleZoomIn}>Zoom In</Button>
        <Button variant="contained" color="primary" onClick={handleZoomOut} sx={{ marginLeft: 2 }}>Zoom Out</Button>
        <Button variant="outlined" onClick={handleResetZoom} sx={{ marginLeft: 2 }}>Reset Zoom</Button>
      </Box>
    </Box>
  );
};

export default BpmnViewerComponent;