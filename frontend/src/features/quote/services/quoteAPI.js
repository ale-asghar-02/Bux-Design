import api from '../../auth/services/authAPI';

export const createQuote = async ({ username, email, service, budget, projectDescription }) => {
    const response = await api.post('/quote/create', { username, email, service, budget, projectDescription });
    return response.data;
}

export const getAllQuote = async () => {
    const response = await api.get('/quote/all');
    return response.data;
}

export const updateQuoteStatus = async (id, status) => {
    const response = await api.post(`/quote/status/${id}`, { status });
    return response.data;
}

export const deleteSingleQuote = async (id) => {
    const response = await api.post(`/quote/delete/${id}`);
    return response.data;
}