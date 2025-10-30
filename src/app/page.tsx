"use client";

import { useState } from "react";
import Tab from "@/components/tab";

export default function Home() {
  const [activeTab, setActiveTab] = useState("Dashboard");

  return (
    <>
      <Tab icon='/dashboard' text='Dashboard' selected={activeTab === 'Dashboard'} onSelect={() => setActiveTab('Dashboard')} />
      <Tab icon='/keys' text='API Keys' selected={activeTab === 'API Keys'} onSelect={() => setActiveTab('API Keys')} />
      <Tab icon='/email' text='Testar Email' selected={activeTab === 'Testar Email'} onSelect={() => setActiveTab('Testar Email')} />
      <Tab icon='/logs' text='Logs Recentes' selected={activeTab === 'Logs Recentes'} onSelect={() => setActiveTab('Logs Recentes')} />
    </>
  );
}
