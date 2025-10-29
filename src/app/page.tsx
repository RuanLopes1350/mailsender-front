import Header from "@/components/header";
import Tab from "@/components/tab";

export default function Home() {
  return (
    <>
      <Tab icon='/dashboard-white.png' text='Dashboard' />
      <Tab icon='keys-white.png' text='API Keys'/>
      <Tab icon='email-white.png' text='Testar Email'/>
      <Tab icon='logs-white.png' text='Logs Recentes'/>
    </>
  );
}
