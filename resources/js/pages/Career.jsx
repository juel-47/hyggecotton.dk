import React, { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import { toast } from "react-toastify";

const Career = () => {
    const [uploadedFile, setUploadedFile] = useState(null);
    const [uploadedVideo, setUploadedVideo] = useState(null);

    const { data, setData, post, processing, errors, reset, clearErrors, setError } = useForm({
        name: "",
        email: "",
        phone: "",
        position: "",
        resume: null,
        video_cv: null,
        cover_letter: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("email", data.email);
        formData.append("phone", data.phone);
        formData.append("position", data.position);
        formData.append("cover_letter", data.cover_letter || "");

        if (uploadedFile) formData.append("resume", uploadedFile);
        if (uploadedVideo) formData.append("video_cv", uploadedVideo);

        post(route("job.apply.store"), {
            data: formData,
            forceFormData: true,
            onSuccess: () => {
                toast.success("Application submitted successfully! We'll contact you soon.");
                reset();
                setUploadedFile(null);
                setUploadedVideo(null);
            },
            onError: (errors) => {
                const errorMsg = errors.message ||
                    Object.values(errors)[0] ||
                    "Failed to submit. Please try again.";
                toast.error(errorMsg);
            },
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 10 * 1024 * 1024) {
            toast.error("Resume: File size must be under 10MB");
            setError("resume", "File size must be under 10MB");
            setUploadedFile(null);
            e.target.value = "";
            return;
        }

        const allowedTypes = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];
        if (!allowedTypes.includes(file.type)) {
            toast.error("Resume: Only PDF, DOC, DOCX allowed");
            setError("resume", "Only PDF, DOC, DOCX allowed");
            setUploadedFile(null);
            e.target.value = "";
            return;
        }

        clearErrors("resume");
        setUploadedFile(file);
        setData("resume", file);
    };

    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 100 * 1024 * 1024) {
            toast.error("Video CV: Size must be under 100MB");
            setError("video_cv", "Video size must be under 100MB");
            setUploadedVideo(null);
            e.target.value = "";
            return;
        }

        const allowedVideoTypes = [
            "video/mp4",
            "video/avi",
            "video/quicktime",      // .mov
            "video/x-msvideo",       // .avi
            "video/x-ms-wmv",        // .wmv
            "video/x-flv",
            "video/webm",
            "video/mpeg",
        ];
        if (!allowedVideoTypes.includes(file.type)) {
            toast.error("Video CV: Only MP4, AVI, MOV, WMV, FLV, WebM, MPEG allowed");
            setError("video_cv", "Invalid video format");
            setUploadedVideo(null);
            e.target.value = "";
            return;
        }

        clearErrors("video_cv");
        setUploadedVideo(file);
        setData("video_cv", file);
    };

    const removeFile = () => {
        setUploadedFile(null);
        setData("resume", null);
        document.getElementById("resume").value = "";
        clearErrors("resume");
    };

    const removeVideo = () => {
        setUploadedVideo(null);
        setData("video_cv", null);
        document.getElementById("video_cv").value = "";
        clearErrors("video_cv");
    };

    return (
        <>
            <Head title="Careers | Hygge Cotton" />

            <div className="flex min-h-screen w-full bg-dark1 relative">
                <div className="max-w-[1200px] mx-auto px-4 xl:px-20">
                    <div className="w-full grid xl:grid-cols-5 gap-4 py-12">
                        {/* Left Content */}
                        <div className="col-span-2 w-full max-w-md text-center xl:text-left mb-16 pt-20">
                            <h1 className="text-2xl md:text-4xl font-bold text-white mb-8">
                                Careers at <span className="text-red">Hygge Cotton</span>
                            </h1>
                            <p className="text-sm lg:text-md text-cream leading-relaxed max-w-4xl mx-auto">
                                We're always looking for creative minds who share our love for design, sustainability, and craftsmanship.
                            </p>
                            <p className="text-sm lg:text-md text-gray-300 mt-4 max-w-3xl mx-auto">
                                If you'd like to join our growing team in Copenhagen, send your CV and a short introduction to:
                            </p>
                            <div className="mt-8">
                                <a href="mailto:info@hyggecotton.dk" className="inline-flex items-center gap-3 text-2xl font-bold text-cream hover:text-red transition">
                                    info@hyggecotton.dk
                                </a>
                            </div>
                            <p className="text-gray-400 text-sm mt-10">
                                Or apply directly using the form below
                            </p>
                        </div>

                        {/* Loading Overlay */}
                        {processing && (
                            <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">
                                <div className="text-center">
                                    <div className="w-20 h-20 border-4 mx-auto border-white/20 rounded-full animate-spin border-t-red"></div>
                                    <p className="text-white text-lg font-medium mt-6 animate-pulse">
                                        Submitting your application...
                                    </p>
                                    <p className="text-gray-300 text-sm mt-2">
                                        Please wait a moment
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Form Card */}
                        <div className="col-span-3 w-full bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-4 md:p-8">
                            <div className="text-center mb-8">
                                <h2 className="text-4xl md:text-3xl font-bold text-white mb-4">
                                    Join Our Team
                                </h2>
                                <p className="text-sm text-gray-300">
                                    We're excited to have you apply! Please fill out the form below.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-200 mb-2">
                                            Full Name <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData("name", e.target.value)}
                                            className="w-full px-5 py-2 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all"
                                        />
                                        {errors.name && <p className="mt-2 text-sm text-red-400">{errors.name}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-200 mb-2">
                                            Email Address <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData("email", e.target.value)}
                                            className="w-full px-5 py-2 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all"
                                        />
                                        {errors.email && <p className="mt-2 text-sm text-red-400">{errors.email}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-200 mb-2">
                                            Phone Number <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            value={data.phone}
                                            onChange={(e) => setData("phone", e.target.value)}
                                            className="w-full px-5 py-2 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all"
                                        />
                                        {errors.phone && <p className="mt-2 text-sm text-red-400">{errors.phone}</p>}
                                    </div>

                                    <div className="relative">
                                        <label className="block text-sm font-medium text-gray-200 mb-2">
                                            Position <span className="text-red-400">*</span>
                                        </label>
                                        <select
                                            value={data.position}
                                            onChange={(e) => setData("position", e.target.value)}
                                            className="w-full px-5 py-3 bg-white/20 border border-white/30 rounded-xl text-white focus:outline-none transition-all appearance-none cursor-pointer hover:bg-white/25"
                                        >
                                            <option value="" disabled>-- Choose your position --</option>
                                            <option value="Sales Executive">Sales Executive</option>
                                            <option value="Sales Manager">Sales Manager</option>
                                            <option value="Accountant">Accountant</option>
                                            <option value="Graphic Designer">Graphic Designer</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none mt-8">
                                            <svg className="w-6 h-6 text-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                        {errors.position && <p className="mt-2 text-sm text-red-400">{errors.position}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Video CV */}
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-200 mb-3">
                                            Video Introduction <span className="text-red-400">*</span>
                                        </label>
                                        {!uploadedVideo ? (
                                            <label htmlFor="video_cv" className="flex items-center justify-center w-full py-2 border-2 border-dashed border-white/40 rounded-xl cursor-pointer bg-white/10 hover:bg-white/20 transition-all duration-300">
                                                <div className="flex flex-col items-center">
                                                    <p className="text-sm font-semibold text-white">Drop your video CV here</p>
                                                    <p className="text-[10px] text-gray mt-2">MP4, AVI, MOV • Max 100MB</p>
                                                </div>
                                                <input id="video_cv" type="file" accept="video/*" onChange={handleVideoChange} className="hidden" />
                                            </label>
                                        ) : (
                                            <div className="relative p-2 bg-white/10 border-2 border-red rounded-xl">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="p-3 bg-red rounded-lg">
                                                            <svg className="w-8 h-8 text-purple-300" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2h6v4H7V5zm0 5h6v3H7v-3z" />
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <p className="text-white font-medium">{uploadedVideo.name}</p>
                                                            <p className="text-sm text-gray-400">{(uploadedVideo.size / 1024 / 1024).toFixed(2)} MB</p>
                                                        </div>
                                                    </div>
                                                    <button type="button" onClick={removeVideo} className="p-2 hover:bg-red-600/30 rounded-full transition-colors">
                                                        <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        {errors.video_cv && <p className="mt-2 text-sm text-red-400">{errors.video_cv}</p>}
                                    </div>

                                    {/* Resume */}
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-200 mb-3">
                                            Resume / CV <span className="text-red-400">*</span>
                                        </label>
                                        {!uploadedFile ? (
                                            <label htmlFor="resume" className="flex items-center justify-center w-full py-2 border-2 border-dashed border-white/40 rounded-xl cursor-pointer bg-white/10 hover:bg-white/20 transition-all duration-300">
                                                <div className="flex flex-col items-center">
                                                    <p className="text-sm font-semibold text-white">Drop your resume here</p>
                                                    <p className="text-[10px] text-gray mt-2">PDF, DOC, DOCX • Max 10MB</p>
                                                </div>
                                                <input id="resume" type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="hidden" />
                                            </label>
                                        ) : (
                                            <div className="relative p-2 bg-white/10 border-2 border-red rounded-xl">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="p-3 bg-red rounded-lg">
                                                            <svg className="w-8 h-8 text-purple-300" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z" />
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <p className="text-white font-medium">{uploadedFile.name}</p>
                                                            <p className="text-sm text-gray-400">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                                        </div>
                                                    </div>
                                                    <button type="button" onClick={removeFile} className="p-2 hover:bg-red-600/30 rounded-full transition-colors">
                                                        <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        {errors.resume && <p className="mt-2 text-sm text-red-400">{errors.resume}</p>}
                                    </div>
                                </div>

                                {/* Cover Letter */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-200 mb-3">
                                        Cover Letter <span className="text-red-400">*</span>
                                    </label>
                                    <textarea
                                        value={data.cover_letter}
                                        onChange={(e) => setData("cover_letter", e.target.value)}
                                        rows="6"
                                        className="w-full px-5 py-4 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none resize-none transition-all"
                                    />
                                    {errors.cover_letter && <p className="mt-2 text-sm text-red-400">{errors.cover_letter}</p>}
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing || !uploadedFile || !uploadedVideo}
                                    className={`w-full py-5 rounded-xl font-bold text-lg text-white transition-all duration-300 ${
                                        processing || !uploadedFile || !uploadedVideo
                                            ? "bg-red/70 cursor-not-allowed"
                                            : "bg-red hover:bg-red-dark shadow-2xl hover:-translate-y-1"
                                    }`}
                                >
                                    {processing ? "Submitting..." : "Submit Application"}
                                </button>
                            </form>

                            <div className="text-center mt-12">
                                <p className="text-gray-400 text-sm">
                                    We typically respond within <strong>3–5 business days</strong>.<br />
                                    Thank you for wanting to be part of Hygge Cotton
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Career;