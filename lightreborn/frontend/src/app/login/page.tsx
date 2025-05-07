"use client"
import Image from "next/image";
import logo from "@/assets/logo.png"
import LoginForm from "@/components/auth/LoginForm"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6">
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 rounded-full flex items-center justify-center">
            <div className="w-16 h-16 flex items-center justify-center">
              <Image src={logo} alt="Logo" className="w-full h-full object-contain" />
            </div>
          </div>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
