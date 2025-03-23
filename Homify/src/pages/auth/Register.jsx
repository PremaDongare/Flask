import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";  
import { FaUser, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    role: '',  // Default role is buyer
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Updating ${name} with value:`, value); // Debugging

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validate Form Inputs
  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Invalid email format";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (!formData.phone.trim()) errors.phone = "Phone number is required";
    if (!formData.address.trim()) errors.address = "Address is required";

    return errors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted with role:", formData.role); // Debugging

    setErrorMessage("");
    setIsSubmitting(true);

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setIsSubmitting(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      console.log("User registered successfully:", userCredential.user);

      // Redirect based on role (debugging role before navigating)
      console.log("Navigating to:", formData.role);
      
      if (formData.role === 'farmer') {
        navigate('/farmer');
      } else if (formData.role === 'buyer') {
        navigate('/buyer');
      } else if (formData.role === 'admin') {
        navigate('/admin');
      } else {
        console.error("Unknown role selected:", formData.role);
      }

    } catch (error) {
      console.error("Error signing up:", error.message);
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12">
      <div className="sm:w-full sm:max-w-md mx-auto">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">Sign Up</h2>
        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-green-600 hover:text-green-500">Sign In</Link>
        </p>

        <form className="space-y-6 mt-8 bg-white p-8 shadow-md rounded-lg" onSubmit={handleSubmit}>
          
          {/* Name Input */}
          <InputField
            id="name"
            label="Name"
            icon={<FaUser />}
            type="text"
            value={formData.name}
            onChange={handleChange}
            error={formErrors.name}
          />

          {/* Email Input */}
          <InputField
            id="email"
            label="Email"
            icon={<FaEnvelope />}
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={formErrors.email}
          />

          {/* Password Input */}
          <InputField
            id="password"
            label="Password"
            icon={<FaLock />}
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={formErrors.password}
          />

          {/* Confirm Password Input */}
          <InputField
            id="confirmPassword"
            label="Confirm Password"
            icon={<FaLock />}
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={formErrors.confirmPassword}
          />

          {/* Phone Input */}
          <InputField
            id="phone"
            label="Phone"
            icon={<FaPhone />}
            type="text"
            value={formData.phone}
            onChange={handleChange}
            error={formErrors.phone}
          />

          {/* Address Input */}
          <InputField
            id="address"
            label="Address"
            icon={<FaMapMarkerAlt />}
            type="text"
            value={formData.address}
            onChange={handleChange}
            error={formErrors.address}
          />

          {/* Role Selection */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">Select Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="farmer">Farmer</option>
              <option value="buyer">Buyer</option>
              <option value="admin">Admin</option>
            </select>
            {formErrors.role && <p className="text-red-600 text-sm mt-1">{formErrors.role}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing up..." : "Sign Up"}
          </button>

          {errorMessage && <p className="text-red-600 text-sm mt-2">{errorMessage}</p>}
        </form>
      </div>
    </div>
  );
}

// Input Field Component (Reusable)
const InputField = ({ id, label, icon, type, value, onChange, error }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="mt-1 relative rounded-md shadow-sm">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {icon}
      </div>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        className={`block w-full pl-10 pr-3 py-2 border ${error ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500`}
      />
    </div>
    {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
  </div>
);

export default Register;
