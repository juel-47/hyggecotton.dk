<?php

namespace App\Observers;

use App\Models\FooterSocial;
use Illuminate\Support\Facades\Cache;

class FooterSocialObserver
{
    /**
     * Handle the FooterSocial "created" event.
     */
    public function created(FooterSocial $footerSocial): void
    {
        Cache::forget('inertia_shared_data');
    }

    /**
     * Handle the FooterSocial "updated" event.
     */
    public function updated(FooterSocial $footerSocial): void
    {
        Cache::forget('inertia_shared_data');
    }

    /**
     * Handle the FooterSocial "deleted" event.
     */
    public function deleted(FooterSocial $footerSocial): void
    {
        Cache::forget('inertia_shared_data');
    }

    /**
     * Handle the FooterSocial "restored" event.
     */
    public function restored(FooterSocial $footerSocial): void
    {
        Cache::forget('inertia_shared_data');
    }

    /**
     * Handle the FooterSocial "force deleted" event.
     */
    public function forceDeleted(FooterSocial $footerSocial): void
    {
       Cache::forget('inertia_shared_data');
    }
}
