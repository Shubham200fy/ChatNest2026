
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {useDispatch} from "react-redux"
import { setUserData } from "../redux/userSlice";

const SignUp = () => {
  const navigate = useNavigate();
  let dispatch = useDispatch();

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('')

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
  });

  const [agree, setAgree] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle Signup
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!agree) {
      alert("Please accept the Terms and Conditions");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${apiUrl}/api/auth/signup`,
        formData,
        {
          withCredentials: true,
        }
      );
      dispatch(setUserData(response.data.user))
      console.log("Signup Successful:", response.data);

      toast.success('Account created successfully')
      setErr('')
      navigate("/login");


    } catch (error) {
      console.error(
        "Signup Error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
        "Something went wrong. Please try again."
      );
    //   setErr(error.response.data.message)

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7ff] flex items-center justify-center p-4 md:p-8">

      <div className="w-full max-w-6xl min-h-[650px] bg-white rounded-3xl shadow-2xl shadow-indigo-100 overflow-hidden grid grid-cols-1 md:grid-cols-2">

        {/* LEFT SECTION */}
        <div className="hidden md:flex flex-col justify-between p-12 bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 text-white relative overflow-hidden">

          {/* Background Decoration */}
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>

          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-purple-400/30 rounded-full blur-3xl"></div>

          {/* Logo */}
          <div className="relative z-10 flex items-center gap-3">

            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">

              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.7 9.7 0 0 1-4-.85L3 20l1.2-3.2A7.5 7.5 0 0 1 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8Z"
                />
              </svg>

            </div>

            <span className="text-2xl font-bold tracking-wide">
              ChatNest
            </span>

          </div>

          {/* Main Content */}
          <div className="relative z-10 space-y-8">

            <div>

              <span className="inline-block px-4 py-2 rounded-full bg-white/15 border border-white/20 text-sm font-medium">
                ✨ Your conversations, reimagined
              </span>

              <h1 className="text-5xl font-extrabold leading-tight mt-6">
                Connect.
                <br />
                Share.
                <br />
                <span className="text-cyan-200">
                  Belong.
                </span>
              </h1>

              <p className="text-blue-100 mt-6 text-lg leading-relaxed max-w-md">
                A place where meaningful conversations
                happen. Connect with friends, share moments,
                and stay closer than ever.
              </p>

            </div>

            {/* Chat Illustration */}
            <div className="space-y-4 max-w-sm">

              <div className="bg-white/15 backdrop-blur-lg border border-white/20 p-4 rounded-2xl rounded-bl-none w-[85%]">

                <p className="text-sm text-blue-100 mb-2">
                  Sarah
                </p>

                <p className="text-sm">
                  Hey! Welcome to ChatNest 👋
                </p>

              </div>

              <div className="bg-white text-indigo-700 p-4 rounded-2xl rounded-br-none w-[85%] ml-auto shadow-lg">

                <p className="text-sm font-medium">
                  Excited to connect with everyone! 💙
                </p>

              </div>

              <div className="flex items-center gap-2 text-sm text-blue-100">

                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>

                People are connecting right now

              </div>

            </div>

          </div>

          {/* Footer */}
          <div className="relative z-10 text-sm text-blue-100">
            © 2026 ChatNest. Made for meaningful connections.
          </div>

        </div>

        {/* RIGHT SECTION */}
        <div className="flex flex-col justify-center px-6 py-10 sm:px-12 lg:px-16">

          {/* Mobile Logo */}
          <div className="flex md:hidden items-center justify-center gap-2 mb-8">

            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center text-white">

              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.7 9.7 0 0 1-4-.85L3 20l1.2-3.2A7.5 7.5 0 0 1 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8Z"
                />
              </svg>

            </div>

            <h2 className="text-2xl font-bold text-indigo-700">
              ChatNest
            </h2>

          </div>

          {/* Heading */}
          <div className="mb-8">

            <p className="text-indigo-600 font-semibold text-sm uppercase tracking-wider mb-3">
              Start your journey
            </p>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              Create your account
            </h2>

            <p className="text-gray-500 mt-3">
              Join ChatNest and start connecting with people.
            </p>

          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Username */}
            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                User Name
              </label>

              <input
                type="text"
                name="userName"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your user name"
                required
                minLength={3}
                autoComplete="username"
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none transition duration-300 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 placeholder:text-gray-400"
              />

            </div>

            {/* Email */}
            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none transition duration-300 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 placeholder:text-gray-400"
              />

            </div>

            {/* Password */}
            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>

              <div className="relative w-full">

                <input
                  type={show ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="w-full px-4 py-3.5 pr-20 bg-gray-50 border border-gray-200 rounded-xl outline-none transition duration-300 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 placeholder:text-gray-400"
                />

                <button
                  type="button"
                  onClick={() => setShow((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition"
                >
                  {show ? "Hide" : "Show"}
                </button>

              </div>

              <p className="text-xs text-gray-400 mt-2">
                Use at least 8 characters with letters and numbers.
              </p>

            </div>
            <p className="text-red">{err}</p>

            {/* Terms */}
            <div className="flex items-start gap-3">

              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                required
                className="mt-1 w-4 h-4 accent-indigo-600 cursor-pointer"
              />

              <p className="text-sm text-gray-500">

                I agree to the{" "}

                <a
                  href="#"
                  className="text-indigo-600 font-semibold hover:underline"
                >
                  Terms of Service
                </a>{" "}

                and{" "}

                <a
                  href="#"
                  className="text-indigo-600 font-semibold hover:underline"
                >
                  Privacy Policy
                </a>

              </p>

            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 hover:-translate-y-0.5 active:translate-y-0 transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {loading ? "Creating Account..." : "Create Account →"}
            </button>

          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-7">

            <div className="flex-1 h-px bg-gray-200"></div>

            <span className="text-sm text-gray-400">
              OR
            </span>

            <div className="flex-1 h-px bg-gray-200"></div>

          </div>

          {/* Google Button */}
          <button
            type="button"
            className="w-full py-3.5 border border-gray-200 rounded-xl flex items-center justify-center gap-3 font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition duration-300"
          >

            <svg viewBox="0 0 48 48" className="w-5 h-5">

              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"
              />

              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.93c-.58 2.96-2.26 5.48-4.77 7.18l7.98 6.19c4.65-4.3 6.84-10.62 6.84-17.84Z"
              />

              <path
                fill="#FBBC05"
                d="M10.53 28.59A14.4 14.4 0 0 1 9.5 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.88.93 7.54 2.56 10.78l7.97-6.19Z"
              />

              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.9-5.81l-7.98-6.19c-2.22 1.5-5.07 2.39-7.92 2.39-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"
              />

            </svg>

            Continue with Google

          </button>

          {/* Login */}
          <p className="text-center text-sm text-gray-500 mt-8">

            Already have an account?{" "}

            <Link
              to="/login"
              className="font-bold text-indigo-600 hover:text-indigo-800 transition"
            >
              Sign in
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
};

export default SignUp;