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
        if (uploadedFile) formData.append("resume", uploadedFile);

        try {
            await jobApply(formData).unwrap();
            setSuccessMessage(
                "Application submitted successfully! We'll contact you soon."
            );
            reset();
            setUploadedFile(null);
        } catch (err) {
            const msg =
                err?.data?.message ||
                err?.data?.errors?.[0] ||
                "Failed to submit. Please try again.";
            setErrorMessage(msg);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

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
    };

    const removeFile = () => {
        setUploadedFile(null);
        setValue("resume", null);
        document.getElementById("resume").value = "";
    };

    return (
        <div className="flex min-h-screen w-full bg-dark1 xl:px-20">
            <div className="w-full grid xl:grid-cols-2 gap-4   px-4 py-12">
                {/* নতুন কন্টেন্ট যোগ করা হয়েছে এখানে */}
                <div className="w-full max-w-md text-center xl:text-left mb-16 pt-20">
                    <h1 className="text-5xl md:text-5xl font-bold text-white mb-8">
                        Careers at{" "}
                        <span className="text-red">Hygge Cotton</span>
                    </h1>
                    <p className="text-sm lg:text-lg text-cream    leading-relaxed max-w-4xl mx-auto">
                        We’re always looking for creative minds who share our
                        love for design, sustainability, and craftsmanship.
                    </p>
                    <p className="text-sm lg:text-lg text-gray-300 mt-4 max-w-3xl mx-auto">
                        If you’d like to join our growing team in Copenhagen,
                        send your CV and a short introduction to:
                    </p>
                    <div className="mt-8">
                        <a
                            href="mailto:inf@hyggecotton.dk"
                            className="inline-flex items-center gap-3 text-2xl font-bold text-cream hover:text-red transition"
                        >
                            inf@hyggecotton.dk
                        </a>
                    </div>
                    <p className="text-gray-400 text-sm mt-10">
                        Or apply directly using the form below
                    </p>
                </div>

                {/* আগের ফর্ম কার্ড */}
                <div className="w-full   bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 md:p-12">
                    <div className="text-center mb-4">
                        <h2 className="text-4xl md:text-3xl font-bold text-white mb-4">
                            Join Our Team
                        </h2>
                        <p className="text-sm text-gray-300">
                            We're excited to have you apply! Please fill out the
                            form below.
                        </p>
                    </div>

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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            {/* Name, Email, Phone, Position — same as before */}
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
                                    className="w-full px-5 py-2 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red transition-all"
                                />
                                {errors.name && (
                                    <p className="mt-2 text-sm text-red-400">
                                        {errors.name.message}
                                    </p>
                                )}
                            </div>
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
                                    className="w-full px-5 py-2 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red transition-all"
                                />
                                {errors.email && (
                                    <p className="mt-2 text-sm text-red-400">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-200 mb-2">
                                    Phone Number
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
                                    className="w-full px-5 py-2 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red transition-all"
                                />
                                {errors.phone && (
                                    <p className="mt-2 text-sm text-red-400">
                                        {errors.phone.message}
                                    </p>
                                )}
                            </div>
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
                                    placeholder="e.g. Graphic Designer"
                                    className="w-full px-5 py-2 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red transition-all"
                                />
                                {errors.position && (
                                    <p className="mt-2 text-sm text-red-400">
                                        {errors.position.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Resume & Cover Letter — unchanged */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-200 mb-3">
                                Resume / CV{" "}
                                <span className="text-red-400">*</span>
                            </label>
                            {!uploadedFile ? (
                                <label
                                    htmlFor="resume"
                                    className="flex  items-center justify-center w-full h-38 py-2 border-2 border-dashed border-white/40 rounded-xl cursor-pointer bg-white/10 hover:bg-white/20 transition-all duration-300  group"
                                >
                                    <div className="flex flex-col items-center pt-8 pb-6">
                                        <svg
                                            className="w-14 h-14 mb-4 text-red group-hover:scale-110 transition-transform"
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
                                <div className="relative p-2 bg-white/10 border-2 border-red rounded-xl">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-red rounded-lg">
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
                                placeholder="Tell us why you're passionate about this role..."
                                className="w-full px-5 py-4 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red resize-none transition-all"
                            />
                            {errors.coverLetter && (
                                <p className="mt-2 text-sm text-red-400">
                                    {errors.coverLetter.message}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !uploadedFile}
                            className={`w-full py-5 rounded-xl font-bold text-lg text-white transition-all duration-300 ${
                                isLoading || !uploadedFile
                                    ? "bg-red cursor-not-allowed"
                                    : "bg-red to-pink-600 hover:bg-red  shadow-2xl transform hover:-translate-y-1"
                            }`}
                        >
                            {isLoading ? "Submitting..." : "Submit Application"}
                        </button>
                    </form>

                    <div className="text-center mt-12 pt-8 border-t border-white/10">
                        <p className="text-gray-400 text-sm">
                            We typically respond within{" "}
                            <strong>3–5 business days</strong>.<br />
                            Thank you for wanting to be part of Hygge Cotton
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Career;
