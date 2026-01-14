"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 1000);
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`);
    // For now, redirect to dashboard
    // TODO: Implement actual Azure AD authentication
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Decorative Section */}
      <div className="hidden lg:flex lg:w-1/2 p-12 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/99a49b96-13d7-4e13-af4a-62523ed36f98.jpg"
            alt="Background"
            fill
            className="object-cover"
            priority
          />
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-gray-900/50"></div>
        </div>

        {/* Content Cards */}
        <div className="relative z-10 w-full max-w-lg mx-auto my-auto grid grid-cols-3 gap-4 h-[500px]">
          {/* Row 1: Small + Large Purple Card */}
          <div className="col-span-1 row-span-1 bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-6 shadow-2xl animate-[fadeInDown_1s_ease-out]">
            {/* Empty decorative card */}
          </div>

          <div className="col-span-2 row-span-1 bg-gradient-to-br from-purple-400 to-purple-500 rounded-3xl p-6 shadow-2xl animate-[fadeInDown_1s_ease-out_0.1s_both] flex items-center">
            <h2 className="text-xl font-bold text-gray-900">
              Efficient Tracking.
              <br />
              Digital Innovation.
            </h2>
          </div>

          {/* Row 2: Large Purple Mail Card + Yellow Card */}
          <div className="col-span-2 row-span-2 bg-gradient-to-br from-purple-400 to-purple-500 rounded-3xl p-8 shadow-2xl flex items-center justify-center animate-[fadeInLeft_1s_ease-out_0.3s_both]">
            <div className="relative">
              <svg
                className="w-20 h-20 text-white animate-[bounce_2s_ease-in-out_infinite]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>

          <div className="col-span-1 row-span-1 bg-gradient-to-br from-yellow-200 to-yellow-300 rounded-3xl p-6 shadow-2xl flex items-start animate-[fadeInRight_1s_ease-out_0.4s_both]">
            <div>
              <div className="text-3xl mb-3 animate-[pulse_2s_ease-in-out_infinite]">+</div>
              <p className="text-gray-900 font-semibold text-sm leading-tight">
                Streamlined
                <br />
                document
                <br />
                management
              </p>
            </div>
          </div>

          {/* Row 3: Empty + Yellow Card */}
          <div className="col-span-1 col-start-1 row-span-1 bg-gradient-to-br from-yellow-200 to-yellow-300 rounded-3xl p-6 shadow-2xl animate-[fadeInUp_1s_ease-out_0.5s_both]">
            <div>
              <div className="text-3xl mb-3 animate-[pulse_2s_ease-in-out_infinite_0.5s]">+</div>
              <p className="text-gray-900 font-semibold text-sm leading-tight">
                Secure
                <br />
                & organized
              </p>
            </div>
          </div>

          <div className="col-span-1 row-span-1 bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-6 shadow-2xl animate-[fadeInUp_1s_ease-out_0.6s_both]">
            {/* Empty decorative card */}
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8 text-center">
            <Image
              src="/Gemini_Generated_Image_dq1ktcdq1ktcdq1k-removebg-preview.png"
              alt="DIGD Logo"
              width={120}
              height={120}
              className="mx-auto mb-4"
              priority
            />
          </div>

          {/* Sign Up Form */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Sign Up</h1>
            <p className="text-gray-600 text-sm">
              Access the DIGD Document Tracking System
              <br />
              and manage your official documents efficiently
            </p>
          </div>

          {/* Azure AD Sign In Button */}
          <button
            onClick={() => handleSocialLogin("azure")}
            className="w-full flex items-center justify-center gap-3 bg-[#0078D4] text-white font-semibold py-3 px-4 rounded-lg hover:bg-[#106EBE] transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <svg className="w-5 h-5" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 0H10V10H0V0Z" fill="#F25022"/>
              <path d="M11 0H21V10H11V0Z" fill="#7FBA00"/>
              <path d="M0 11H10V21H0V11Z" fill="#00A4EF"/>
              <path d="M11 11H21V21H11V11Z" fill="#FFB900"/>
            </svg>
            Sign in with Microsoft
          </button>

          {/* <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">or continue with email</span>
            </div>
          </div> */}

          {/* <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
                placeholder="Enter your email"
                required
              />
            </div>


            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-gray-900 font-semibold py-3 px-4 rounded-full border-2 border-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-200 disabled:opacity-50"
            >
              {isLoading ? "Signing in..." : "Log In"}
            </button>
          </form> */}
        </div>
      </div>
    </div>
  );
}
