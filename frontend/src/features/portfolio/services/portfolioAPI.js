import api from '../../auth/services/authAPI';

export const createPortfolio = async (formData) => {
    const response = await api.post('/portfolio/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const getAllPortfolios = async () => {
    const response = await api.get('/portfolio/all');
    return response.data;
};

export const getAllMyPortfolios = async () => {
    const response = await api.get('/portfolio/my-portfolios');
    return response.data;
};

export const updatePortfolio = async (id, formData) => {
    const response = await api.post(`/portfolio/update/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const deletePortfolio = async (id) => {
    const response = await api.post(`/portfolio/delete/${id}`);
    return response.data;
};