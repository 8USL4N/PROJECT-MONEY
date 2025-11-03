import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    token: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form data:", formData);
    alert(`Registration successful, ${formData.name}!`);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-8 w-96"
      >
        <h2 className="text-2xl font-semibold text-center mb-6">
          Create an Account
        </h2>

        <div className="mb-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full name"
            required
            className="w-full border border-gray-300 rounded-lg p-2 placeholder-gray-400 placeholder-opacity-75 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-4">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email address"
            required
            className="w-full border border-gray-300 rounded-lg p-2 placeholder-gray-400 placeholder-opacity-75 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-4">
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="w-full border border-gray-300 rounded-lg p-2 placeholder-gray-400 placeholder-opacity-75 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-6">
          <input
            type="text"
            name="token"
            value={formData.token}
            onChange={handleChange}
            placeholder="Access token"
            required
            className="w-full border border-gray-300 rounded-lg p-2 placeholder-gray-400 placeholder-opacity-75 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Create account
        </button>

        <div className="text-center mt-4 text-sm text-gray-600">
        Already have an account?{" "}
        <Link
            to="/login"
            className="text-blue-500 font-medium hover:underline"
        >
            Sign in
        </Link>
        </div>
      </form>
    </div>
  );
}
