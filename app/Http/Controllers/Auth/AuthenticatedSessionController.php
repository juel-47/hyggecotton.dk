<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use App\Notifications\OtpMail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\View\View;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): View
    {
        return view('auth.login');
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $user = User::where('email', $request->email)->first();

        // Check if account is active
        if ($user->status != 1) {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return redirect()->back()->withErrors([
                'email' => 'Your account is inactive. Please contact the support team.',
            ]);
        }

        // Generate OTP and redirect (ONLY IF 2FA IS ENABLED)
        if ($user->is_2fa_enabled) {
            $otp = $user->generateOtp();
            $user->notify(new OtpMail($otp));

            // Store user ID in session for partial auth
            $request->session()->put('auth.otp_user_id', $user->id);
            $request->session()->put('auth.otp_remember', $request->boolean('remember'));

            // Logout immediately to prevent unauthorized access until OTP is verified
            Auth::logout();

            return redirect()->route('admin.otp.form')->with('status', 'An OTP code has been sent to your email.');
        }

        return redirect()->intended(route('admin.dashboard', absolute: false));
    }

    /**
     * Show the OTP verification form.
     */
    public function showOtpForm(Request $request): View|RedirectResponse
    {
        if (!$request->session()->has('auth.otp_user_id')) {
            return redirect()->route('admin.login');
        }

        return view('auth.verify-otp');
    }

    /**
     * Verify the OTP code.
     */
    public function verifyOtp(Request $request): RedirectResponse
    {
        $request->validate(['otp' => 'required|string|size:6']);

        if (!$request->session()->has('auth.otp_user_id')) {
            return redirect()->route('admin.login');
        }

        $userId = $request->session()->get('auth.otp_user_id');
        $user = User::findOrFail($userId);

        if ($user->otp_code !== $request->otp || $user->otp_expires_at->isPast()) {
            return back()->withErrors(['otp' => 'Invalid or expired OTP code.']);
        }

        // Success! Clear OTP and log in
        $user->clearOtp();
        Auth::login($user, $request->session()->get('auth.otp_remember', false));

        // Clear session data
        $request->session()->forget(['auth.otp_user_id', 'auth.otp_remember']);
        $request->session()->regenerate();

        // Clear rate limiter for this user/IP
        RateLimiter::clear(Str::transliterate(Str::lower($user->email).'|'.$request->ip()));

        return redirect()->intended(route('admin.dashboard', absolute: false));
    }

    /**
     * Resend the OTP code.
     */
    public function resendOtp(Request $request): RedirectResponse
    {
        if (!$request->session()->has('auth.otp_user_id')) {
            return redirect()->route('admin.login');
        }

        $userId = $request->session()->get('auth.otp_user_id');
        $user = User::findOrFail($userId);

        $otp = $user->generateOtp();
        $user->notify(new OtpMail($otp));

        return back()->with('status', 'A new OTP code has been sent to your email.');
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
