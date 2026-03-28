<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\Slider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use App\Support\CacheKeys;




// class HomeController extends Controller
// {
//     public function index()
//     {
//         $sliders = Cache::remember('sliders', 3600, function () {
//             return Slider::active()
//                 ->orderBy('serial', 'asc')
//                 ->select('id', 'banner', 'title', 'btn_url', 'type')
//                 ->get(['id', 'banner', 'title', 'btn_url', 'type']);
//         });
//         $slider = Slider::all();
//         $categories = $this->categories();

//         // dd($categories);
//         $homeProducts = $this->homeProducts();

//         $typeBaseProducts = $this->getTypeBaseProduct();
//         return Inertia::render('Home',  [
//             'categories' => $categories,
//             'sliders' => $sliders,
//             'homeProducts' => $homeProducts,
//             'typeBaseProducts' => $typeBaseProducts,
//         ]);
//     }

//     private function categories()
//     {
//         $categories = Category::active()->FrontShow()
//             ->select('id', 'name', 'image', 'slug')
//             ->with([
//                 'subCategories:id,category_id,name,slug',
//                 'subCategories.childCategories:id,sub_category_id,name,slug'
//             ])
//             ->get();

//         return $categories;
//     }

//     private function homeProducts()
//     {
//         return Category::where(['front_show' => 1, 'status' => 1])
//             ->select('id', 'name', 'slug', 'icon', 'image')
//             ->orderBy('id', 'asc')
//             ->with(['products' => function ($q) {
//                 $q->active()
//                     ->select(
//                         'id',
//                         'name',
//                         'slug',
//                         'category_id',
//                         'price',
//                         'offer_price',
//                         'img_alt_text',
//                         'qty',
//                         'thumb_image'
//                     )
//                     ->with([
//                         'productImageGalleries:id,product_id,image',
//                         'colors:id,color_name,color_code,price,is_default',
//                         'sizes:id,size_name,price,is_default'
//                     ])
//                     ->withCount('reviews')
//                     ->withAvg('reviews', 'rating')
//                     ->orderByDesc('id')
//                     ->limit(12);
//             }])
//             ->get();
//     }
//     private function getTypeBaseProduct()
//     {
//         $types = ['new_arrival', 'featured_product', 'top_product', 'best_product'];
//         $result = [];

//         foreach ($types as $type) {
//             $result[$type] = Product::active()
//                 ->where('product_type', $type)
//                 ->where('is_approved', 1)
//                 ->select(
//                     'id',
//                     'name',
//                     'slug',
//                     'category_id',
//                     'price',
//                     'offer_price',
//                     'img_alt_text',
//                     'qty',
//                     'thumb_image'
//                 )
//                 ->with([
//                     'category:id,name,slug',
//                     'colors:id,color_name,color_code,price,is_default',
//                     'sizes:id,size_name,price,is_default',
//                     'productImageGalleries:id,product_id,image'
//                 ])
//                 ->withCount('reviews')
//                 ->withAvg('reviews', 'rating')
//                 ->orderByDesc('id')
//                 ->limit(12)
//                 ->get();
//         }

//         return $result;
//     }
// }


//optimized code with reduced queries using caching
// class HomeController extends Controller
// {
//     public function index()
//     {
//         // 🔹 Home page data cache
//         $homePageData = Cache::remember('home_page_data', 3600, function () {
//             return [
//                 'sliders' => Slider::active()
//                     ->orderBy('serial', 'asc')
//                     ->select('id', 'banner', 'title', 'btn_url', 'type')
//                     ->get(),

//                 'categories' => $this->categories(),

//                 'homeProducts' => $this->homeProducts(),

//                 'typeBaseProducts' => $this->getTypeBaseProduct(),
//             ];
//         });

//         return Inertia::render('Home', $homePageData);
//     }

//     private function categories()
//     {
//         return Category::active()
//             ->select('id', 'name', 'slug', 'image')
//             ->with([
//                 'subCategories' => function ($query) {
//                     $query->where('status', 1)
//                         ->select('id', 'category_id', 'name', 'slug');
//                 },
//                 'subCategories.childCategories' => function ($query) {
//                     $query->where('status', 1)
//                         ->select('id', 'sub_category_id', 'name', 'slug');
//                 }
//             ])
//             ->get();
//     }

//     private function homeProducts()
//     {
//         return Category::where(['front_show' => 1, 'status' => 1])
//             ->select('id', 'name', 'slug', 'icon', 'image')
//             ->orderBy('id', 'asc')
//             ->with(['products' => function ($q) {
//                 $q->active()
//                     ->select('id', 'name', 'slug', 'category_id', 'thumb_image', 'price', 'offer_price', 'qty')
//                     ->withCount(['colors', 'sizes'])
//                     ->orderByDesc('id')
//                     ->limit(12)
//                     ->get()
//                     ->map(function ($product) {
//                         $product->is_in_stock = $product->qty > 0;
//                         return $product;
//                     });
//             }])
//             ->get();
//     }

//     private function getTypeBaseProduct()
//     {
//         $types = ['new_arrival', 'featured_product', 'top_product', 'best_product'];
//         $result = [];

//         foreach ($types as $type) {
//             $result[$type] = Product::active()
//                 ->where('product_type', $type)
//                 ->where('is_approved', 1)
//                 ->select('id', 'name', 'slug', 'category_id', 'thumb_image', 'price', 'offer_price', 'qty')
//                 ->withCount(['colors', 'sizes'])
//                 ->orderByDesc('id')
//                 ->limit(12)
//                 ->get()
//                 ->map(function ($product) {
//                     $product->is_in_stock = $product->qty > 0;
//                     return $product;
//                 });
//         }

//         return $result;
//     }
// }

//optimized code with reduced queries using caching observed
class HomeController extends Controller
{
    public function index()
    {
        $homePageData = Cache::remember(CacheKeys::HOME_PAGE, 3600, function () {
            return [
                'sliders' => Slider::active()
                    ->orderBy('serial', 'asc')
                    ->select('id', 'banner', 'title', 'btn_url', 'type')
                    ->get(),

                'categories' => $this->categories(),

                'homeProducts' => $this->homeProducts(),

                'typeBaseProducts' => $this->getTypeBaseProduct(),
            ];
        });

        return Inertia::render('Home', $homePageData);
    }

    private function categories()
    {
        return Category::active()
            ->select('id', 'name', 'slug', 'image')
            ->with([
                'subCategories:id,category_id,name,slug',
                'subCategories.childCategories:id,sub_category_id,name,slug'
            ])
            ->get();
    }

    private function homeProducts()
    {
        return Category::where(['front_show' => 1, 'status' => 1])
            ->select('id', 'name', 'slug', 'icon', 'image')
            ->orderBy('id', 'asc')
            ->with(['products' => function ($q) {
                $q->active()
                    ->select(
                        'id',
                        'name',
                        'slug',
                        'category_id',
                        'thumb_image',
                        'price',
                        'offer_price',
                        'qty'
                    )
                    ->withCount(['colors', 'sizes'])
                    ->orderByDesc('id')
                    ->limit(12);
            }])
            ->get();
    }

    private function getTypeBaseProduct()
    {
        $types = ['new_arrival', 'featured_product', 'top_product', 'best_product'];
        $result = [];

        foreach ($types as $type) {
            $result[$type] = Product::active()
                ->where('product_type', $type)
                ->where('is_approved', 1)
                ->select(
                    'id',
                    'name',
                    'slug',
                    'category_id',
                    'thumb_image',
                    'price',
                    'offer_price',
                    'qty'
                )
                ->withCount(['colors', 'sizes'])
                ->orderByDesc('id')
                ->limit(12)
                ->get();
        }

        return $result;
    }

    public function notFound()
    {
        return Inertia::render('NotFound')
            ->toResponse(request())
            ->setStatusCode(404);
    }
}
