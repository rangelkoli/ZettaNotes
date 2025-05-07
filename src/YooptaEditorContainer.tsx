import { useMemo, useRef, useState as useReactState, useEffect } from "react";
import YooptaEditor, {
  createYooptaEditor,
  YooptaContentValue,
} from "@yoopta/editor";
import { invoke } from "@tauri-apps/api/core";
import SidebarComponent from "./components/sidebar";
import { plugins, TOOLS, MARKS } from "./yooptaConfig";

const YooptaEditorContainer = () => {
  const [notes, setNotes] = useReactState<YooptaContentValue | undefined>(
    undefined
  );
  const [changed, setChanged] = useReactState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useReactState(false);
  const [sidebarOpen, setSidebarOpen] = useReactState(false); // for mobile drawer
  const selectionRef = useRef(null);
  const editor = useMemo(() => createYooptaEditor(), []);

  useEffect(() => {
    invoke<string>("load_notes").then((response) => {
      console.log("Loaded notes:", response);
      setNotes(response ? JSON.parse(response) : undefined);
      console.log(
        "Initial notes set:",
        response ? JSON.parse(response) : undefined
      );
    });
  }, []);

  const handleSidebarToggle = () => setSidebarCollapsed((prev) => !prev);
  const handleDrawerOpen = () => setSidebarOpen(true);
  const handleDrawerClose = () => setSidebarOpen(false);

  const onChange = (newValue: YooptaContentValue) => {
    setNotes(newValue);
    setChanged("Notes changed");
    // Save to backend on every change
    invoke<string>("save_notes", { notes: JSON.stringify(newValue) })
      .then((response) => {
        setChanged(response);
      })
      .catch((error) => {
        console.error("Error saving notes:", error);
      });
  };

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  if (typeof notes === "undefined") {
    return <div>Loading notes...</div>;
  }

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
          className='fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden'
          onClick={handleDrawerClose}
        />
      )}
      <div
        className='lg:py-[100px] px-[20px] pt-[80px] pb-[40px] flex justify-center flex-col transition-all duration-300'
        style={{
          marginLeft: sidebarCollapsed ? "4rem" : "16rem",
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
          value={notes}
          onChange={onChange}
          autoFocus
          style={{
            width: "100%",
          }}
        />
      </div>
    </div>
  );
};

export default YooptaEditorContainer;
