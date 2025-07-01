import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import LogoUploader from '../components/LogoUploader';
import { 
  User, 
  Building2, 
  Bell, 
  Shield, 
  Palette, 
  Globe,
  Key,
  Save,
  Camera,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Download,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Copy,
  FileText,
  Image,
  RefreshCw
} from 'lucide-react';

const Settings: React.FC = () => {
  const { user, updateUser, updateCompanyProfile, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    role: '',
    phone: '',
    location: '',
    website: '',
    bio: ''
  });

  const [companyData, setCompanyData] = useState({
    name: '',
    logo: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India'
    },
    contact: {
      phone: '',
      email: '',
      website: '',
      fax: ''
    },
    business: {
      industry: 'Software Development',
      founded: '',
      employees: '',
      registration: '',
      taxId: ''
    },
    social: {
      linkedin: '',
      twitter: '',
      facebook: ''
    }
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    proposalUpdates: true,
    weeklyReports: false,
    marketingEmails: false
  });

  const [preferences, setPreferences] = useState({
    theme: 'light',
    language: 'en',
    timezone: 'Asia/Kolkata',
    currency: 'INR'
  });

  // Load user data into form when user changes or component mounts
  useEffect(() => {
    console.log('Loading user data into form:', user);
    
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        company: user.company || '',
        role: user.role || '',
        phone: user.phone || '',
        location: user.location || '',
        website: user.website || '',
        bio: user.bio || ''
      });

      if (user.companyProfile) {
        setCompanyData({
          name: user.companyProfile.name || '',
          logo: user.companyProfile.logo || '',
          address: {
            street: user.companyProfile.address?.street || '',
            city: user.companyProfile.address?.city || '',
            state: user.companyProfile.address?.state || '',
            zipCode: user.companyProfile.address?.zipCode || '',
            country: user.companyProfile.address?.country || 'India'
          },
          contact: {
            phone: user.companyProfile.contact?.phone || '',
            email: user.companyProfile.contact?.email || '',
            website: user.companyProfile.contact?.website || '',
            fax: user.companyProfile.contact?.fax || ''
          },
          business: {
            industry: user.companyProfile.business?.industry || 'Software Development',
            founded: user.companyProfile.business?.founded || '',
            employees: user.companyProfile.business?.employees || '',
            registration: user.companyProfile.business?.registration || '',
            taxId: user.companyProfile.business?.taxId || ''
          },
          social: {
            linkedin: user.companyProfile.social?.linkedin || '',
            twitter: user.companyProfile.social?.twitter || '',
            facebook: user.companyProfile.social?.facebook || ''
          }
        });
      }
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCompanyInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const [section, field] = name.split('.');
    
    if (section && field) {
      setCompanyData(prev => ({
        ...prev,
        [section]: {
          ...prev[section as keyof typeof prev],
          [field]: value
        }
      }));
    } else {
      setCompanyData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setSaveMessage('');
    
    try {
      console.log('Saving profile data:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user in context and localStorage
      updateUser(formData);
      
      // Wait a bit and refresh to ensure data is persisted
      setTimeout(() => {
        refreshUser();
        setSaveMessage('Profile updated successfully!');
        setTimeout(() => setSaveMessage(''), 3000);
      }, 500);
      
    } catch (error) {
      setSaveMessage('Error saving profile. Please try again.');
      console.error('Save error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveCompany = async () => {
    setIsSaving(true);
    setSaveMessage('');
    
    try {
      console.log('Saving company data:', companyData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update company profile
      updateCompanyProfile(companyData);
      
      // Wait a bit and refresh to ensure data is persisted
      setTimeout(() => {
        refreshUser();
        setSaveMessage('Company profile updated successfully!');
        setTimeout(() => setSaveMessage(''), 3000);
      }, 500);
      
    } catch (error) {
      setSaveMessage('Error saving company profile. Please try again.');
      console.error('Save error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleNotificationChange = (key: string) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };

  const handlePreferenceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPreferences(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogoChange = (logoUrl: string) => {
    setCompanyData(prev => ({
      ...prev,
      logo: logoUrl
    }));
  };

  const handleRefreshData = () => {
    refreshUser();
    setSaveMessage('Data refreshed from storage!');
    setTimeout(() => setSaveMessage(''), 2000);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'company', label: 'Company', icon: Building2 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Preferences', icon: Palette },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'billing', label: 'Billing', icon: CreditCard }
  ];

  return (
    <div className="min-h-screen pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
              <p className="text-gray-600">Manage your account settings and company profile</p>
            </div>
            <button
              onClick={handleRefreshData}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh Data</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200/50 p-4">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-primary-50 text-primary-700 border border-primary-200'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200/50 p-8">
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">Profile Information</h2>
                  
                  {/* Save Message */}
                  {saveMessage && (
                    <div className={`mb-6 p-4 rounded-lg flex items-center space-x-2 ${
                      saveMessage.includes('Error') 
                        ? 'bg-red-50 border border-red-200 text-red-700' 
                        : 'bg-green-50 border border-green-200 text-green-700'
                    }`}>
                      {saveMessage.includes('Error') ? (
                        <AlertTriangle className="h-5 w-5" />
                      ) : (
                        <CheckCircle className="h-5 w-5" />
                      )}
                      <span>{saveMessage}</span>
                    </div>
                  )}
                  
                  {/* Avatar Section */}
                  <div className="flex items-center space-x-6 mb-8">
                    <div className="relative">
                      <img
                        className="h-20 w-20 rounded-full object-cover"
                        src={user?.avatar}
                        alt={user?.name}
                      />
                      <button className="absolute bottom-0 right-0 bg-primary-500 text-white p-2 rounded-full hover:bg-primary-600 transition-colors">
                        <Camera className="h-4 w-4" />
                      </button>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{formData.name || 'User Name'}</h3>
                      <p className="text-gray-600">{formData.email || 'user@email.com'}</p>
                      <button className="mt-2 text-primary-600 hover:text-primary-700 text-sm font-medium">
                        Change photo
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Role
                      </label>
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="">Select role</option>
                        <option value="Business Development Manager">Business Development Manager</option>
                        <option value="Sales Manager">Sales Manager</option>
                        <option value="Project Manager">Project Manager</option>
                        <option value="CEO/Founder">CEO/Founder</option>
                        <option value="Director">Director</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="+91 98765 43210"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="City, Country"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Website
                      </label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="url"
                          name="website"
                          value={formData.website}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="https://yourwebsite.com"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bio
                      </label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <button 
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSaving ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'company' && (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">Company Profile</h2>
                  <p className="text-gray-600 mb-6">This information will be included in your exported proposals with professional formatting.</p>
                  
                  {/* Save Message */}
                  {saveMessage && (
                    <div className={`mb-6 p-4 rounded-lg flex items-center space-x-2 ${
                      saveMessage.includes('Error') 
                        ? 'bg-red-50 border border-red-200 text-red-700' 
                        : 'bg-green-50 border border-green-200 text-green-700'
                    }`}>
                      {saveMessage.includes('Error') ? (
                        <AlertTriangle className="h-5 w-5" />
                      ) : (
                        <CheckCircle className="h-5 w-5" />
                      )}
                      <span>{saveMessage}</span>
                    </div>
                  )}

                  <div className="space-y-8">
                    {/* Company Logo */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Company Branding</h3>
                      <LogoUploader
                        currentLogo={companyData.logo}
                        onLogoChange={handleLogoChange}
                        className="mb-4"
                      />
                    </div>

                    {/* Basic Information */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Company Name *
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={companyData.name}
                            onChange={handleCompanyInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Your Company Name"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Industry
                          </label>
                          <select
                            name="business.industry"
                            value={companyData.business.industry}
                            onChange={handleCompanyInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          >
                            <option value="Software Development">Software Development</option>
                            <option value="IT Services">IT Services</option>
                            <option value="Digital Marketing">Digital Marketing</option>
                            <option value="E-commerce">E-commerce</option>
                            <option value="Consulting">Consulting</option>
                            <option value="System Integration">System Integration</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Founded Year
                          </label>
                          <input
                            type="text"
                            name="business.founded"
                            value={companyData.business.founded}
                            onChange={handleCompanyInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="2016"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Number of Employees
                          </label>
                          <select
                            name="business.employees"
                            value={companyData.business.employees}
                            onChange={handleCompanyInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          >
                            <option value="">Select size</option>
                            <option value="1-10">1-10 employees</option>
                            <option value="11-50">11-50 employees</option>
                            <option value="51-100">51-100 employees</option>
                            <option value="101-500">101-500 employees</option>
                            <option value="500+">500+ employees</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Address Information */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Address Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Street Address
                          </label>
                          <input
                            type="text"
                            name="address.street"
                            value={companyData.address.street}
                            onChange={handleCompanyInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="123 Tech Park, Electronic City"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            City
                          </label>
                          <input
                            type="text"
                            name="address.city"
                            value={companyData.address.city}
                            onChange={handleCompanyInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Bangalore"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            State/Province
                          </label>
                          <input
                            type="text"
                            name="address.state"
                            value={companyData.address.state}
                            onChange={handleCompanyInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Karnataka"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            ZIP/Postal Code
                          </label>
                          <input
                            type="text"
                            name="address.zipCode"
                            value={companyData.address.zipCode}
                            onChange={handleCompanyInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="560100"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Country
                          </label>
                          <select
                            name="address.country"
                            value={companyData.address.country}
                            onChange={handleCompanyInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          >
                            <option value="India">India</option>
                            <option value="United States">United States</option>
                            <option value="United Kingdom">United Kingdom</option>
                            <option value="Canada">Canada</option>
                            <option value="Australia">Australia</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            name="contact.phone"
                            value={companyData.contact.phone}
                            onChange={handleCompanyInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="+91 80 4567 8900"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                          </label>
                          <input
                            type="email"
                            name="contact.email"
                            value={companyData.contact.email}
                            onChange={handleCompanyInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="info@yourcompany.com"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Website
                          </label>
                          <input
                            type="url"
                            name="contact.website"
                            value={companyData.contact.website}
                            onChange={handleCompanyInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="https://yourcompany.com"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Fax Number (Optional)
                          </label>
                          <input
                            type="tel"
                            name="contact.fax"
                            value={companyData.contact.fax}
                            onChange={handleCompanyInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="+91 80 4567 8901"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Business Registration */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Business Registration</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Registration Number
                          </label>
                          <input
                            type="text"
                            name="business.registration"
                            value={companyData.business.registration}
                            onChange={handleCompanyInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="U72900KA2016PTC089123"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tax ID / GST Number
                          </label>
                          <input
                            type="text"
                            name="business.taxId"
                            value={companyData.business.taxId}
                            onChange={handleCompanyInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="AABCT1234C1Z5"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Social Media */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Social Media (Optional)</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            LinkedIn
                          </label>
                          <input
                            type="url"
                            name="social.linkedin"
                            value={companyData.social.linkedin}
                            onChange={handleCompanyInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="https://linkedin.com/company/yourcompany"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Twitter
                          </label>
                          <input
                            type="url"
                            name="social.twitter"
                            value={companyData.social.twitter}
                            onChange={handleCompanyInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="https://twitter.com/yourcompany"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Facebook
                          </label>
                          <input
                            type="url"
                            name="social.facebook"
                            value={companyData.social.facebook}
                            onChange={handleCompanyInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="https://facebook.com/yourcompany"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <button 
                      onClick={handleSaveCompany}
                      disabled={isSaving}
                      className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSaving ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      <span>{isSaving ? 'Saving...' : 'Save Company Profile'}</span>
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">Notification Preferences</h2>
                  
                  <div className="space-y-6">
                    {Object.entries(notifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between py-4 border-b border-gray-200 last:border-b-0">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {key === 'emailNotifications' && 'Receive notifications via email'}
                            {key === 'pushNotifications' && 'Receive push notifications in browser'}
                            {key === 'proposalUpdates' && 'Get notified about proposal status changes'}
                            {key === 'weeklyReports' && 'Weekly performance and analytics reports'}
                            {key === 'marketingEmails' && 'Promotional emails and product updates'}
                          </p>
                        </div>
                        <button
                          onClick={() => handleNotificationChange(key)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            value ? 'bg-primary-500' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              value ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'preferences' && (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">Preferences</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Theme
                      </label>
                      <select
                        name="theme"
                        value={preferences.theme}
                        onChange={handlePreferenceChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="auto">Auto</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Language
                      </label>
                      <select
                        name="language"
                        value={preferences.language}
                        onChange={handlePreferenceChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="en">English</option>
                        <option value="hi">Hindi</option>
                        <option value="te">Telugu</option>
                        <option value="ta">Tamil</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Timezone
                      </label>
                      <select
                        name="timezone"
                        value={preferences.timezone}
                        onChange={handlePreferenceChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                        <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                        <option value="Europe/London">Europe/London (GMT)</option>
                        <option value="America/New_York">America/New_York (EST)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Currency
                      </label>
                      <select
                        name="currency"
                        value={preferences.currency}
                        onChange={handlePreferenceChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="INR">Indian Rupee (₹)</option>
                        <option value="USD">US Dollar ($)</option>
                        <option value="EUR">Euro (€)</option>
                        <option value="GBP">British Pound (£)</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <button className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center space-x-2">
                      <Save className="h-4 w-4" />
                      <span>Save Preferences</span>
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">Security Settings</h2>
                  
                  <div className="space-y-8">
                    {/* Password Change */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Current Password
                          </label>
                          <input
                            type="password"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            New Password
                          </label>
                          <input
                            type="password"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>
                      </div>
                      <button className="mt-4 bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors">
                        Update Password
                      </button>
                    </div>

                    {/* Two-Factor Authentication */}
                    <div className="border-t border-gray-200 pt-8">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">Two-Factor Authentication</h3>
                          <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                        </div>
                        <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                          Enable 2FA
                        </button>
                      </div>
                    </div>

                    {/* API Keys */}
                    <div className="border-t border-gray-200 pt-8">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">API Keys</h3>
                          <p className="text-sm text-gray-600">Manage your API keys for integrations</p>
                        </div>
                        <button className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center space-x-2">
                          <Key className="h-4 w-4" />
                          <span>Generate New Key</span>
                        </button>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-900">Production API Key</div>
                            <div className="text-sm text-gray-500 font-mono">sk_prod_••••••••••••••••</div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button className="text-gray-500 hover:text-gray-700">
                              <Copy className="h-4 w-4" />
                            </button>
                            <button className="text-red-500 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'billing' && (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">Billing & Subscription</h2>
                  
                  <div className="space-y-8">
                    {/* Current Plan */}
                    <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-6 border border-primary-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">Professional Plan</h3>
                          <p className="text-sm text-gray-600">Unlimited proposals, advanced analytics, priority support</p>
                          <div className="mt-2 text-2xl font-bold text-primary-600">₹2,999/month</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600">Next billing date</div>
                          <div className="font-medium text-gray-900">March 15, 2024</div>
                          <button className="mt-2 text-primary-600 hover:text-primary-700 text-sm font-medium">
                            Change Plan
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h3>
                      <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <CreditCard className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">•••• •••• •••• 4242</div>
                            <div className="text-sm text-gray-500">Expires 12/2025</div>
                          </div>
                        </div>
                        <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                          Update
                        </button>
                      </div>
                    </div>

                    {/* Billing History */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Billing History</h3>
                        <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
                          <Download className="h-4 w-4" />
                          <span>Download All</span>
                        </button>
                      </div>
                      <div className="space-y-3">
                        {[
                          { date: 'Feb 15, 2024', amount: '₹2,999', status: 'Paid' },
                          { date: 'Jan 15, 2024', amount: '₹2,999', status: 'Paid' },
                          { date: 'Dec 15, 2023', amount: '₹2,999', status: 'Paid' }
                        ].map((invoice, index) => (
                          <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                              <div className="font-medium text-gray-900">{invoice.date}</div>
                              <div className="text-sm text-gray-500">Professional Plan</div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium text-gray-900">{invoice.amount}</div>
                              <div className="text-sm text-green-600">{invoice.status}</div>
                            </div>
                            <button className="text-primary-600 hover:text-primary-700 text-sm">
                              Download
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="border-t border-gray-200 pt-8">
                      <div className="bg-red-50 rounded-lg p-6 border border-red-200">
                        <div className="flex items-center space-x-3 mb-4">
                          <AlertTriangle className="h-6 w-6 text-red-600" />
                          <h3 className="text-lg font-medium text-red-900">Danger Zone</h3>
                        </div>
                        <p className="text-sm text-red-700 mb-4">
                          Once you cancel your subscription, you will lose access to all premium features and your data will be deleted after 30 days.
                        </p>
                        <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                          Cancel Subscription
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;