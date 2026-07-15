import api from '../../auth/services/authAPI';

export const generateReviewLink = async (email) => {
    const response = await api.post('/review/generate-link', { email });
    return response.data;
};

export const submitReview = async (token, formData) => {
    const response = await api.post(`/review/submit/${token}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const getAllReviews = async () => {
    const response = await api.get('/review/all');
    return response.data;
};

export const getApprovedReviews = async () => {
    const response = await api.get('/review/approved');
    return response.data;
};

export const updateReviewStatus = async (id, status) => {
    const response = await api.post(`/review/update-status/${id}`, { status });
    return response.data;
};

export const deleteReview = async (id) => {
    const response = await api.post(`/review/delete/${id}`);
    return response.data;
};