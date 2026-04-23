import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Dashboard = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination States
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);

  // States for the Excel Upload Modal
  const [showModal, setShowModal] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');

  // Fetch customers with CRASH-PROOF data checking
  const fetchCustomers = async (pageNumber = 0) => {
    try {
      setLoading(true);
      const response = await api.getAllCustomers(pageNumber, 50);
      
      // Let's log it so you can see exactly what the backend sent in your F12 console
      console.log("Data from backend:", response.data);

      let validCustomerArray = [];

      // Safely check if it's the new Paginated format
      if (response.data && Array.isArray(response.data.content)) {
        validCustomerArray = response.data.content;
      } 
      // Safely check if it's the old flat array format
      else if (Array.isArray(response.data)) {
        validCustomerArray = response.data;
      } 
      // If it's neither, we log an error but DON'T crash the app
      else {
        console.error("Backend sent an unexpected data format:", response.data);
      }
      
      setCustomers(validCustomerArray); 
      
      setCurrentPage(response.data?.number || 0);
      setTotalPages(response.data?.totalPages || 1);
      setTotalRecords(response.data?.totalElements || validCustomerArray.length);
      
      setError(null);
    } catch (err) {
      setError('Failed to fetch customers. Ensure your backend is running.');
      console.error(err);
      setCustomers([]); // Ensure it resets to a safe array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers(0);
  }, []);

  // Pagination Handlers
  const handlePreviousPage = () => {
    if (currentPage > 0) fetchCustomers(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) fetchCustomers(currentPage + 1);
  };

  const handleFileChange = (e) => {
    setUploadFile(e.target.files[0]);
    setUploadMessage('');
  };

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
      setTimeout(() => {
        setShowModal(false);
        fetchCustomers(0);
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
          <p className="text-sm text-slate-500 mt-1">
            Manage and view all registered customers. Total Records: <span className="font-semibold text-primary">{totalRecords.toLocaleString()}</span>
          </p>
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
              ) : !Array.isArray(customers) || customers.length === 0 ? (
                // CRASH-PROOF RENDER CHECK: Ensures map is ONLY called if it's a real array
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
        
        {/* Pagination Footer */}
        {!loading && totalRecords > 0 && (
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
            <p className="text-sm text-slate-600">
              Showing Page <span className="font-semibold">{currentPage + 1}</span> of <span className="font-semibold">{totalPages}</span>
            </p>
            <div className="flex space-x-2">
              <button 
                onClick={handlePreviousPage} 
                disabled={currentPage === 0}
                className="px-3 py-1 border border-slate-300 rounded-md text-sm font-medium bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button 
                onClick={handleNextPage} 
                disabled={currentPage >= totalPages - 1}
                className="px-3 py-1 border border-slate-300 rounded-md text-sm font-medium bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
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