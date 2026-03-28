<?php

namespace App\Observers;

use App\Models\FooterInfo;
use Illuminate\Support\Facades\Cache;

class FooterInfoObserver
{
    /**
     * Handle the FooterInfo "created" event.
     */
    public function created(FooterInfo $footerInfo): void
    {
        Cache::forget('inertia_shared_data');
    }

    /**
     * Handle the FooterInfo "updated" event.
     */
    public function updated(FooterInfo $footerInfo): void
    {
        Cache::forget('inertia_shared_data');
    }

    /**
     * Handle the FooterInfo "deleted" event.
     */
    public function deleted(FooterInfo $footerInfo): void
    {
        Cache::forget('inertia_shared_data');
    }

    /**
     * Handle the FooterInfo "restored" event.
     */
    public function restored(FooterInfo $footerInfo): void
    {
        Cache::forget('inertia_shared_data');
    }

    /**
     * Handle the FooterInfo "force deleted" event.
     */
    public function forceDeleted(FooterInfo $footerInfo): void
    {
        Cache::forget('inertia_shared_data');
    }
}
