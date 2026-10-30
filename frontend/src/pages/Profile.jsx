import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setUserData } from "../redux/userSlice";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

const Profile = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { userData } = useSelector((state) => state.user);

    const [editMode, setEditMode] = useState(false);
    const [name, setName] = useState("");
    const [imageFile, setImageFile] = useState( null);
    const [preview, setPreview] = useState(userData?.image || "");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Keep the form in sync with Redux user data.
    useEffect(() => {
        setName(userData?.name || userData?.userName || "");
        setPreview(userData?.image || userData?.profilePic || "");
    }, [userData]);

    // Clean up temporary image previews.
    useEffect(() => {
        return () => {
            if (preview?.startsWith("blob:")) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setError("Please select a valid image.");
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            setError("Image size must be less than 2 MB.");
            return;
        }

        setError("");
        setImageFile(file);
        setPreview(URL.createObjectURL(file));
    };


    const handleSave = async () => {
        if (!name.trim()) {
            setError("Name cannot be empty.");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setMessage("");
            console.log('name', name)
            console.log("image", imageFile)
            const formData = new FormData();
            formData.append("name", name);

            if (imageFile) {
                formData.append("image", imageFile);
            }

            const res = await axios.put(
                `${API_URL}/api/user/profile`,
                formData,
                {
                    withCredentials: true,
                }
            );

            // Merge updated backend data into the current Redux user.
            const updatedUser = {
                ...userData,
                ...res.data.user,
            };

            // Update Redux immediately; no browser refresh required.
            dispatch(setUserData(updatedUser));

            // Update the local form display immediately too.
            setName(updatedUser.name || "");
            setPreview(updatedUser.image || "");
            setImageFile(null);
            setEditMode(false);
            setMessage("Profile updated successfully!");
        } catch (err) {
            console.error("Profile update error:", err);

            setError(
                err.response?.data?.message ||
                "Unable to update profile. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setName(userData?.name || userData?.userName || "");
        setPreview(userData?.image || userData?.profilePic || "");
        setImageFile(null);
        setEditMode(false);
        setError("");
        setMessage("");
    };

    const handleLogout = async () => {
        try {
          // Change this URL if your logout route uses a different path.
          await axios.get(`${API_URL}/api/auth/logout`, {
            withCredentials: true,
          });
          dispatch(setUserData(null));
          toast.success("Logout successfully")
        } catch (err) {
          console.error("Logout error:", err);
        } finally {
          
          navigate("/login");
        }
    };

    const displayName =
        userData?.name || userData?.userName || "Chatzy User";

    const initials = displayName
        .split(" ")
        .filter(Boolean)
        .map((word) => word[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    return (
        <div className="min-h-screen bg-[#f0f2f5] px-4 py-8 sm:px-6">
            <div className="mx-auto max-w-5xl">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm transition hover:bg-slate-100"
                            aria-label="Go back"
                        >
                            <svg
                                className="h-5 w-5"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="m15 18-6-6 6-6" />
                            </svg>
                        </button>

                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">
                                Profile
                            </h1>
                            <p className="text-sm text-slate-500">
                                Manage your Chatzy account
                            </p>
                        </div>
                    </div>

                    <Link
                        to="/"
                        className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-100"
                    >
                        <svg
                            className="h-5 w-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                        >
                            <path d="m3 10 9-7 9 7" />
                            <path d="M5 9v12h14V9M9 21v-7h6v7" />
                        </svg>
                        <span className="hidden sm:inline">Home</span>
                    </Link>
                </div>

                {/* Profile Card */}
                <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
                    {/* Cover */}
                    <div className="relative h-36 bg-gradient-to-r from-teal-600 via-emerald-500 to-cyan-500 sm:h-48">
                        <div className="absolute inset-0 opacity-15">
                            <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full border-[30px] border-white" />
                            <div className="absolute -bottom-32 right-1/3 h-64 w-64 rounded-full border-[25px] border-white" />
                        </div>
                    </div>

                    {/* Avatar and Details */}
                    <div className="relative px-5 pb-6 sm:px-10">
                        <div className="-mt-16 flex flex-col gap-4 sm:-mt-20 sm:flex-row sm:items-end sm:justify-between">
                            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end">
                                <div className="relative">
                                    {editMode && (
                                        <label
                                            className="absolute bottom-2 right-2 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-slate-100 text-slate-700 shadow-md transition hover:bg-slate-200"
                                            title="Change profile photo"
                                        >
                                            <svg
                                                className="h-4 w-4"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                            >
                                                <path d="M14 4h-4L8 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-4l-2-3Z" />
                                                <circle cx="12" cy="14" r="3" />
                                            </svg>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="hidden"
                                            />
                                        </label>
                                    )}

                                    {preview ? (
                                        <img
                                            src={preview}
                                            alt="Profile"
                                            className="h-32 w-32 rounded-full border-4 border-white bg-white object-cover shadow-md sm:h-40 sm:w-40"
                                        />
                                    ) : (
                                        <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-white bg-teal-100 text-4xl font-bold text-teal-700 shadow-md sm:h-40 sm:w-40">
                                            {initials || "U"}
                                        </div>
                                    )}
                                </div>

                                <div className="pb-1">
                                    <h2 className="text-2xl font-bold text-slate-800">
                                        {displayName}
                                    </h2>
                                    <p className="mt-1 text-sm text-slate-500">
                                        Chatzy Member
                                    </p>
                                </div>
                            </div>

                            {!editMode && (
                                <button
                                    onClick={() => {
                                        setName(userData?.name || userData?.userName || "");
                                        setEditMode(true);
                                        setMessage("");
                                        setError("");
                                    }}
                                    className="flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 active:scale-95"
                                >
                                    <svg
                                        className="h-4 w-4"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path d="m15 5 4 4M4 20l4-.8L19 8a2.8 2.8 0 0 0-4-4L4 15l0 5Z" />
                                    </svg>
                                    Edit Profile
                                </button>
                            )}
                        </div>

                        {/* Feedback */}
                        {message && (
                            <div className="mt-5 rounded-xl bg-teal-50 px-4 py-3 text-sm font-medium text-teal-700">
                                {message}
                            </div>
                        )}

                        {error && (
                            <div className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                                {error}
                            </div>
                        )}

                        {/* Personal Information */}
                        <div className="mt-8 border-t border-slate-100 pt-7">
                            <div className="mb-5 flex items-center justify-between">
                                <h3 className="text-lg font-bold text-slate-800">
                                    Personal Information
                                </h3>

                                <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
                                    {editMode ? "Editing" : "Your Profile"}
                                </span>
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                {/* Name */}
                                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                                    <div className="mb-3 flex items-center gap-2 text-slate-400">
                                        <svg
                                            className="h-5 w-5"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                        >
                                            <circle cx="12" cy="8" r="4" />
                                            <path d="M5 21v-2a7 7 0 0 1 14 0v2" />
                                        </svg>
                                        <span className="text-xs font-semibold uppercase tracking-wider">
                                            Full Name
                                        </span>
                                    </div>

                                    {editMode ? (
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Your name"
                                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10"
                                        />
                                    ) : (
                                        <p className="break-words font-semibold text-slate-800">
                                            {displayName}
                                        </p>
                                    )}
                                </div>


                                {/* Username - Read Only */}
                                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                                    <div className="mb-3 flex items-center gap-2 text-slate-400">
                                        <svg
                                            className="h-5 w-5"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                        >
                                            <circle cx="12" cy="8" r="4" />
                                            <path d="M5 21v-2a7 7 0 0 1 14 0v2" />
                                        </svg>

                                        <span className="text-xs font-semibold uppercase tracking-wider">
                                            Username
                                        </span>
                                    </div>

                                    <p className="break-words font-semibold text-slate-800">
                                        {userData?.userName || "Not provided"}
                                    </p>

                                    <p className="mt-1 text-xs text-slate-400">
                                        Username cannot be changed
                                    </p>
                                </div>

                                {/* Email */}
                                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                                    <div className="mb-3 flex items-center gap-2 text-slate-400">
                                        <svg
                                            className="h-5 w-5"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                        >
                                            <rect x="3" y="5" width="18" height="14" rx="2" />
                                            <path d="m3 7 9 6 9-6" />
                                        </svg>
                                        <span className="text-xs font-semibold uppercase tracking-wider">
                                            Email Address
                                        </span>
                                    </div>

                                    <p className="break-all font-semibold text-slate-800">
                                        {userData?.email || "Not provided"}
                                    </p>
                                    <p className="mt-1 text-xs text-slate-400">
                                        Email cannot be changed here
                                    </p>
                                </div>
                            </div>

                            {/* Edit Actions */}
                            {editMode && (
                                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                    <button
                                        onClick={handleCancel}
                                        disabled={loading}
                                        className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        onClick={handleSave}
                                        disabled={loading}
                                        className="rounded-xl bg-teal-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {loading ? "Saving..." : "Save Changes"}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Account Settings */}
                <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm sm:p-7">
                    <h3 className="mb-5 text-lg font-bold text-slate-800">
                        Account Settings
                    </h3>

                    <div className="space-y-2">
                        <button
                            onClick={() => navigate("/")}
                            className="flex w-full items-center gap-4 rounded-xl p-3 text-left transition hover:bg-slate-50"
                        >
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                <svg
                                    className="h-5 w-5"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                >
                                    <path d="M21 15a4 4 0 0 1-4 4H7l-4 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" />
                                    <path d="M8 10h8M8 14h5" />
                                </svg>
                            </div>

                            <div className="flex-1">
                                <p className="text-sm font-semibold text-slate-800">
                                    Chats
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                    Return to your conversations
                                </p>
                            </div>

                            <svg
                                className="h-5 w-5 text-slate-400"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="m9 18 6-6-6-6" />
                            </svg>
                        </button>

                        <div className="h-px bg-slate-100" />

                        <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-4 rounded-xl p-3 text-left transition hover:bg-red-50"
                        >
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
                                <svg
                                    className="h-5 w-5"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                >
                                    <path d="M10 17l5-5-5-5M15 12H3" />
                                    <path d="M12 3h6a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3h-6" />
                                </svg>
                            </div>

                            <div className="flex-1">
                                <p className="text-sm font-semibold text-red-600">
                                    Log Out
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                    Sign out of your Chatzy account
                                </p>
                            </div>

                            <svg
                                className="h-5 w-5 text-slate-400"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="m9 18 6-6-6-6" />
                            </svg>
                        </button>
                    </div>
                </div>

                <p className="mt-6 text-center text-xs text-slate-400">
                    © 2026 Chatzy. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default Profile;