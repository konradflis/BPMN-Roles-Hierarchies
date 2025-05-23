import React, { useEffect, useRef, useState } from 'react';
import NavigatedViewer from 'bpmn-js/lib/NavigatedViewer';
import { CircularProgress, Box, Typography, Grid, Button } from '@mui/material';

const BpmnViewerComponent: React.FC<{ bpmnXml: string }> = ({ bpmnXml }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [viewer, setViewer] = useState<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const newViewer = new NavigatedViewer({
      container: containerRef.current,
    });

    newViewer
      .importXML(bpmnXml)
      .then(() => {
        setLoading(false);
        const canvas = newViewer.get('canvas') as any;

        const svg = canvas.getContainer().querySelector('svg');
        if (svg) {
          svg.style.background = '#ffffff';
        }
        canvas.zoom('fit-viewport');

        const modeling = newViewer.get('modeling') as any;
        const elementRegistry = newViewer.get('elementRegistry') as any;

        elementRegistry.filter((element: any) => element.businessObject.$type === 'bpmn:Task')
          .forEach((task: any) => {
            modeling.setColor(task, {
              fill: '#ffd700',
              stroke: '#ff0000'
            });
          });


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