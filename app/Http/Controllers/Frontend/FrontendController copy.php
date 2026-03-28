<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Color;
use App\Models\Product;
use App\Models\ProductReview;
use App\Models\Size;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

// class FrontendController extends Controller
// {
//     //
// }

class FrontendController extends Controller
{
    // Filter Logic
    private function applyFilters($query, Request $request)
    {
        if ($request->filled('category_ids') && !$request->filled('subcategory_ids') && !$request->filled('childcategory_ids')) {
            $query->whereIn('category_id', (array) $request->category_ids);
        }

        if ($request->filled('subcategory_ids') && !$request->filled('childcategory_ids')) {
            $query->whereIn('sub_category_id', (array) $request->subcategory_ids);
        }

        if ($request->filled('childcategory_ids')) {
            $query->whereIn('child_category_id', (array) $request->childcategory_ids);
        }

        if ($request->filled('q')) {
            $keyword = $request->q;
            $query->where(fn($q) => $q->where('name', 'like', "%{$keyword}%")
                ->orWhere('slug', 'like', "%{$keyword}%"));
        }

        if ($request->filled('brand_ids')) {
            $query->whereIn('brand_id', (array)$request->brand_ids);
        }

        if ($request->filled('color_ids')) {
            $colorIds = (array)$request->color_ids;
            $query->whereHas('productImageGalleries', fn($q) => $q->whereIn('color_id', $colorIds)->whereNotNull('image'));
        }

        if ($request->filled('size_ids')) {
            $query->whereHas('sizes', fn($q) => $q->whereIn('sizes.id', (array)$request->size_ids));
        }

        // if ($request->filled('min_price') && $request->filled('max_price')) {
        //     $query->whereBetween('price', [$request->min_price, $request->max_price]);
        // }
        if ($request->filled('min_price') || $request->filled('max_price')) {
            $minPrice = $request->filled('min_price') ? (int)$request->min_price : 0;
            $maxPrice = $request->filled('max_price') ? (int)$request->max_price : 9999999;

            $query->whereBetween('price', [$minPrice, $maxPrice]);
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

    // Helper to generate cache key
    private function cacheKey(string $prefix, Request $request)
    {
        $page = $request->get('page', 1);
        return "{$prefix}_page_{$page}_" . md5(json_encode($request->all()));
    }

    // Clear cache before fetching
    private function clearCache(string $prefix, Request $request)
    {
        $key = $this->cacheKey($prefix, $request);
        Cache::forget($key);
    }

    // All Products (Shop Page)
    // public function allProducts(Request $request)
    // {
    //     $this->clearCache('all_products', $request);

    //     $cacheKey = $this->cacheKey('all_products', $request);

    //     $products = Cache::remember($cacheKey, 1800, function () use ($request) {
    //         $query = Product::active();
    //         $query = $this->applyFilters($query, $request);

    //         if (!$request->has('sort_by')) $query->orderBy('id', 'desc');

    //         return $query->with([
    //             'category:id,name,slug',
    //             'colors:id,color_name,color_code,price,is_default',
    //             'sizes:id,size_name,price,is_default',
    //             'customization',
    //             'productImageGalleries:id,image,product_id,color_id',
    //             'productImageGalleries.color:id,color_name,color_code'
    //         ])
    //             ->withCount('reviews')
    //             ->withAvg('reviews', 'rating')
    //             ->paginate(24)
    //             ->withQueryString();
    //     });

    //     return Inertia::render('Shop', [
    //         'products' => $products,
    //         'filters' => $request->all()
    //     ]);
    // }
    public function allProducts(Request $request)
    {
        $this->clearCache('all_products', $request);

        $cacheKey = $this->cacheKey('all_products', $request);

        $products = Cache::remember($cacheKey, 1800, function () use ($request) {
            $query = Product::active();
            $query = $this->applyFilters($query, $request);

            if (!$request->has('sort_by')) $query->orderBy('id', 'desc');

            return $query->with([
                'category:id,name,slug',
                'colors:id,color_name,color_code,price,is_default',
                'sizes:id,size_name,price,is_default',
                'customization',
                'productImageGalleries:id,image,product_id,color_id',
                'productImageGalleries.color:id,color_name,color_code'
            ])
                ->withCount(['reviews', 'colors', 'sizes'])
                ->withAvg('reviews', 'rating')
                ->paginate(24)
                ->withQueryString();
        });

        return Inertia::render('Shop', [
            'products'   => $products,
            'filters'    => $request->all(),
            'categories' => Category::active()->get(['id', 'name', 'slug']),
            'brands'     => Brand::all(['id', 'name']),
            'colors'     => Color::all(['id', 'color_name', 'color_code']),
            'sizes'      => Size::all(['id', 'size_name']),
        ]);
    }

    // Category Products
    public function categoryProducts($slug, Request $request)
    {
        $category = Category::active()->where('slug', $slug)->firstOrFail();

        $this->clearCache("category_{$category->id}", $request);

        $cacheKey = $this->cacheKey("category_{$category->id}", $request);

        $products = Cache::remember($cacheKey, 1800, function () use ($request, $category) {
            $query = Product::active()->where('category_id', $category->id);
            $query = $this->applyFilters($query, $request);

            return $query->with([
                'category:id,name,slug',
                'colors:id,color_name,color_code,price,is_default',
                'sizes:id,size_name,price,is_default',
                'customization',
                'productImageGalleries:id,image,product_id,color_id'
            ])
                ->withCount('reviews')
                ->withAvg('reviews', 'rating')
                ->paginate(24)
                ->withQueryString();
        });

        return Inertia::render('Frontend/Shop/CategoryProducts', [
            'category' => $category,
            'products' => $products,
            'filters' => $request->all()
        ]);
    }

    // Subcategory Products
    public function subcategoryProducts($slug, Request $request)
    {
        return $this->categoryProducts($slug, $request);
    }

    // Childcategory Products
    public function childcategoryProducts($slug, Request $request)
    {
        return $this->categoryProducts($slug, $request);
    }

    // Product Details
    public function productDetails(string $slug)
    {
        $cacheKey = "product_details_" . $slug;
        Cache::forget($cacheKey); // Clear product detail cache

        $product = Cache::remember($cacheKey, 1800, function () use ($slug) {
            return Product::with([
                'category:id,name,slug,image,icon',
                'productImageGalleries:id,image,product_id,color_id',
                'productImageGalleries.color:id,color_name,color_code',
                'customization',
                'colors:id,color_name,color_code,price,is_default',
                'sizes:id,size_name,price,is_default',
                'brand:id,name,slug,logo'
            ])->where('slug', $slug)->active()->firstOrFail();
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

        return Inertia::render('ProductDetails', [
            'product' => $product,
            'reviews' => $reviews
        ]);
    }

    // Product Search
    public function productSearch(Request $request)
    {
        $this->clearCache('search_products', $request);

        $cacheKey = $this->cacheKey('search_products', $request);

        $products = Cache::remember($cacheKey, 1800, function () use ($request) {
            $query = Product::active();
            $query = $this->applyFilters($query, $request);

            return $query->with([
                'category:id,name,slug',
                'colors:id,color_name,color_code,price,is_default',
                'sizes:id,size_name,price,is_default',
                'customization',
                'productImageGalleries:id,image,product_id,color_id'
            ])
                ->withCount('reviews')
                ->withAvg('reviews', 'rating')
                ->paginate(24)
                ->withQueryString();
        });

        return Inertia::render('Frontend/Shop/SearchResults', [
            'products' => $products,
            'filters' => $request->all(),
            'query' => $request->q ?? null
        ]);
    }
}
