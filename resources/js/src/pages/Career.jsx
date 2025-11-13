import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useJobApplyMutation } from "../redux/services/eCommerceApi";

const Career = () => {
    const [jobApply, { isLoading }] = useJobApplyMutation();
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [uploadedFile, setUploadedFile] = useState(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        setError,
        clearErrors,
    } = useForm();

    // Auto-dismiss messages after 5 seconds
    useEffect(() => {
        if (successMessage || errorMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage("");
                setErrorMessage("");
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [successMessage, errorMessage]);

    const onSubmit = async (data) => {
        setSuccessMessage("");
        setErrorMessage("");

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("email", data.email);
        formData.append("phone", data.phone);
        formData.append("position", data.position);
        formData.append("cover_letter", data.coverLetter);
        if (uploadedFile) {
            formData.append("resume", uploadedFile);
        }

        try {
            await jobApply(formData).unwrap();
            setSuccessMessage(
                "Application submitted successfully! We'll contact you soon."
            );
            reset();
            setUploadedFile(null);
        } catch (err) {
            console.error("Job apply error:", err);
            const msg =
                err?.data?.message ||
                err?.data?.errors?.[0] ||
                "Failed to submit. Please try again.";
            setErrorMessage(msg);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                setError("resume", { message: "File size must be under 10MB" });
                setUploadedFile(null);
                e.target.value = "";
                return;
            }
            if (
                ![
                    "application/pdf",
                    "application/msword",
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                ].includes(file.type)
            ) {
                setError("resume", { message: "Only PDF, DOC, DOCX allowed" });
                setUploadedFile(null);
                e.target.value = "";
                return;
            }
            clearErrors("resume");
            setUploadedFile(file);
            setValue("resume", file);
        }
    };

    const removeFile = () => {
        setUploadedFile(null);
        setValue("resume", null);
        document.getElementById("resume").value = "";
    };

    return (
        <div className="flex min-h-screen w-full bg-dark2">
            <div className="w-full flex flex-col items-center justify-center px-4 py-12">
                <div className="w-full max-w-5xl bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 md:p-12">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Join Our Team
                        </h1>
                        <p className="text-lg text-gray-300">
                            We're excited to have you apply! Please fill out the
                            form below.
                        </p>
                    </div>

                    {/* Auto-dismiss Messages */}
                    {successMessage && (
                        <div className="mb-6 p-4 bg-green-600/20 border border-green-500/50 rounded-xl text-green-300 text-center font-medium animate-pulse">
                            {successMessage}
                        </div>
                    )}
                    {errorMessage && (
                        <div className="mb-6 p-4 bg-red-600/20 border border-red-500/50 rounded-xl text-red-300 text-center font-medium animate-pulse">
                            {errorMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* Two-Column Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-200 mb-2">
                                    Full Name{" "}
                                    <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    {...register("name", {
                                        required: "Name is required",
                                    })}
                                    placeholder="John Doe"
                                    className="w-full px-5 py-4 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                                />
                                {errors.name && (
                                    <p className="mt-2 text-sm text-red-400">
                                        {errors.name.message}
                                    </p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-200 mb-2">
                                    Email Address{" "}
                                    <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="email"
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                            message: "Invalid email",
                                        },
                                    })}
                                    placeholder="john@example.com"
                                    className="w-full px-5 py-4 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                                />
                                {errors.email && (
                                    <p className="mt-2 text-sm text-red-400">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-medium text-gray-200 mb-2">
                                    Phone Number{" "}
                                    <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="tel"
                                    {...register("phone", {
                                        required: "Phone is required",
                                        pattern: {
                                            value: /^[\+]?[0-9\s\-\(\)\.]{10,18}$/,
                                            message: "Invalid phone number",
                                        },
                                    })}
                                    placeholder="+880 17XX-XXXXXX"
                                    className="w-full px-5 py-4 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                                />
                                {errors.phone && (
                                    <p className="mt-2 text-sm text-red-400">
                                        {errors.phone.message}
                                    </p>
                                )}
                            </div>

                            {/* Position */}
                            <div>
                                <label className="block text-sm font-medium text-gray-200 mb-2">
                                    Position{" "}
                                    <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    {...register("position", {
                                        required: "Position is required",
                                    })}
                                    placeholder="e.g. Frontend Developer"
                                    className="w-full px-5 py-4 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                                />
                                {errors.position && (
                                    <p className="mt-2 text-sm text-red-400">
                                        {errors.position.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Resume Upload - Interactive */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-200 mb-3">
                                Resume / CV{" "}
                                <span className="text-red-400">*</span>
                            </label>

                            {!uploadedFile ? (
                                <label
                                    htmlFor="resume"
                                    className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-white/40 rounded-xl cursor-pointer bg-white/10 hover:bg-white/20 transition-all duration-300 hover:border-purple-500 group"
                                >
                                    <div className="flex flex-col items-center pt-8 pb-6">
                                        <svg
                                            className="w-14 h-14 mb-4 text-purple-400 group-hover:scale-110 transition-transform"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M7 16h10M12 3v13m0 0l-4-4m4 4l4-4"
                                            />
                                        </svg>
                                        <p className="text-lg font-semibold text-white">
                                            Drop your resume here
                                        </p>
                                        <p className="text-sm text-gray-400 mt-2">
                                            or click to browse
                                        </p>
                                        <p className="text-xs text-gray-500 mt-3">
                                            PDF, DOC, DOCX • Max 10MB
                                        </p>
                                    </div>
                                    <input
                                        id="resume"
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </label>
                            ) : (
                                <div className="relative p-6 bg-white/10 border-2 border-purple-500/50 rounded-xl">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-purple-600/30 rounded-lg">
                                                <svg
                                                    className="w-8 h-8 text-purple-300"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z"
                                                    />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">
                                                    {uploadedFile.name}
                                                </p>
                                                <p className="text-sm text-gray-400">
                                                    {(
                                                        uploadedFile.size /
                                                        1024 /
                                                        1024
                                                    ).toFixed(2)}{" "}
                                                    MB
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={removeFile}
                                            className="p-2 hover:bg-red-600/30 rounded-full transition-colors"
                                        >
                                            <svg
                                                className="w-5 h-5 text-red-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M6 18L18 6M6 6l12 12"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            )}
                            {errors.resume && (
                                <p className="mt-2 text-sm text-red-400">
                                    {errors.resume.message}
                                </p>
                            )}
                        </div>

                        {/* Cover Letter - Full Width */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-200 mb-3">
                                Cover Letter{" "}
                                <span className="text-red-400">*</span>
                            </label>
                            <textarea
                                {...register("coverLetter", {
                                    required: "Cover letter is required",
                                })}
                                rows="6"
                                placeholder="Tell us why you're passionate about this role and how you can contribute..."
                                className="w-full px-5 py-4 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none transition-all"
                            />
                            {errors.coverLetter && (
                                <p className="mt-2 text-sm text-red-400">
                                    {errors.coverLetter.message}
                                </p>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading || !uploadedFile}
                            className={`w-full py-5 rounded-xl font-bold text-lg text-white transition-all duration-300 ${
                                isLoading || !uploadedFile
                                    ? "bg-purple-700/50 cursor-not-allowed"
                                    : "bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-2xl hover:shadow-purple-500/50 transform hover:-translate-y-1"
                            }`}
                        >
                            {isLoading ? "Submitting..." : "Submit Application"}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-400 mt-8">
                        We typically respond within 3–5 business days.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Career;
