import React from "react";
import { Link } from "react-router-dom";

interface SidebarProps {
  className?: string;
  collapsed: boolean;
  onToggle: () => void;
  isDrawer?: boolean;
  open?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  className,
  collapsed,
  onToggle,
  isDrawer = false,
  open = false,
  onClose,
}) => {
  // Drawer animation classes
  const drawerClasses = isDrawer
    ? `transition-transform duration-500 ease-in-out transform ${
        open ? "translate-x-0" : "-translate-x-full"
      } w-64`
    : "";

  return (
    <div
      className={`bg-gray-800 text-white ${
        isDrawer
          ? drawerClasses
          : collapsed
          ? "w-16"
          : "w-64 transition-all duration-500 ease-in-out"
      } ${className}`}
      style={
        isDrawer
          ? { boxShadow: open ? "2px 0 8px rgba(0,0,0,0.2)" : undefined }
          : {}
      }
    >
      <div className='p-4 flex justify-between items-center'>
        {!collapsed && <h1 className='text-xl font-bold'>ZettaNotes</h1>}
        <button
          onClick={isDrawer ? onClose : onToggle}
          className='p-1 rounded hover:bg-gray-700'
          aria-label={isDrawer ? "Close sidebar" : "Toggle sidebar"}
        >
          {isDrawer ? (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          ) : collapsed ? (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M13 5l7 7-7 7M5 5l7 7-7 7'
              />
            </svg>
          ) : (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M11 19l-7-7 7-7m8 14l-7-7 7-7'
              />
            </svg>
          )}
        </button>
      </div>

      <nav className='mt-6'>
        <ul>
          {["Home", "Notes", "Favorites", "Tags", "Settings"].map(
            (item, index) => (
              <li key={index}>
                <Link
                  to={`/${item.toLowerCase()}`}
                  className='flex items-center py-3 px-4 hover:bg-gray-700'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-5 w-5'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                  >
                    <path
                      fillRule='evenodd'
                      d='M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z'
                      clipRule='evenodd'
                    />
                  </svg>
                  {!collapsed && <span className='ml-3'>{item}</span>}
                </Link>
              </li>
            )
          )}
        </ul>
      </nav>

      <div className='absolute bottom-0 w-full p-4'>
        <div className='flex items-center text-sm'>
          <div className='h-8 w-8 rounded-full bg-gray-600'></div>
          {!collapsed && <span className='ml-3'>User Profile</span>}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
