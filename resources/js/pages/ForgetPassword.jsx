import React, { useState, useEffect } from "react";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { toast } from "react-toastify";
import { route } from "ziggy-js";

const ForgotPassword = () => {
    const { props } = usePage();
    // const { flash } = props;

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [email, setEmail] = useState("");
    const [canResend, setCanResend] = useState(false);
    const [countdown, setCountdown] = useState(30);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        email: "",
    });

    // Show toast for success flash message (sent from backend)
    // useEffect(() => {
    //     if (flash?.success) {
    //         toast.success(flash.success);
    //     }
    // }, [flash]);

    // Resend Timer Logic
    useEffect(() => {
        if (isSubmitted && countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else if (countdown === 0) {
            setCanResend(true);
        }
    }, [isSubmitted, countdown]);

    const onSubmit = (e) => {
        e.preventDefault();
        clearErrors();

        post("/customer/forgot-password", {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                // On success: show submitted state, save email, start timer
                setEmail(data.email);
                setIsSubmitted(true);
                setCanResend(false);
                setCountdown(30);
                reset("email");
                toast.success("Password reset link sent to your email.");
                // toast.success is handled via flash from backend if you prefer,
                // but you can also add here if no flash is set
            },
            onError: () => {
                toast.error("Failed to send reset link. Please try again.");
                // Errors (validation or general) are in `errors` prop
                // Optionally show a general error toast if needed
            },
        });
    };

    // Resend Function
    const handleResend = () => {
        if (canResend && email) {
            setData("email", email);
            // Trigger the same submit logic
            post("/customer/forgot-password", {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    setCanResend(false);
                    setCountdown(30);
                },
            });
        }
    };

    return (
        <>
            <Head title="Forgot Password" />

            <div className="flex min-h-screen w-full bg-dark1">
                <div className="w-full flex flex-col items-center justify-center px-4">
                    {/* Success State */}
                    {isSubmitted ? (
                        <div className="md:w-96 w-full max-w-md flex flex-col items-center justify-center text-center space-y-6">
                            {/* Success Icon */}
                            <div className="mx-auto">
                                <svg
                                    width="80"
                                    height="80"
                                    viewBox="0 0 64 64"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="text-green-500"
                                >
                                    <circle
                                        cx="32"
                                        cy="32"
                                        r="28"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        fill="none"
                                    />
                                    <path
                                        d="M20 32L28 40L44 24"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>

                            <div>
                                <h2 className="text-3xl text-cream font-medium mb-2">
                                    Check Your Email
                                </h2>
                                <p className="text-sm text-gray max-w-xs mx-auto">
                                    We’ve sent a password reset link to
                                    <span className="text-cream font-medium">
                                        {" "}
                                        {email}
                                    </span>
                                </p>
                                <p className="text-xs text-gray mt-2">
                                    Please check your{" "}
                                    <span className="text-cream">inbox</span> and{" "}
                                    <span className="text-cream">spam/junk</span>{" "}
                                    folder.
                                </p>
                            </div>

                            {/* Resend Button with Timer */}
                            <button
                                onClick={handleResend}
                                disabled={!canResend || processing}
                                className={`text-sm font-medium transition-all ${
                                    canResend
                                        ? "text-indigo-400 hover:underline cursor-pointer"
                                        : "text-gray opacity-60 cursor-not-allowed"
                                }`}
                            >
                                {canResend
                                    ? "Resend Email"
                                    : `Resend in ${countdown}s`}
                            </button>

                            {/* Support Link */}
                            <p className="text-xs text-gray">
                                Still no email?{" "}
                                <a
                                    href="mailto:support@yourapp.com"
                                    className="text-indigo-400 hover:underline"
                                >
                                    Contact support
                                </a>
                            </p>

                            {/* Back to Sign In */}
                            <p className="text-sm text-gray mt-4">
                                <Link
                                    href="/signin"
                                    className="text-indigo-400 hover:underline font-medium"
                                >
                                    Back to Sign In
                                </Link>
                            </p>
                        </div>
                    ) : (
                        /* Form State */
                        <form
                            onSubmit={onSubmit}
                            className="md:w-96 w-full max-w-md flex flex-col items-center justify-center"
                        >
                            <h2 className="text-4xl text-cream font-medium">
                                Forgot Password
                            </h2>
                            <p className="text-sm text-gray mt-3 text-center max-w-xs">
                                Enter your email and we’ll send you a link to reset
                                your password.
                            </p>

                            {/* General / Validation Errors */}
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-4 w-full text-center bg-red-50 p-2 rounded-md">
                                    {errors.email}
                                </p>
                            )}
                            {errors.general && (
                                <p className="text-red-500 text-sm mt-4 w-full text-center bg-red-50 p-2 rounded-md">
                                    {errors.general}
                                </p>
                            )}

                            <div className="flex items-center gap-4 w-full my-5">
                                <div className="w-full h-px bg-cream"></div>
                                <p className="text-nowrap text-sm text-cream">
                                    reset via email
                                </p>
                                <div className="w-full h-px bg-cream"></div>
                            </div>

                            {/* Email Field */}
                            <div className="flex flex-col w-full">
                                <div className="flex items-center w-full bg-transparent border border-cream h-12 rounded-full overflow-hidden pl-6 gap-2">
                                    <svg
                                        width="16"
                                        height="11"
                                        viewBox="0 0 16 11"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M0 .55.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z"
                                            fill="#fffbed"
                                        />
                                    </svg>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData("email", e.target.value)}
                                        placeholder="Email id"
                                        className="bg-transparent text-cream placeholder-cream outline-none text-sm w-full h-full"
                                        disabled={processing}
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className={`mt-8 w-full h-11 rounded-full text-white font-medium bg-red hover:bg-red/90 transition-all duration-200 ${
                                    processing
                                        ? "opacity-50 cursor-not-allowed"
                                        : "cursor-pointer"
                                }`}
                            >
                                {processing ? "Sending..." : "Send Reset Link"}
                            </button>

                            <p className="text-gray text-sm mt-6 text-center">
                                Remember your password?{" "}
                                <Link
                                    className="text-indigo-400 hover:underline font-medium"
                                    href={route("customer.login")}
                                >
                                    Back to Sign in
                                </Link>
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </>
    );
};

export default ForgotPassword;