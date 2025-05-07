
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

export const plugins = [
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
  
  export const TOOLS = {
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
  
  export const MARKS = [Bold, Italic, CodeMark, Underline, Strike, Highlight];
  