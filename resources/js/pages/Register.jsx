import { Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import userIcon from '../src/assets/people.png'; // adjust path if needed
import { FaRegUser } from 'react-icons/fa';
import { route } from 'ziggy-js';

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const password = data.password;

    const onSubmit = (e) => {
        e.preventDefault();

        if (data.password !== data.password_confirmation) {
            toast.error("Passwords do not match. Please check and try again.", {
                position: "top-right",
                autoClose: 3000,
            });
            return;
        }

        post(('/customer-register'), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(
                    "Registration successful! Please check your email to verify your account.",
                    {
                        position: "top-center",
                        autoClose: 2000,
                        onClose: () => router.visit(route('resend-email')), // adjust route name if needed
                    }
                );
                // Optional: store email for resend verification page
                localStorage.setItem('pendingVerificationEmail', data.email.trim());
                reset();
            },
            onError: (errors) => {
                const message = errors?.message || "Registration failed. Please try again.";
                toast.error(message, {
                    position: "top-right",
                    autoClose: 3000,
                });
            },
        });
    };

    return (
        <div className="flex h-screen w-full bg-dark1">
            <ToastContainer />

            <div className="w-full flex flex-col items-center justify-center">
                <form
                    onSubmit={onSubmit}
                    className="md:w-96 w-80 flex flex-col items-center justify-center"
                >
                    <h2 className="text-4xl text-cream font-medium">Sign Up</h2>

                    <div className="flex items-center gap-4 w-full my-5">
                        <div className="w-full h-px bg-cream"></div>
                        <p className="w-full text-nowrap text-sm text-cream">
                            or sign up with email
                        </p>
                        <div className="w-full h-px bg-cream"></div>
                    </div>

                    {/* Full Name */}
                    <div className="flex flex-col w-full">
                        <div className="flex items-center w-full bg-transparent border border-cream h-12 rounded-full overflow-hidden pl-6 gap-2">
                            <FaRegUser className="text-cream" />
                            <input
                                type="text"
                                placeholder="Full Name"
                                className="bg-transparent text-cream placeholder-cream outline-none text-sm w-full h-full"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                        </div>
                        {errors.name && (
                            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div className="flex flex-col w-full mt-6">
                        <div className="flex items-center w-full bg-transparent border border-cream h-12 rounded-full overflow-hidden pl-6 gap-2">
                            <svg width="16" height="11" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M0 .55.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z"
                                    fill="#fffbed"
                                />
                            </svg>
                            <input
                                type="email"
                                placeholder="Email id"
                                className="bg-transparent text-cream placeholder-cream outline-none text-sm w-full h-full"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />
                        </div>
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="flex flex-col w-full mt-6">
                        <div className="flex items-center w-full bg-transparent border border-cream h-12 rounded-full overflow-hidden pl-6 gap-2">
                            <svg width="13" height="17" viewBox="0 0 13 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z"
                                    fill="#fffbed"
                                />
                            </svg>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                className="bg-transparent text-cream placeholder-cream outline-none text-sm w-full h-full"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="px-3 text-cream"
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div className="flex flex-col w-full mt-6">
                        <div className="flex items-center w-full bg-transparent border border-cream h-12 rounded-full overflow-hidden pl-6 gap-2">
                            <svg width="13" height="17" viewBox="0 0 13 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z"
                                    fill="#fffbed"
                                />
                            </svg>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm Password"
                                className="bg-transparent text-cream placeholder-cream outline-none text-sm w-full h-full"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="px-3 text-cream"
                            >
                                {showConfirmPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                        {errors.password_confirmation && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.password_confirmation}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className={`mt-8 w-full h-11 rounded-full text-white cursor-pointer bg-red hover:opacity-90 transition-opacity ${
                            processing ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                    >
                        {processing ? "Registering..." : "Register"}
                    </button>

                    <p className="text-gray text-sm mt-4">
                        Already have an account?{" "}
                        <Link
                            href={route('customer.login')} // or your sign-in route name
                            className="text-indigo-400 hover:underline"
                        >
                            Sign In
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;
