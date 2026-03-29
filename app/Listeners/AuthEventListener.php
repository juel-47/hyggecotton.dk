<?php

namespace App\Listeners;

use App\Models\ActivityLog;
use Illuminate\Auth\Events\Failed;
use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Logout;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthEventListener
{
    /**
     * Create the event listener.
     */
    public function __construct(protected Request $request)
    {
        //
    }

    /**
     * Handle successful login events.
     */
    public function handleLogin(Login $event): void
    {
        try {
            ActivityLog::create([
                'user_id' => $event->user->id,
                'action' => 'LOGIN_SUCCESS',
                'description' => "User {$event->user->email} logged in successfully.",
                'ip_address' => $this->request->ip(),
                'user_agent' => $this->request->userAgent(),
            ]);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error("AuthEventListener handleLogin error: " . $e->getMessage());
        }
    }

    /**
     * Handle failed login attempts.
     */
    public function handleFailed(Failed $event): void
    {
        try {
            $email = $event->credentials['email'] ?? 'Unknown';
            
            ActivityLog::create([
                'user_id' => $event->user?->id, // Might be null if user doesn't exist
                'action' => 'LOGIN_FAILED_ALERT',
                'description' => "Failed login attempt for email: {$email}",
                'ip_address' => $this->request->ip(),
                'user_agent' => $this->request->userAgent(),
            ]);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error("AuthEventListener handleFailed error: " . $e->getMessage());
        }
    }

    /**
     * Handle logout events.
     */
    public function handleLogout(Logout $event): void
    {
        try {
            if ($event->user) {
                ActivityLog::create([
                    'user_id' => $event->user->id,
                    'action' => 'LOGOUT',
                    'description' => "User {$event->user->email} logged out.",
                    'ip_address' => $this->request->ip(),
                    'user_agent' => $this->request->userAgent(),
                ]);
            }
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error("AuthEventListener handleLogout error: " . $e->getMessage());
        }
    }
}
