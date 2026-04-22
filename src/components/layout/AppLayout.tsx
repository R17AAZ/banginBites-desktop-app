import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar, { Role } from './Sidebar';
import TopNavbar from './TopNavbar';


interface AppLayoutProps {
  role: Role;
  pageTitle: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({ role, pageTitle }) => {
  return (
    <div className="flex h-screen w-full bg-neutral-50 overflow-hidden">
      <Sidebar role={role} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Fixed Top Navbar */}
        <TopNavbar title={pageTitle} />

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="w-full h-full ">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
