import React, { useState } from 'react';
import { Box, Typography, Button, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress } from '@mui/material';

const EventLogs: React.FC = () => {
  const [columns, setColumns] = useState<string[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLoading(true);
      const reader = new FileReader();

      reader.onload = () => {
        if (typeof reader.result === 'string') {
          const lines = reader.result.split(/\r\n|\n|\r/).filter(line => line.trim() !== '');
          console.log(lines)
          if (lines.length > 0) {
            const header = lines[0].split(',').map(cell => cell.trim());
            const dataRows = lines.slice(1, 101).map(line => line.split(',').map(cell => cell.trim()));
            setColumns(header);
            setRows(dataRows);
          }
        }
        setLoading(false);
      };
      reader.onerror = () => {
        console.error('Error reading file');
        setLoading(false);
      };
      reader.readAsText(file);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: '100vh',
        padding: 2
      }}
    >
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Event Logs Viewer
      </Typography>

      <Typography variant="body2" sx={{fontSize: '0.875rem', textAlign: "center"}}>
        Choose any .csv file containg event logs to visualise them.<br/>
        It may be useful later - you will need tasks and roles columns!
      </Typography>

      <Button variant="contained" component="label" sx={{ marginTop: 1}}>
        Upload CSV
        <input type="file" hidden accept=".csv" onChange={handleFileUpload} />
      </Button>

      {loading && (
        <CircularProgress sx={{ marginTop: 2 }} />
      )}

      {!loading && rows.length > 0 && (
        <Box sx={{ marginTop: 4, overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((col, index) => (
                  <TableCell key={index} sx={{ fontWeight: 'bold' }}>
                    {col}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((_, colIndex) => (
                    <TableCell key={colIndex}>
                      {row[colIndex]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}
    </Box>
  );
};

export default EventLogs;
