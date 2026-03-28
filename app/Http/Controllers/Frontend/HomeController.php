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
        return Category::active()->frontshow()
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
                    ->withCount([
                        'colors' => fn($q) => $q->active(),
                        'sizes' => fn($q) => $q->active(),
                    ])

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
                ->whereHas('category', function ($q) {
                    $q->where('status', 1);
                })
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
                ->withCount([
                    'colors' => fn($q) => $q->active(),
                    'sizes' => fn($q) => $q->active(),
                ])

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
