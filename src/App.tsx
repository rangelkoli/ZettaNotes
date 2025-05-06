import React, { useState } from "react";
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
import { WITH_BASIC_INIT_VALUE } from "./init_vakue"; // Adjust the import path as necessary
import "./App.css"; // Adjust the import path as necessary

import { useMemo, useRef, useState as useReactState } from "react";

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
  const [value, setValue] = useReactState(WITH_BASIC_INIT_VALUE);
  const editor = useMemo(() => createYooptaEditor(), []);
  const selectionRef = useRef(null);

  const onChange = (
    newValue: YooptaContentValue,
    options: YooptaOnChangeOptions
  ) => {
    setValue(newValue);
  };

  return (
    <div
      className='md:py-[100px] md:pl-[200px] md:pr-[80px] px-[20px] pt-[80px] pb-[40px] flex justify-center bg-gray-100'
      ref={selectionRef}
    >
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

          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
          padding: "20px",
        }}
      />
    </div>
  );
}

function App() {
  const [screen, setScreen] = useState<"login" | "signup" | "editor">("login");

  if (screen === "login") {
    return (
      <Login
        onLogin={() => setScreen("editor")}
        onSwitchToSignup={() => setScreen("signup")}
      />
    );
  }
  if (screen === "signup") {
    return (
      <Signup
        onSignup={() => setScreen("editor")}
        onSwitchToLogin={() => setScreen("login")}
      />
    );
  }
  return <WithBaseFullSetup />;
}

export default App;
