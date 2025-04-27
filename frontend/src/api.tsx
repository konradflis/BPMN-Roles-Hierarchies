import axios from 'axios';

const API_URL = 'http://localhost:8000/upload';

export const uploadBpmn = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await axios.post(API_URL, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error uploading BPMN file:', error);
        throw error;
    }
};

export const sendFilesToBackend = async (data: {
  bpmnFile: File;
  csvFile: File;
  taskColumn: string;
  roleColumn: string;
}) => {
  const formData = new FormData();
  formData.append('bpmnFile', data.bpmnFile);
  formData.append('csvFile', data.csvFile);
  formData.append('taskColumn', data.taskColumn);
  formData.append('roleColumn', data.roleColumn);

  try {
    const response = await axios.post('http://localhost:8000/api/add-roles', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error sending to backend:', error);
    throw error;
  }
};