<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Color;
use App\Models\Product;
use App\Models\ProductReview;
use App\Models\Size;
use App\Support\CacheKeys;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

// class FrontendController extends Controller
// {
//     //
// }

// class FrontendController extends Controller
// {
//     // Filter Logic
//     private function applyFilters($query, Request $request)
//     {
//         if ($request->filled('category_ids') && !$request->filled('subcategory_ids') && !$request->filled('childcategory_ids')) {
//             $query->whereIn('category_id', (array) $request->category_ids);
//         }

//         if ($request->filled('subcategory_ids') && !$request->filled('childcategory_ids')) {
//             $query->whereIn('sub_category_id', (array) $request->subcategory_ids);
//         }

//         if ($request->filled('childcategory_ids')) {
//             $query->whereIn('child_category_id', (array) $request->childcategory_ids);
//         }

//         if ($request->filled('q')) {
//             $keyword = $request->q;
//             $query->where(fn($q) => $q->where('name', 'like', "%{$keyword}%")
//                 ->orWhere('slug', 'like', "%{$keyword}%"));
//         }

//         if ($request->filled('brand_ids')) {
//             $query->whereIn('brand_id', (array)$request->brand_ids);
//         }

//         if ($request->filled('color_ids')) {
//             $colorIds = (array)$request->color_ids;
//             $query->whereHas('productImageGalleries', fn($q) => $q->whereIn('color_id', $colorIds)->whereNotNull('image'));
//         }

//         if ($request->filled('size_ids')) {
//             $query->whereHas('sizes', fn($q) => $q->whereIn('sizes.id', (array)$request->size_ids));
//         }

//         // if ($request->filled('min_price') && $request->filled('max_price')) {
//         //     $query->whereBetween('price', [$request->min_price, $request->max_price]);
//         // }
//         if ($request->filled('min_price') || $request->filled('max_price')) {
//             $minPrice = $request->filled('min_price') ? (int)$request->min_price : 0;
//             $maxPrice = $request->filled('max_price') ? (int)$request->max_price : 9999999;

//             $query->whereBetween('price', [$minPrice, $maxPrice]);
//         }

//         if ($request->filled('min_stock') || $request->filled('max_stock')) {
//             $min = $request->min_stock ?? 0;
//             $max = $request->max_stock ?? 999999;
//             $query->whereBetween('stock', [$min, $max]);
//         }

//         if ($request->has('sort_by')) {
//             switch ($request->sort_by) {
//                 case 'lowtohigh':
//                     $query->orderBy('price', 'asc');
//                     break;
//                 case 'hightolow':
//                     $query->orderBy('price', 'desc');
//                     break;
//                 case 'latest':
//                     $query->orderBy('created_at', 'desc');
//                     break;
//                 case 'oldest':
//                     $query->orderBy('created_at', 'asc');
//                     break;
//                 case 'featureproduct':
//                     $query->where('product_type', 'featured_product')->orderBy('created_at', 'desc');
//                     break;
//                 case 'recommended':
//                     $query->withAvg('reviews', 'rating')->orderByDesc('reviews_avg_rating');
//                     break;
//                 default:
//                     $query->orderBy('name', 'asc');
//             }
//         }

//         return $query;
//     }

//     // Helper to generate cache key
//     private function cacheKey(string $prefix, Request $request)
//     {
//         $page = $request->get('page', 1);
//         return "{$prefix}_page_{$page}_" . md5(json_encode($request->all()));
//     }

//     // Clear cache before fetching
//     private function clearCache(string $prefix, Request $request)
//     {
//         $key = $this->cacheKey($prefix, $request);
//         Cache::forget($key);
//     }


//     public function allProducts(Request $request)
//     {
//         $this->clearCache('all_products', $request);

//         $cacheKey = $this->cacheKey('all_products', $request);

//         $products = Cache::remember($cacheKey, 1800, function () use ($request) {
//             $query = Product::active();
//             $query = $this->applyFilters($query, $request);

//             if (!$request->has('sort_by')) $query->orderBy('id', 'desc');

//             return $query->with([
//                 'category:id,name,slug',
//                 'colors:id,color_name,color_code,price,is_default',
//                 'sizes:id,size_name,price,is_default',
//                 'customization',
//                 'productImageGalleries:id,image,product_id,color_id',
//                 'productImageGalleries.color:id,color_name,color_code'
//             ])
//                 ->withCount(['reviews', 'colors', 'sizes'])
//                 ->withAvg('reviews', 'rating')
//                 ->paginate(24)
//                 ->withQueryString();
//         });

//         return Inertia::render('Shop', [
//             'products'   => $products,
//             'filters'    => $request->all(),
//             'categories' => Category::active()->get(['id', 'name', 'slug']),
//             'brands'     => Brand::all(['id', 'name']),
//             'colors'     => Color::all(['id', 'color_name', 'color_code']),
//             'sizes'      => Size::all(['id', 'size_name']),
//         ]);
//     }


//     // Product Details
//     public function productDetails(string $slug)
//     {
//         $cacheKey = "product_details_" . $slug;
//         Cache::forget($cacheKey); // Clear product detail cache

//         $product = Cache::remember($cacheKey, 1800, function () use ($slug) {
//             return Product::with([
//                 'category:id,name,slug,image,icon',
//                 'productImageGalleries:id,image,product_id,color_id',
//                 'productImageGalleries.color:id,color_name,color_code',
//                 'customization',
//                 'colors:id,color_name,color_code,price,is_default',
//                 'sizes:id,size_name,price,is_default',
//                 'brand:id,name,slug,logo'
//             ])->where('slug', $slug)->active()->firstOrFail();
//         });

//         $reviews = ProductReview::with(['user:id,name,email,image'])
//             ->where('product_id', $product->id)
//             ->where('status', 1)
//             ->get()
//             ->map(fn($review) => [
//                 'id' => $review->id,
//                 'rating' => $review->rating,
//                 'comment' => $review->review,
//                 'created_at' => $review->created_at,
//                 'user' => [
//                     'id' => $review->user->id ?? null,
//                     'name' => $review->user->name ?? 'Anonymous',
//                     'image' => $review->user->image ?? null
//                 ]
//             ]);

//         return Inertia::render('ProductDetails', [
//             'product' => $product,
//             'reviews' => $reviews
//         ]);
//     }

//     // Product Search
//     public function productSearch(Request $request)
//     {
//         $this->clearCache('search_products', $request);

//         $cacheKey = $this->cacheKey('search_products', $request);

//         $products = Cache::remember($cacheKey, 1800, function () use ($request) {
//             $query = Product::active();
//             $query = $this->applyFilters($query, $request);

//             return $query->with([
//                 'category:id,name,slug',
//                 'colors:id,color_name,color_code,price,is_default',
//                 'sizes:id,size_name,price,is_default',
//                 'customization',
//                 'productImageGalleries:id,image,product_id,color_id'
//             ])
//                 ->withCount('reviews')
//                 ->withAvg('reviews', 'rating')
//                 ->paginate(24)
//                 ->withQueryString();
//         });

//         return Inertia::render('Frontend/Shop/SearchResults', [
//             'products' => $products,
//             'filters' => $request->all(),
//             'query' => $request->q ?? null
//         ]);
//     }
// }

class FrontendController extends Controller
{
    private function applyFilters($query, Request $request)
    {
        if ($request->filled('category_ids')) $query->whereIn('category_id', $request->category_ids);
        if ($request->filled('subcategory_ids')) $query->whereIn('sub_category_id', $request->subcategory_ids);
        if ($request->filled('childcategory_ids')) $query->whereIn('child_category_id', $request->childcategory_ids);

        if ($request->filled('q')) $query->where(fn($q) => $q->where('name', 'like', "%{$request->q}%")->orWhere('slug', 'like', "%{$request->q}%"));
        if ($request->filled('brand_ids')) $query->whereIn('brand_id', $request->brand_ids);
        if ($request->filled('color_ids')) $query->whereHas('colors', fn($q) => $q->active()->whereIn('colors.id', $request->color_ids));
        if ($request->filled('size_ids')) $query->whereHas('sizes', fn($q) => $q->active()->whereIn('sizes.id', $request->size_ids));

        if ($request->filled('min_price') || $request->filled('max_price')) {
            $min = $request->min_price ?? 0;
            $max = $request->max_price ?? 9999999;
            $query->whereBetween('price', [$min, $max]);
        }
        if ($request->filled('min_stock') || $request->filled('max_stock')) {
            $min = $request->min_stock ?? 0;
            $max = $request->max_stock ?? 999999;
            $query->whereBetween('stock', [$min, $max]);
        }

        if ($request->has('sort_by')) {
            switch ($request->sort_by) {
                case 'lowtohigh':
                    $query->orderBy('price', 'asc');
                    break;
                case 'hightolow':
                    $query->orderBy('price', 'desc');
                    break;
                case 'latest':
                    $query->orderBy('created_at', 'desc');
                    break;
                case 'oldest':
                    $query->orderBy('created_at', 'asc');
                    break;
                case 'featureproduct':
                    $query->where('product_type', 'featured_product')->orderBy('created_at', 'desc');
                    break;
                case 'recommended':
                    $query->withAvg('reviews', 'rating')->orderByDesc('reviews_avg_rating');
                    break;
                default:
                    $query->orderBy('name', 'asc');
            }
        }

        return $query;
    }

    private function cacheKey(string $prefix, Request $request)
    {
        $page = $request->get('page', 1);
        return "{$prefix}_page_{$page}_" . md5(json_encode($request->all()));
    }

    private function clearCache(string $prefix, Request $request)
    {
        Cache::forget($this->cacheKey($prefix, $request));
    }

    // public function allProducts(Request $request)
    // {
    //     // $this->clearCache(CacheKeys::ALL_PRODUCTS, $request);
    //     $cacheKey = $this->cacheKey(CacheKeys::ALL_PRODUCTS, $request);

    //     $products = Cache::remember($cacheKey, 1800, function () use ($request) {

    //         $query = Product::active()
    //             ->select([
    //                 'id',
    //                 'name',
    //                 'slug',
    //                 'price',
    //                 'qty',
    //                 'offer_price',
    //                 'thumb_image',

    //             ])
    //             ->whereHas('category', function ($q) {
    //                 $q->where('status', 1);
    //             })
    //             ->withCount([
    //                 'colors',
    //                 'sizes',
    //             ]); // counts here

    //         $query = $this->applyFilters($query, $request);

    //         if (!$request->has('sort_by')) $query->orderBy('id', 'desc');

    //         return $query->paginate(24)->withQueryString();
    //     });

    //     // Cache the static filter data
    //     $categories = Cache::remember('categories', 3600, fn() => Category::active()->get(['id', 'name', 'slug']));
    //     $brands = Cache::remember('active_brands', 3600, fn() => Brand::where('status', 1)->get(['id', 'name']));
    //     $colors = Cache::remember('active_colors', 3600, fn() => Color::where('status', 1)->get(['id', 'color_name', 'color_code']));
    //     $sizes = Cache::remember('active_sizes', 3600, fn() => Size::where('status', 1)->get(['id', 'size_name']));

    //     return Inertia::render('Shop', [
    //         'products' => $products,
    //         'filters' => $request->all(),
    //         'categories' => $categories,
    //         'brands' => $brands,
    //         'colors' => $colors,
    //         'sizes' => $sizes,
    //     ]);
    // }
    public function allProducts(Request $request)
    {
        // Global version পাই যাতে category/product change এ সব cache invalidate হয়
        $cacheVersion = Cache::get(CacheKeys::ALL_PRODUCTS_TAG, 1);

        $cacheKey = $this->cacheKey(CacheKeys::ALL_PRODUCTS . "_v{$cacheVersion}", $request);

        $products = Cache::remember($cacheKey, 1800, function () use ($request) {
            $query = Product::active()
                ->select([
                    'id',
                    'name',
                    'slug',
                    'price',
                    'qty',
                    'offer_price',
                    'thumb_image',
                ])
                ->whereHas('category', function ($q) {
                    $q->where('status', 1);
                })
                ->withCount([
                    'colors' => fn($q) => $q->active(),
                    'sizes' => fn($q) => $q->active(),
                ]);

            $query = $this->applyFilters($query, $request);

            if (!$request->has('sort_by')) {
                $query->orderBy('id', 'desc');
            }

            return $query->paginate(24)->withQueryString();
        });

        // Static filters – এগুলো আলাদা cache এ রাখো
        $categories = Cache::remember('categories', 3600, fn() => Category::active()->get(['id', 'name', 'slug']));
        $brands = Cache::remember('active_brands', 3600, fn() => Brand::where('status', 1)->get(['id', 'name']));
        $colors = Cache::remember('active_colors', 3600, fn() => Color::where('status', 1)->get(['id', 'color_name', 'color_code']));
        $sizes = Cache::remember('active_sizes', 3600, fn() => Size::where('status', 1)->get(['id', 'size_name']));

        return Inertia::render('Shop', [
            'products' => $products,
            'filters' => $request->all(),
            'categories' => $categories,
            'brands' => $brands,
            'colors' => $colors,
            'sizes' => $sizes,
        ]);
    }


    public function productDetails(string $slug)
    {
        $cacheKey = CacheKeys::PRODUCT_DETAILS . $slug;
        // Cache::forget($cacheKey);
        $product = Cache::remember($cacheKey, 1800, function () use ($slug) {

            return Product::query()
                ->select([
                    'id',
                    'name',
                    'slug',
                    'price',
                    'offer_price',
                    'short_description',
                    'qty',
                    'category_id',
                    'thumb_image',
                    'long_description',
                ])
                ->active()
                ->where('slug', $slug)
                ->whereHas('category', function ($q) {
                    $q->where('status', 1);
                })

                /*RELATIONS (OPTIMIZED) */

                ->with([
                    // Category (ONLY name)
                    'category:id,name',

                    // Product Images + Color
                    'productImageGalleries:id,image,product_id,color_id',
                    'productImageGalleries.color:id,color_name,color_code',

                    // Sizes (ONLY name, no pivot)
                    'sizes' => fn($q) => $q->active()->select('sizes.id', 'size_name'),
                    // 'colors:id,color_name,color_code',

                    // Customization (ONLY is_customizable)
                    'customization:id,product_id,is_customizable',
                ])

                /* review */
                // ->withCount('reviews')
                ->withAvg('reviews', 'rating')

                ->firstOrFail();
        });
        $reviews = ProductReview::with(['user:id,name,email,image'])
            ->where('product_id', $product->id)
            ->where('status', 1)
            ->get()
            ->map(fn($review) => [
                'id' => $review->id,
                'rating' => $review->rating,
                'comment' => $review->review,
                'created_at' => $review->created_at,
                'user' => [
                    'id' => $review->user->id ?? null,
                    'name' => $review->user->name ?? 'Anonymous',
                    'image' => $review->user->image ?? null
                ]
            ]);

        return Inertia::render('ProductDetails', ['product' => $product, 'reviews' => $reviews]);
    }

    public function productSearch(Request $request)
    {
        // $this->clearCache('search_products', $request);
        $cacheKey = $this->cacheKey('search_products', $request);

        $products = Cache::remember($cacheKey, 1800, function () use ($request) {
            $query = Product::active();
            $query = $this->applyFilters($query, $request);

            return $query->with([
                'category:id,name,slug',
                'colors' => fn($q) => $q->active()->select('id', 'color_name', 'color_code'),
                'sizes' => fn($q) => $q->active()->select('id', 'size_name'),
                'customization',
                'productImageGalleries:id,image,product_id,color_id',
            ])->withCount([
                'reviews',
                'colors' => fn($q) => $q->active(),
                'sizes' => fn($q) => $q->active()
            ])->withAvg('reviews', 'rating')->paginate(24)->withQueryString();
        });

        return Inertia::render('Frontend/Shop/SearchResults', [
            'products' => $products,
            'filters' => $request->all(),
            'query' => $request->q ?? null
        ]);
    }
}
