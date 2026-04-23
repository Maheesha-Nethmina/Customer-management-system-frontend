import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Dashboard = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // States for the Excel Upload Modal
  const [showModal, setShowModal] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');

  // Fetch all customers when the component mounts
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await api.getAllCustomers();
      setCustomers(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch customers. Ensure your backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Handle file selection
  const handleFileChange = (e) => {
    setUploadFile(e.target.files[0]);
    setUploadMessage('');
  };

  // Handle the bulk upload submission
  const handleBulkUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) {
      setUploadMessage('Please select a file first.');
      return;
    }

    try {
      setUploading(true);
      setUploadMessage('');
      await api.uploadBulkExcel(uploadFile);
      setUploadMessage('Upload successful! Refreshing data...');
      setUploadFile(null);
      // Close modal and refresh table after a short delay
      setTimeout(() => {
        setShowModal(false);
        fetchCustomers();
        setUploadMessage('');
      }, 1500);
    } catch (err) {
      setUploadMessage(err.response?.data || 'Upload failed. Please check the file format.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Customer Directory</h1>
          <p className="text-sm text-slate-500 mt-1">Manage and view all registered customers.</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300 rounded-md shadow-sm font-medium transition-colors"
          >
            <span className="mr-2">📁</span> Bulk Upload
          </button>
          <Link 
            to="/add-customer" 
            className="px-4 py-2 bg-primary hover:bg-primaryHover text-white rounded-md shadow-sm font-medium transition-colors"
          >
            <span className="mr-2">+</span> Add Customer
          </Link>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Data Table Section */}
      <div className="bg-white shadow-sm border border-slate-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold border-b border-slate-200">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">NIC</th>
                <th className="px-6 py-4">Date of Birth</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                    Loading customers...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                    No customers found. Add a customer or perform a bulk upload.
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800">{customer.name}</td>
                    <td className="px-6 py-4 text-slate-600">{customer.nic}</td>
                    <td className="px-6 py-4 text-slate-600">{customer.dob}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center space-x-3">
                        {/* We will build the View and Edit pages next */}
                        <Link to={`/view-customer/${customer.id}`} className="text-primary hover:text-primaryHover font-medium">
                          View
                        </Link>
                        <Link to={`/edit-customer/${customer.id}`} className="text-slate-500 hover:text-slate-800 font-medium">
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bulk Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900 bg-opacity-50 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800">Upload Excel File</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
                disabled={uploading}
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleBulkUpload} className="p-6">
              <p className="text-sm text-slate-600 mb-4">
                Please upload an `.xlsx` file containing Name, DOB, and NIC. Processing up to 1,000,000 records.
              </p>
              
              <div className="mb-4">
                <input 
                  type="file" 
                  accept=".xlsx, .xls"
                  onChange={handleFileChange}
                  disabled={uploading}
                  className="block w-full text-sm text-slate-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-primary
                    hover:file:bg-blue-100 cursor-pointer"
                />
              </div>

              {uploadMessage && (
                <div className={`p-3 rounded mb-4 text-sm ${uploadMessage.includes('successful') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {uploadMessage}
                </div>
              )}

              <div className="flex justify-end space-x-3 mt-6">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={uploading}
                  className="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={uploading || !uploadFile}
                  className="px-4 py-2 bg-primary hover:bg-primaryHover disabled:bg-blue-300 text-white rounded-md font-medium transition-colors flex items-center"
                >
                  {uploading ? 'Processing...' : 'Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;