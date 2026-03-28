<?php

namespace App\Listeners;

use Illuminate\Auth\Events\Failed;
use App\Helpers\SecurityLogger;
use Illuminate\Support\Facades\Cache;

class LogFailedLogin
{
    public function handle(Failed $event)
    {
        $email = $event->credentials['email'] ?? 'unknown';
        SecurityLogger::log('FAILED_LOGIN', "Failed login attempt for email: {$email}");

        // Rate limiting and alert count
        $key = 'failed_login_count_' . $email;
        $count = Cache::get($key, 0) + 1;
        Cache::put($key, $count, 3600); // 1 hour

        if ($count >= 3) {
            SecurityLogger::log('SECURITY_ALERT', "{$count} failed login attempts for {$email}.");
            // Note: In production, trigger an actual email here.
        }
    }
}
