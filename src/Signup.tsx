import React, { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
const Signup = ({
  onSignup,
  onSwitchToLogin,
}: {
  onSignup: () => void;
  onSwitchToLogin: () => void;
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder: Add signup logic here
    invoke("signup_emailpassword", { email, password })
      .then(() => {
        console.log("Signup successful");
        console.log("Email:", email);
        onSignup();
      })
      .catch((error) => {
        console.error("Signup failed:", error);
        // Handle error (e.g., show a notification)
      });
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
      <form
        onSubmit={handleSubmit}
        className='bg-white p-8 rounded shadow-md w-80'
      >
        <h2 className='text-2xl font-bold mb-6 text-center'>Sign Up</h2>
        <input
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='w-full mb-4 p-2 border rounded'
          required
        />
        <input
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='w-full mb-6 p-2 border rounded'
          required
        />
        <button
          type='submit'
          className='w-full bg-green-500 text-white py-2 rounded mb-2'
        >
          Sign Up
        </button>
        <button
          type='button'
          className='w-full text-blue-500'
          onClick={onSwitchToLogin}
        >
          Already have an account? Login
        </button>
      </form>
    </div>
  );
};

export default Signup;
