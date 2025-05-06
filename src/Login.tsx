import { invoke } from "@tauri-apps/api/core";
import React, { useState } from "react";

const Login = ({
  onLogin,
  onSwitchToSignup,
}: {
  onLogin: () => void;
  onSwitchToSignup: () => void;
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder: Add authentication logic here
    onLogin();
    invoke("login_emailpassword", { email, password })
      .then(() => {
        console.log("Login successful");
        console.log("Email:", email);
        onLogin();
      })
      .catch((error) => {
        console.error("Login failed:", error);
        // Handle error (e.g., show a notification)
      });
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
      <form
        onSubmit={handleSubmit}
        className='bg-white p-8 rounded shadow-md w-80'
      >
        <h2 className='text-2xl font-bold mb-6 text-center'>Login</h2>
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
          className='w-full bg-blue-500 text-white py-2 rounded mb-2'
        >
          Login
        </button>
        <button
          type='button'
          className='w-full text-blue-500'
          onClick={onSwitchToSignup}
        >
          Don't have an account? Sign up
        </button>
      </form>
    </div>
  );
};

export default Login;
