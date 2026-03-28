import { useForm, Link } from "@inertiajs/react";
import { useEffect } from "react";
import { route } from "ziggy-js";

const Login = ({ errors: serverErrors }) => {
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("customer.login.submit"), {
            onSuccess: () => {
                reset(); 
            },
            onError: () => {
                if (errors.email || serverErrors?.email) {
                    document.querySelector('input[name="email"]').focus();
                }
            },
        });
    };

    // General error auto clear after 6 seconds
    useEffect(() => {
        if (errors.email || errors.password) {
            const timer = setTimeout(() => {
                clearErrors();
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [errors, clearErrors]);

    return (
        <div className="flex min-h-screen w-full bg-dark1">
            <div className="w-full flex flex-col items-center justify-center px-4">
                <form
                    onSubmit={handleSubmit}
                    className="md:w-96 w-full max-w-md flex flex-col items-center justify-center"
                >
                    {/* Title */}
                    <h2 className="text-4xl text-cream font-medium">Sign in</h2>
                    <p className="text-sm text-gray mt-3">
                        Welcome back! Please sign in to continue
                    </p>

                    {/* Server-side general error (e.g. email not verified) */}
                    {/* {serverErrors?.email && (
                        <p className="text-red-500 text-sm mt-4 w-full text-center bg-red-50 p-3 rounded-md border border-red-200 animate-pulse">
                            {serverErrors.email}
                        </p>
                    )} */}

                    {/* Client-side validation errors (from useForm) */}
                    {(errors.email || errors.password) && (
                        <p className="text-red-500 text-sm mt-4 w-full text-center bg-red-50 p-3 rounded-md border border-red-200 animate-pulse">
                            {errors.email || errors.password}
                        </p>
                    )}

                    {/* Divider */}
                    <div className="flex items-center gap-4 w-full my-5">
                        <div className="w-full h-px bg-cream"></div>
                        <p className="text-nowrap text-sm text-cream">
                            or sign in with email
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
                                required
                            />
                        </div>
                        {/* Inertia validation error */}
                        {/* serverErrors.email already shown above */}
                    </div>

                    {/* Password Field */}
                    <div className="flex flex-col mt-6 w-full">
                        <div className="flex items-center w-full bg-transparent border border-cream h-12 rounded-full overflow-hidden pl-6 gap-2">
                            <svg
                                width="13"
                                height="17"
                                viewBox="0 0 13 17"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z"
                                    fill="#fffbed"
                                />
                            </svg>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData("password", e.target.value)}
                                placeholder="Password"
                                className="bg-transparent text-cream placeholder-cream outline-none text-sm w-full h-full"
                                required
                            />
                        </div>
                    </div>

                    {/* Remember Me + Forgot Password */}
                    <div className="w-full flex items-center justify-between mt-8 text-cream">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="remember"
                                checked={data.remember}
                                onChange={(e) => setData("remember", e.target.checked)}
                                className="h-5 w-5 accent-red rounded"
                            />
                            <label className="text-sm cursor-pointer" htmlFor="remember">
                                Remember me
                            </label>
                        </div>
                        <Link
                            href={route("password.request")}
                            className="text-sm underline hover:text-indigo-400 transition-colors"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={processing}
                        className={`mt-8 w-full h-11 rounded-full text-white font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                            processing
                                ? "bg-red/70 cursor-not-allowed"
                                : "bg-red hover:bg-red/90 cursor-pointer"
                        }`}
                    >
                        {processing ? (
                            <>
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v8z"
                                    />
                                </svg>
                                Logging in...
                            </>
                        ) : (
                            "Login"
                        )}
                    </button>

                    {/* Sign Up Link */}
                    <p className="text-gray text-sm mt-6 text-center">
                        Don’t have an account?{" "}
                        <Link
                            href={route("customer.register")}
                            className="text-indigo-400 hover:underline font-medium"
                        >
                            Sign up
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;