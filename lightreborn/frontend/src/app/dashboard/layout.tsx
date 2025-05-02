import React from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <nav>...</nav>
      <main>{children}</main>
    </div>
  );
}