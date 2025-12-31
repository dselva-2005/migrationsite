import LoginForm from "@/components/LoginForm"
import { Metadata } from "next"
import { JSX } from "react"
export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
}

export default function LoginPage(): JSX.Element {
  return (
    <>
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <LoginForm redirectPath="/" />
    </div>
    </>
  )
}
