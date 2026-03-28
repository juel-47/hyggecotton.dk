<?php

namespace App\Observers;

use App\Models\LogoSetting;
use Illuminate\Support\Facades\Cache;

class LogoSettingObserver
{
    /**
     * Handle the LogoSetting "created" event.
     */
    public function created(LogoSetting $logoSetting): void
    {
        Cache::forget('inertia_shared_data');
    }

    /**
     * Handle the LogoSetting "updated" event.
     */
    public function updated(LogoSetting $logoSetting): void
    {
        Cache::forget('inertia_shared_data');
    }

    /**
     * Handle the LogoSetting "deleted" event.
     */
    public function deleted(LogoSetting $logoSetting): void
    {
        Cache::forget('inertia_shared_data');
    }

    /**
     * Handle the LogoSetting "restored" event.
     */
    public function restored(LogoSetting $logoSetting): void
    {
        Cache::forget('inertia_shared_data');
    }

    /**
     * Handle the LogoSetting "force deleted" event.
     */
    public function forceDeleted(LogoSetting $logoSetting): void
    {
        Cache::forget('inertia_shared_data');
    }
}
