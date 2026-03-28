<?php

namespace App\Observers;

use App\Models\Product;
use Illuminate\Support\Facades\Cache;
use App\Support\CacheKeys;

// class ProductObserver
// {
//     /**
//      * Handle the Product "created" event.
//      */
//     private function clearProductCaches(): void
//     {
//         Cache::forget(CacheKeys::ALL_PRODUCTS);
//         Cache::forget(CacheKeys::HOME_PAGE);
//         // Cache::forget('all_products');
//     }
//     public function created(Product $product): void
//     {
//         $this->clearProductCaches();
//         Cache::forget(CacheKeys::HOME_PAGE);
//         Cache::forget(CacheKeys::ALL_PRODUCTS);
//     }
//     // public function created(Product $product)
//     // {
//     //     Cache::forget(CacheKeys::HOME_PAGE);
//     //     Cache::forget(CacheKeys::ALL_PRODUCTS);
//     // }

//     /**
//      * Handle the Product "updated" event.
//      */
//     public function updated(Product $product): void
//     {
//         $this->clearProductCaches();
//         Cache::forget(CacheKeys::HOME_PAGE);
//         Cache::forget(CacheKeys::ALL_PRODUCTS);
//     }

//     /**
//      * Handle the Product "deleted" event.
//      */
//     public function deleted(Product $product): void
//     {
//         $this->clearProductCaches();
//         Cache::forget(CacheKeys::HOME_PAGE);
//         Cache::forget(CacheKeys::ALL_PRODUCTS);
//     }

//     /**
//      * Handle the Product "restored" event.
//      */
//     public function restored(Product $product): void
//     {
//         $this->clearProductCaches();
//         Cache::forget(CacheKeys::HOME_PAGE);
//         Cache::forget(CacheKeys::ALL_PRODUCTS);
//     }

//     /**
//      * Handle the Product "force deleted" event.
//      */
//     public function forceDeleted(Product $product): void
//     {
//         $this->clearProductCaches();
//         Cache::forget(CacheKeys::HOME_PAGE);
//         Cache::forget(CacheKeys::ALL_PRODUCTS);
//     }
// }
class ProductObserver
{
    private function invalidateAllProductsCache(): void
    {
        // Version বাড়িয়ে দিলে সব পুরানো cache invalid হয়ে যাবে
        $current = Cache::get(CacheKeys::ALL_PRODUCTS_TAG, 1);
        Cache::put(CacheKeys::ALL_PRODUCTS_TAG, $current + 1);

        // Extra safety
        Cache::forget(CacheKeys::HOME_PAGE);
    }

    public function created(Product $product): void
    {
        $this->invalidateAllProductsCache();
    }

    public function updated(Product $product): void
    {
        $this->invalidateAllProductsCache();
    }

    public function deleted(Product $product): void
    {
        $this->invalidateAllProductsCache();
    }

    public function restored(Product $product): void
    {
        $this->invalidateAllProductsCache();
    }

    public function forceDeleted(Product $product): void
    {
        $this->invalidateAllProductsCache();
    }
}
