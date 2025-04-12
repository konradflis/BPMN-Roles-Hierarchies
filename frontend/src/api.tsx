import axios from 'axios';

const API_URL = 'http://localhost:5000/upload';

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