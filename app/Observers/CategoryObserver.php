<?php

namespace App\Observers;

use App\Models\Category;
use Illuminate\Support\Facades\Cache;
use App\Support\CacheKeys;

// class CategoryObserver
// {
//     private function clearCategoryCaches(): void
//     {
//         Cache::forget(CacheKeys::HOME_PAGE);
//         Cache::forget(CacheKeys::ALL_PRODUCTS);

//         // for nav
//         Cache::forget('categories');
//         Cache::forget('active_categories');
//         Cache::forget('navbar_categories');
//         Cache::forget('menu_categories');
//         Cache::forget('header_categories');

//         // tag
//         Cache::tags(['categories', 'menu', 'navbar'])->flush();

//         // home page 
//         Cache::forget('home_page_data');
//         Cache::forget(CacheKeys::INERTIA_SHARED);
//     }
//     /**
//      * Handle the Category "created" event.
//      */
//     public function created(Category $category): void
//     {
//         Cache::forget(CacheKeys::HOME_PAGE);
//         $this->clearCategoryCaches();
//     }

//     /**
//      * Handle the Category "updated" event.
//      */
//     public function updated(Category $category): void
//     {
//         Cache::forget(CacheKeys::HOME_PAGE);
//         $this->clearCategoryCaches();
//     }

//     /**
//      * Handle the Category "deleted" event.
//      */
//     public function deleted(Category $category): void
//     {
//         Cache::forget(CacheKeys::HOME_PAGE);
//         $this->clearCategoryCaches();
//     }

//     /**
//      * Handle the Category "restored" event.
//      */
//     public function restored(Category $category): void
//     {
//         Cache::forget(CacheKeys::HOME_PAGE);
//         $this->clearCategoryCaches();
//     }

//     /**
//      * Handle the Category "force deleted" event.
//      */
//     public function forceDeleted(Category $category): void
//     {
//         Cache::forget(CacheKeys::HOME_PAGE);
//         $this->clearCategoryCaches();
//     }
// }

class CategoryObserver
{
    private function invalidateAllProductsCache(): void
    {
        $current = Cache::get(CacheKeys::ALL_PRODUCTS_TAG, 1);
        Cache::put(CacheKeys::ALL_PRODUCTS_TAG, $current + 1);

        Cache::forget(CacheKeys::HOME_PAGE);

        // Filter data cache clear
        Cache::forget('categories');
        Cache::forget('active_categories');
        Cache::forget('navbar_categories');
        Cache::forget('menu_categories');
        Cache::forget('header_categories');
    }

    public function created(Category $category): void
    {
        $this->invalidateAllProductsCache();
    }

    public function updated(Category $category): void
    {
        $this->invalidateAllProductsCache();
    }

    public function deleted(Category $category): void
    {
        $this->invalidateAllProductsCache();
    }

    public function restored(Category $category): void
    {
        $this->invalidateAllProductsCache();
    }

    public function forceDeleted(Category $category): void
    {
        $this->invalidateAllProductsCache();
    }
}
