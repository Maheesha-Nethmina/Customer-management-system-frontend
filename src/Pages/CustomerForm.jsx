import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const CustomerForm = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    nic: '',
    mobileNumbers: [],
    addresses: [],
    familyMemberIds: []
  });

  // UI States
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [allCustomers, setAllCustomers] = useState([]); //  family member dropdown

  // Fetch data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch customers for the Family Members
        const allCustResponse = await api.getAllCustomers(0, 1000);
        
        const validCustomerArray = allCustResponse.data.content 
                                    ? allCustResponse.data.content 
                                    : (Array.isArray(allCustResponse.data) ? allCustResponse.data : []);
        
        setAllCustomers(validCustomerArray);

        // If editing, fetch this specific customer's data
        if (isEditMode) {
          const res = await api.getCustomerById(id);
          const cust = res.data;
          setFormData({
            name: cust.name || '',
            dob: cust.dob || '',
            nic: cust.nic || '',
            mobileNumbers: cust.mobileNumbers || [],
            addresses: cust.addresses || [],
            // Extract just the IDs for the family members to match our DTO
            familyMemberIds: cust.familyMembers ? cust.familyMembers.map(f => f.id) : []
          });
        }
      } catch (err) {
        setError('Failed to load data. Please ensure the backend is running.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, isEditMode]);

  // Handle standard text inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Form Handlers for Mobile Numbers
  const addMobile = () => setFormData(prev => ({ ...prev, mobileNumbers: [...prev.mobileNumbers, { number: '' }] }));
  const removeMobile = (index) => setFormData(prev => ({ ...prev, mobileNumbers: prev.mobileNumbers.filter((_, i) => i !== index) }));
  const updateMobile = (index, value) => {
    const updated = [...formData.mobileNumbers];
    updated[index].number = value;
    setFormData(prev => ({ ...prev, mobileNumbers: updated }));
  };

  // Form Handlers for Addresses
  const addAddress = () => setFormData(prev => ({ ...prev, addresses: [...prev.addresses, { addressLine1: '', addressLine2: '', city: '', country: '' }] }));
  const removeAddress = (index) => setFormData(prev => ({ ...prev, addresses: prev.addresses.filter((_, i) => i !== index) }));
  const updateAddress = (index, field, value) => {
    const updated = [...formData.addresses];
    updated[index][field] = value;
    setFormData(prev => ({ ...prev, addresses: updated }));
  };

  //Handle Family Member Selection
  const handleFamilyChange = (e) => {
    // Convert selected options from HTMLCollection to an array of integers
    const selectedIds = Array.from(e.target.selectedOptions, option => parseInt(option.value));
    setFormData(prev => ({ ...prev, familyMemberIds: selectedIds }));
  };

  // Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (isEditMode) {
        await api.updateCustomer(id, formData);
      } else {
        await api.createCustomer(formData);
      }
      // Go back to the dashboard
      navigate('/');
    } catch (err) {
      setError(err.response?.data || 'Failed to save customer. Please check your inputs.');
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-slate-500">Loading customer details...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">
          {isEditMode ? 'Edit Customer' : 'Add New Customer'}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {isEditMode ? 'Update the details of this existing customer.' : 'Fill out the mandatory and optional fields below.'}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/*  Mandatory Fields */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-700 mb-4 border-b border-slate-100 pb-2">Mandatory Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth *</label>
              <input type="date" name="dob" value={formData.dob} onChange={handleChange} required
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">NIC Number *</label>
              <input type="text" name="nic" value={formData.nic} onChange={handleChange} required
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" />
            </div>
          </div>
        </div>

        {/* Mobile Numbers  */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2">
            <h2 className="text-lg font-semibold text-slate-700">Mobile Numbers (Optional)</h2>
            <button type="button" onClick={addMobile} className="text-sm text-primary hover:text-primaryHover font-medium">+ Add Number</button>
          </div>
          {formData.mobileNumbers.map((mobile, index) => (
            <div key={index} className="flex items-center space-x-3 mb-3">
              <input type="text" placeholder="e.g. 0771234567" value={mobile.number} onChange={(e) => updateMobile(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" />
              <button type="button" onClick={() => removeMobile(index)} className="text-red-500 hover:text-red-700 font-bold px-2">✕</button>
            </div>
          ))}
          {formData.mobileNumbers.length === 0 && <p className="text-sm text-slate-400">No mobile numbers added.</p>}
        </div>

        {/* Addresses  */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2">
            <h2 className="text-lg font-semibold text-slate-700">Addresses (Optional)</h2>
            <button type="button" onClick={addAddress} className="text-sm text-primary hover:text-primaryHover font-medium">+ Add Address</button>
          </div>
          {formData.addresses.map((address, index) => (
            <div key={index} className="bg-slate-50 p-4 rounded-md border border-slate-200 mb-4 relative">
              <button type="button" onClick={() => removeAddress(index)} className="absolute top-2 right-3 text-red-500 hover:text-red-700 text-sm font-bold">Remove</button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <input type="text" placeholder="Address Line 1" value={address.addressLine1} onChange={(e) => updateAddress(index, 'addressLine1', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary" />
                <input type="text" placeholder="Address Line 2" value={address.addressLine2} onChange={(e) => updateAddress(index, 'addressLine2', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary" />
                <input type="text" placeholder="City" value={address.city} onChange={(e) => updateAddress(index, 'city', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary" />
                <input type="text" placeholder="Country" value={address.country} onChange={(e) => updateAddress(index, 'country', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
            </div>
          ))}
          {formData.addresses.length === 0 && <p className="text-sm text-slate-400">No addresses added.</p>}
        </div>

        {/* Family Members */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-700 mb-4 border-b border-slate-100 pb-2">Family Members (Optional)</h2>
          <label className="block text-sm text-slate-500 mb-2">Hold Ctrl (or Cmd on Mac) to select multiple existing customers.</label>
          <select 
            multiple 
            value={formData.familyMemberIds} 
            onChange={handleFamilyChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary h-32"
          >
            {allCustomers
              .filter(c => c.id !== Number(id)) // Prevent linking a person to themselves
              .map(customer => (
              <option key={customer.id} value={customer.id}>
                {customer.name} ({customer.nic})
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-4 border-t border-slate-200">
          <button type="button" onClick={() => navigate('/')} className="px-6 py-2 border border-slate-300 text-slate-700 bg-white rounded-md hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primaryHover disabled:bg-blue-300 transition-colors shadow-sm">
            {saving ? 'Saving...' : (isEditMode ? 'Update Customer' : 'Save Customer')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerForm;