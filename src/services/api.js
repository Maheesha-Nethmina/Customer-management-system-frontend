import axios from 'axios';

// The base URL where your Spring Boot server is running
const API_URL = 'http://localhost:8080/api/customers';

const api = {
    // 1. UPDATED: Get paginated customers for the table view
    // Defaulting to page 0 and size 50 as we discussed
    getAllCustomers: (page = 0, size = 50) => {
        return axios.get(`${API_URL}/all?page=${page}&size=${size}`);
    },

    // 2. Get a single customer's full details
    getCustomerById: (id) => {
        return axios.get(`${API_URL}/view/${id}`);
    },

    // 3. Create a new customer manually
    createCustomer: (customerData) => {
        return axios.post(`${API_URL}/create`, customerData);
    },

    // 4. Update an existing customer
    updateCustomer: (id, customerData) => {
        return axios.put(`${API_URL}/update/${id}`, customerData);
    },

    // 5. Upload the bulk Excel file (1,000,000 records)
    uploadBulkExcel: (file) => {
        const formData = new FormData();
        formData.append("file", file);
        
        // We MUST set the content type to multipart/form-data for files
        return axios.post(`${API_URL}/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }
};

export default api;