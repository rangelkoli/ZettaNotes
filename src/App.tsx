import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import YooptaEditor, {
  createYooptaEditor,
  Elements,
  Blocks,
  useYooptaEditor,
  YooptaContentValue,
  YooptaOnChangeOptions,
} from "@yoopta/editor";
import { invoke } from "@tauri-apps/api/core";

// import { WITH_BASIC_INIT_VALUE } from "./init_value"; // Adjust the import path as necessary
import "./App.css"; // Adjust the import path as necessary
import YooptaEditorContainer from "./YooptaEditorContainer";

import { useMemo, useRef, useState as useReactState } from "react";
import SidebarComponent from "./components/sidebar"; // Adjust the import path as necessary

function WithBaseFullSetup() {
  const [notes, setNotes] = useReactState<YooptaContentValue | undefined>(
    undefined
  );
  invoke<string>("load_notes").then((response) => {
    setNotes(response ? JSON.parse(response) : undefined);
  });
  const getInitialValue = () => {
    const saved = localStorage.getItem("zettanotes_content");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return;
      }
    }
    return notes || undefined;
  };
  const [value, setValue] = useReactState(getInitialValue());
  const editor = useMemo(() => createYooptaEditor(), []);
  const selectionRef = useRef(null);

  const [changed, setChanged] = useReactState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useReactState(false);
  const [sidebarOpen, setSidebarOpen] = useReactState(false); // for mobile drawer

  const handleSidebarToggle = () => setSidebarCollapsed((prev) => !prev);
  const handleDrawerOpen = () => setSidebarOpen(true);
  const handleDrawerClose = () => setSidebarOpen(false);

  const onChange = (
    newValue: YooptaContentValue,
    options: YooptaOnChangeOptions
  ) => {
    setValue(newValue);
    // Save to localStorage on every change
    invoke<string>("save_notes", { notes: JSON.stringify(newValue) })
      .then((response) => {
        console.log(String(response)); // "Notes saved successfully!"
        setChanged(response);
      })
      .catch((error) => {
        console.error("Error saving notes:", error);
      });
  };

  return (
    <div className='relative'>
      {/* Mobile hamburger button */}
      <button
        className='fixed top-4 left-4 z-40 md:hidden bg-gray-800 text-white p-2 rounded shadow'
        onClick={handleDrawerOpen}
        aria-label='Open sidebar'
      >
        <svg
          className='h-6 w-6'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M4 6h16M4 12h16M4 18h16'
          />
        </svg>
      </button>
      <SidebarComponent
        className='fixed top-0 left-0 h-screen z-30 hidden md:block'
        collapsed={sidebarCollapsed}
        onToggle={handleSidebarToggle}
        isDrawer={false}
        open={false}
        onClose={() => {}}
      />
      {/* Drawer sidebar for mobile */}
      <SidebarComponent
        className={`fixed top-0 left-0 h-screen z-40 md:hidden ${
          sidebarOpen ? "" : "pointer-events-none"
        }`}
        collapsed={false}
        onToggle={() => {}}
        isDrawer={true}
        open={sidebarOpen}
        onClose={handleDrawerClose}
      />
      {/* Overlay for mobile drawer */}
      {sidebarOpen && (
        <div
          className='fixed inset-0  bg-opacity-40 z-30 md:hidden'
          onClick={handleDrawerClose}
        />
      )}
      <div
        className='lg:py-[100px] px-[20px] pt-[80px] pb-[40px] flex justify-center flex-col transition-all duration-300'
        style={{
          marginLeft: sidebarCollapsed ? "4rem" : "16rem", // 4rem = 64px (w-16), 16rem = 256px (w-64)
        }}
        ref={selectionRef}
      >
        <div>{changed}</div>
      </div>
    </div>
  );
}

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route
            path='/login'
            element={
              <Login
                onLogin={() => {
                  window.location.replace("/dashboard");
                }}
                onSwitchToSignup={() => window.location.replace("/signup")}
              />
            }
          />
          <Route
            path='/signup'
            element={
              <Signup
                onSignup={() => window.location.replace("/dashboard")}
                onSwitchToLogin={() => window.location.replace("/login")}
              />
            }
          />
          <Route path='/dashboard' element={<YooptaEditorContainer />} />
          <Route path='*' element={<YooptaEditorContainer />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
