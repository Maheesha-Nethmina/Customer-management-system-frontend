import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const CustomerView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        setLoading(true);
        const response = await api.getCustomerById(id);
        setCustomer(response.data);
        setError(null);
      } catch (err) {
        setError('Customer not found or failed to load data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerDetails();
  }, [id]); // Re-run if the ID in the URL changes

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-slate-500">
        <span className="text-lg animate-pulse">Loading customer details...</span>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-4">{error}</div>
        <button onClick={() => navigate('/')} className="text-primary hover:underline">
          &larr; Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-slate-200 pb-4">
        <div>
          <button onClick={() => navigate('/')} className="text-sm text-slate-500 hover:text-primary mb-2 flex items-center transition-colors">
            &larr; Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold text-slate-800">Customer Profile</h1>
        </div>
        <Link 
          to={`/edit-customer/${customer.id}`} 
          className="px-4 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-md shadow-sm font-medium transition-colors"
        >
          Edit Customer
        </Link>
      </div>

      <div className="space-y-6">
        
        {/* Section 1: Basic Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-700 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-slate-500 mb-1">Full Name</p>
              <p className="font-medium text-slate-800">{customer.name}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">Date of Birth</p>
              <p className="font-medium text-slate-800">{customer.dob}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">NIC Number</p>
              <p className="font-medium text-slate-800">{customer.nic}</p>
            </div>
          </div>
        </div>

        {/* Section 2: Contact Details (Mobile) */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-700 mb-4">Mobile Numbers</h2>
          {customer.mobileNumbers && customer.mobileNumbers.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {customer.mobileNumbers.map((mobile, idx) => (
                <span key={idx} className="px-3 py-1 bg-blue-50 text-primary border border-blue-100 rounded-full text-sm font-medium">
                  📞 {mobile.number}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 italic">No mobile numbers recorded.</p>
          )}
        </div>

        {/* Section 3: Addresses */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-700 mb-4">Addresses</h2>
          {customer.addresses && customer.addresses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {customer.addresses.map((address, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-md border border-slate-100">
                  <p className="text-slate-800 font-medium mb-1">Address {idx + 1}</p>
                  <p className="text-sm text-slate-600">{address.addressLine1}</p>
                  {address.addressLine2 && <p className="text-sm text-slate-600">{address.addressLine2}</p>}
                  <p className="text-sm text-slate-600">{address.city}, {address.country}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 italic">No addresses recorded.</p>
          )}
        </div>

        {/* Section 4: Family Members */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-700 mb-4">Family Members</h2>
          {customer.familyMembers && customer.familyMembers.length > 0 ? (
            <div className="overflow-hidden border border-slate-200 rounded-md">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-slate-500 font-semibold">Name</th>
                    <th className="px-4 py-3 text-left text-slate-500 font-semibold">NIC</th>
                    <th className="px-4 py-3 text-right text-slate-500 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {customer.familyMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-slate-800 font-medium">{member.name}</td>
                      <td className="px-4 py-3 text-slate-600">{member.nic}</td>
                      <td className="px-4 py-3 text-right">
                        {/* Clicking this routes to the family member's profile! */}
                        <Link to={`/view-customer/${member.id}`} className="text-primary hover:text-primaryHover font-medium">
                          View Profile
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-slate-400 italic">No family members linked.</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default CustomerView;