"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { MoonLoader } from "react-spinners";
import { authService } from "@/services/authService";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const token = authService.getToken();
    const savedUser = authService.getUser();

    if (token && savedUser) {
      router.replace('/painel');
      return;
    }

    router.replace('/login');
  }, [router]);
  return (<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <MoonLoader color="#4F46E5" size={50} />
    <p className="mt-4 text-gray-600">Aguarde...</p>
  </div>
  );
}
