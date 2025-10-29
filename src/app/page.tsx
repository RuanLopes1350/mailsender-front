import Header from "@/components/header";
import Tab from "@/components/tab";

export default function Home() {
  return (
    <>
      <Tab icon='/dashboard' text='Dashboard' />
      <Tab icon='keys' text='API Keys' />
      <Tab icon='email' text='Testar Email' />
      <Tab icon='logs' text='Logs Recentes' />
    </>
  );
}
