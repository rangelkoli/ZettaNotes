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

import Paragraph from "@yoopta/paragraph";
import Blockquote from "@yoopta/blockquote";
import Embed from "@yoopta/embed";
import Image from "@yoopta/image";
import Link from "@yoopta/link";
import Callout from "@yoopta/callout";
import Video from "@yoopta/video";
import File from "@yoopta/file";
import Accordion from "@yoopta/accordion";
import { NumberedList, BulletedList, TodoList } from "@yoopta/lists";
import {
  Bold,
  Italic,
  CodeMark,
  Underline,
  Strike,
  Highlight,
} from "@yoopta/marks";
import { HeadingOne, HeadingThree, HeadingTwo } from "@yoopta/headings";
import Code from "@yoopta/code";
import Table from "@yoopta/table";
import Divider from "@yoopta/divider";
import ActionMenuList, {
  DefaultActionMenuRender,
} from "@yoopta/action-menu-list";
import Toolbar, { DefaultToolbarRender } from "@yoopta/toolbar";
import LinkTool, { DefaultLinkToolRender } from "@yoopta/link-tool";
// import { WITH_BASIC_INIT_VALUE } from "./init_value"; // Adjust the import path as necessary
import "./App.css"; // Adjust the import path as necessary

import { useMemo, useRef, useState as useReactState } from "react";
import SidebarComponent from "./components/sidebar"; // Adjust the import path as necessary
const plugins = [
  Paragraph,
  Table,
  Divider.extend({
    elementProps: {
      divider: (props) => ({
        ...props,
        color: "#007aff",
      }),
    },
  }),
  Accordion,
  HeadingOne,
  HeadingTwo,
  HeadingThree,
  Blockquote,
  Callout,
  NumberedList,
  BulletedList,
  TodoList,
  Code,
  Link,
  Embed,
  Image.extend({
    options: {
      async onUpload(file) {
        const uploadToCloudinary = async (file: File, resourceType: string) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", "your_upload_preset"); // Replace with your Cloudinary upload preset
          formData.append("resource_type", resourceType);

          const response = await fetch(
            `https://api.cloudinary.com/v1_1/your_cloud_name/upload`, // Replace with your Cloudinary cloud name
            {
              method: "POST",
              body: formData,
            }
          );

          if (!response.ok) {
            throw new Error("Failed to upload image to Cloudinary");
          }

          return response.json();
        };

        return { src: (await uploadToCloudinary(file, "image")).secure_url };
      },
    },
  }),
  Video.extend({
    options: {},
  }),
  // File.extend({
  //   options: {
  //     onUpload: async (file) => {
  //       const response = await uploadToCloudinary(file, "auto");
  //       return {
  //         src: response.secure_url,
  //         format: response.format,
  //         name: response.name,
  //         size: response.bytes,
  //       };
  //     },
  //   },
  // }),
];

const TOOLS = {
  ActionMenu: {
    render: DefaultActionMenuRender,
    tool: ActionMenuList,
  },
  Toolbar: {
    render: DefaultToolbarRender,
    tool: Toolbar,
  },
  LinkTool: {
    render: DefaultLinkToolRender,
    tool: LinkTool,
  },
};

const MARKS = [Bold, Italic, CodeMark, Underline, Strike, Highlight];

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

  const handleSidebarToggle = () => setSidebarCollapsed((prev) => !prev);

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
      <SidebarComponent
        className='fixed top-0 left-0 h-screen z-30'
        collapsed={sidebarCollapsed}
        onToggle={handleSidebarToggle}
      />
      <div
        className='lg:py-[100px] px-[20px] pt-[80px] pb-[40px] flex justify-center flex-col transition-all duration-300'
        style={{
          marginLeft: sidebarCollapsed ? "4rem" : "16rem", // 4rem = 64px (w-16), 16rem = 256px (w-64)
        }}
        ref={selectionRef}
      >
        <div>{changed}</div>
        <YooptaEditor
          editor={editor}
          plugins={plugins}
          tools={TOOLS}
          marks={MARKS}
          selectionBoxRoot={selectionRef}
          value={value}
          onChange={onChange}
          autoFocus
          style={{
            width: "100%",
          }}
        />
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
          <Route path='/dashboard' element={<WithBaseFullSetup />} />
          <Route path='*' element={<Navigate to='/login' replace />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
