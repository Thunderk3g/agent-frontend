import React, { useState, useEffect, useCallback } from 'react';
import { useStore } from '../../store/useStore';

interface PersonalDetailsFormProps {
  onComplete: (data: any) => void;
  onNext: () => void;
}

const PersonalDetailsForm: React.FC<PersonalDetailsFormProps> = ({ onComplete, onNext }) => {
  const { personalDetails, updatePersonalDetails, syncWithBackend } = useStore();
  const [formData, setFormData] = useState({
    fullName: personalDetails.fullName || '',
    dateOfBirth: personalDetails.dateOfBirth || '',
    age: personalDetails.age || '',
    gender: personalDetails.gender || '',
    mobileNumber: personalDetails.mobileNumber || '',
    email: personalDetails.email || '',
    pinCode: personalDetails.pinCode || '',
    annualIncome: personalDetails.annualIncome || '',
    tobaccoUser: personalDetails.tobaccoUser || false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValid, setIsValid] = useState(false);

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    // Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    }

    // Date of birth validation
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else {
      const birthDate = new Date(formData.dateOfBirth);
      const age = calculateAge(birthDate);
      if (age < 18) {
        newErrors.dateOfBirth = 'Minimum age is 18 years';
      } else if (age > 65) {
        newErrors.dateOfBirth = 'Maximum age is 65 years';
      }
    }

    // Gender validation
    if (!formData.gender) {
      newErrors.gender = 'Please select your gender';
    }

    // Mobile validation
    if (!formData.mobileNumber) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobileNumber.replace(/\s+/g, ''))) {
      newErrors.mobileNumber = 'Please enter a valid 10-digit mobile number';
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // PIN code validation
    if (!formData.pinCode) {
      newErrors.pinCode = 'PIN code is required';
    } else if (!/^\d{6}$/.test(formData.pinCode)) {
      newErrors.pinCode = 'PIN code must be 6 digits';
    }

    // Annual income validation
    if (!formData.annualIncome) {
      newErrors.annualIncome = 'Annual income is required';
    } else if (isNaN(Number(formData.annualIncome)) || Number(formData.annualIncome) < 100000) {
      newErrors.annualIncome = 'Minimum annual income is ₹1,00,000';
    }

    setErrors(newErrors);
    const valid = Object.keys(newErrors).length === 0;
    setIsValid(valid);
    return valid;
  }, [formData]);

  const calculateAge = (birthDate: Date): number => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const handleInputChange = (field: string, value: any) => {
    const updatedData = { ...formData, [field]: value };

    // Auto-calculate age when date of birth changes
    if (field === 'dateOfBirth' && value) {
      const birthDate = new Date(value);
      if (!isNaN(birthDate.getTime())) {
        updatedData.age = calculateAge(birthDate).toString();
      }
    }

    setFormData(updatedData);
    updatePersonalDetails(updatedData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Sync with backend session to ensure unified memory state
      await syncWithBackend();
      onComplete(formData);
      onNext();
    }
  };

  useEffect(() => {
    validateForm();
  }, [formData, validateForm]);

  const formatCurrency = (value: string): string => {
    const number = value.replace(/\D/g, '');
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Personal Details</h2>
        <p className="text-gray-600">Please provide your personal information to get started with your insurance quote.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
              errors.fullName 
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            }`}
            placeholder="Enter your full name"
          />
          {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
        </div>

        {/* Date of Birth & Age */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth *
            </label>
            <input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                errors.dateOfBirth 
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
            />
            {errors.dateOfBirth && <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Age
            </label>
            <input
              type="number"
              value={formData.age}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              placeholder="Auto-calculated"
            />
          </div>
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender *
          </label>
          <div className="grid grid-cols-3 gap-3">
            {['male', 'female', 'other'].map((gender) => (
              <label key={gender} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value={gender}
                  checked={formData.gender === gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="sr-only"
                />
                <div className={`flex-1 px-4 py-3 border rounded-lg text-center transition-colors ${
                  formData.gender === gender
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}>
                  {gender.charAt(0).toUpperCase() + gender.slice(1)}
                </div>
              </label>
            ))}
          </div>
          {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender}</p>}
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mobile Number *
            </label>
            <input
              type="tel"
              value={formData.mobileNumber}
              onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                errors.mobileNumber 
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
              placeholder="10-digit mobile number"
              maxLength={10}
            />
            {errors.mobileNumber && <p className="mt-1 text-sm text-red-600">{errors.mobileNumber}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              PIN Code *
            </label>
            <input
              type="text"
              value={formData.pinCode}
              onChange={(e) => handleInputChange('pinCode', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                errors.pinCode 
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
              placeholder="6-digit PIN code"
              maxLength={6}
            />
            {errors.pinCode && <p className="mt-1 text-sm text-red-600">{errors.pinCode}</p>}
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
              errors.email 
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            }`}
            placeholder="your.email@example.com"
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>

        {/* Annual Income */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Annual Income *
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
            <input
              type="text"
              value={formatCurrency(formData.annualIncome)}
              onChange={(e) => handleInputChange('annualIncome', e.target.value.replace(/,/g, ''))}
              className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                errors.annualIncome 
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
              placeholder="5,00,000"
            />
          </div>
          {errors.annualIncome && <p className="mt-1 text-sm text-red-600">{errors.annualIncome}</p>}
        </div>

        {/* Tobacco Usage */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Do you use tobacco products? *
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="tobaccoUser"
                value="false"
                checked={formData.tobaccoUser === false}
                onChange={() => handleInputChange('tobaccoUser', false)}
                className="sr-only"
              />
              <div className={`flex-1 px-4 py-3 border rounded-lg text-center transition-colors ${
                formData.tobaccoUser === false
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}>
                No
              </div>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="tobaccoUser"
                value="true"
                checked={formData.tobaccoUser === true}
                onChange={() => handleInputChange('tobaccoUser', true)}
                className="sr-only"
              />
              <div className={`flex-1 px-4 py-3 border rounded-lg text-center transition-colors ${
                formData.tobaccoUser === true
                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}>
                Yes
              </div>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6">
          <button
            type="submit"
            disabled={!isValid}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
              isValid
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue to Insurance Requirements
          </button>
        </div>
      </form>
    </div>
  );
};

export default PersonalDetailsForm;