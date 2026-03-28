<?php

namespace App\Http\Middleware;

use App\Models\Category;
use App\Models\FooterInfo;
use App\Models\FooterSocial;
use App\Models\GeneralSetting;
use App\Models\LogoSetting;
use App\Services\CartService;
use App\Support\CacheKeys;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    // without optimization
    // public function share(Request $request): array
    // {
    //     $cartService = new CartService();
    //     return [
    //         ...parent::share($request),
    //         'auth' => [
    //             'user' => Auth::guard('customer')->user(),
    //         ],
    //         'logos' => [
    //             'logo'    => LogoSetting::value('logo'),
    //             'favicon' => LogoSetting::value('favicon'),
    //         ],
    //         // 'cart' => $cartService->getCartSummary(),
    //         'cart' => $cartService->getNavbarCartInfo(),
    //         // 'footerInfo' => [
    //         //     'footerInfo' => FooterInfo::select('logo', 'phone', 'email', 'address', 'copyright')->first(),
    //         // ],
    //         'footerInfo' => FooterInfo::select('logo', 'phone', 'email', 'address', 'copyright')
    //             ->first()?->makeHidden([])->toArray() ?? [
    //                 'logo'       => null,
    //                 'phone'      => '',
    //                 'email'      => '',
    //                 'address'    => '',
    //                 'copyright'  => '',
    //             ],
    //         'footer_social' => FooterSocial::where('status', 1)->select('icon', 'icon_extra', 'name', 'url', 'serial_no')
    //             ->get()
    //             ->map(function ($item) {
    //                 return $item->only(['icon', 'icon_extra', 'name', 'url', 'serial_no']);
    //             }),
    //     ];
    // }

    // with optimization

    // public function share(Request $request): array
    // {
    //     /** @var CartService $cartService */
    //     $cartService = app(CartService::class);

    //     // 🔹 Shared data cache
    //     $sharedData = Cache::remember('inertia_shared_data', 3600, function () use ($cartService) {
    //         $generalSetting = GeneralSetting::select(
    //             'site_name',
    //             'contact_email',
    //             'contact_phone',
    //             'contact_address',
    //             'currency_name',
    //             'currency_icon',
    //             'time_zone',
    //             'map'
    //         )->first()?->toArray() ?? [
    //             'site_name'      => config('app.name'),
    //             'contact_email'  => '',
    //             'contact_phone'  => '',
    //             'contact_address' => '',
    //             'currency_name'  => 'DDK',
    //             'currency_icon'  => 'DDK',
    //             'time_zone'      => 'UTC',
    //             'map'            => '',
    //         ];
    //         return [
    //             'auth' => [
    //                 'user' => Auth::guard('customer')->user(),
    //             ],
    //              'settings' => $generalSetting,

    //             'categoriess' => Category::active()
    //                 ->select('id', 'name', 'slug')
    //                 ->get()->toArray() ?? [],

    //             'logos' => [
    //                 'logo'    => LogoSetting::value('logo'),
    //                 'favicon' => LogoSetting::value('favicon'),
    //             ],

    //             'cart' => $cartService->getNavbarCartInfo(),

    //             'footerInfo' => FooterInfo::select('logo', 'phone', 'email', 'address', 'copyright')
    //                 ->first()?->makeHidden([])->toArray() ?? [
    //                     'logo'      => null,
    //                     'phone'     => '',
    //                     'email'     => '',
    //                     'address'   => '',
    //                     'copyright' => '',
    //                 ],

    //             'footer_social' => FooterSocial::where('status', 1)
    //                 ->select('icon', 'icon_extra', 'name', 'url', 'serial_no')
    //                 ->get()
    //                 ->map(function ($item) {
    //                     return $item->only(['icon', 'icon_extra', 'name', 'url', 'serial_no']);
    //                 }),

    //         ];
    //     });

    //     return array_merge(parent::share($request), $sharedData);
    // }

    // public function share(Request $request): array
    // {
    //     /** @var CartService $cartService */
    //     $cartService = app(CartService::class);

    //     // 🔹 Shared data cache for 1 hour
    //     $sharedData = Cache::remember(CacheKeys::INERTIA_SHARED, 3600, function () use ($cartService) {

    //         // General settings (only necessary fields)
    //         $generalSetting = GeneralSetting::select(
    //             'site_name',
    //             'contact_email',
    //             'contact_phone',
    //             'contact_address',
    //             'currency_name',
    //             'currency_icon',
    //             'time_zone',
    //             'map'
    //         )->first()?->toArray() ?? [
    //             'site_name'       => config('app.name'),
    //             'contact_email'   => '',
    //             'contact_phone'   => '',
    //             'contact_address' => '',
    //             'currency_name'   => 'USD',
    //             'currency_icon'   => '$',
    //             'time_zone'       => 'UTC',
    //             'map'             => '',
    //         ];

    //         // Categories
    //         $categoriess = Category::active()
    //             ->select('id', 'name', 'slug')
    //             ->get()
    //             ->toArray();

    //         // Logos
    //         $logos = [
    //             'logo'    => LogoSetting::value('logo') ?? null,
    //             'favicon' => LogoSetting::value('favicon') ?? null,
    //         ];

    //         // Navbar Cart
    //         $cart = $cartService->getNavbarCartInfo() ?? [];

    //         // Footer info
    //         $footerInfo = FooterInfo::select('logo', 'phone', 'email', 'address', 'copyright')
    //             ->first()?->makeHidden([])->toArray() ?? [
    //                 'logo'      => null,
    //                 'phone'     => '',
    //                 'email'     => '',
    //                 'address'   => '',
    //                 'copyright' => '',
    //             ];

    //         // Footer Social
    //         $footerSocial = FooterSocial::where('status', 1)
    //             ->select('icon', 'icon_extra', 'name', 'url', 'serial_no')
    //             ->get()?->map(function ($item) {
    //                 return $item->only(['icon', 'icon_extra', 'name', 'url', 'serial_no']);
    //             })->values()->toArray() ?? [];

    //         return [
    //             'auth' => [
    //                 'user' => Auth::guard('customer')->user(),
    //             ],
    //             'settings'       => $generalSetting,
    //             'categoriess'     => $categoriess,
    //             'logos'          => $logos,
    //             'cart'           => $cart,
    //             'footerInfo'     => $footerInfo,
    //             'footer_social'  => $footerSocial,
    //         ];
    //     });

    //     return array_merge(parent::share($request), $sharedData);
    // }

    public function share(Request $request): array
    {
        /** @var CartService $cartService */
        $cartService = app(CartService::class);
    //     $categories = Cache::remember('navbar_categories', 3600, function () {
    //     return Category::active()
    //         ->select('id', 'name', 'slug')
    //         ->get()
    //         ->toArray();
    // });
    $categories = Cache::remember('navbar_categories', 3600, fn() => Category::active()->get(['id', 'name', 'slug']));

        // 🔹 Shared data cache (rarely changing items)
        $cachedData = Cache::remember(CacheKeys::INERTIA_SHARED, 3600, function () {
            // General settings
            $generalSetting = GeneralSetting::select(
                'site_name',
                'contact_email',
                'contact_phone',
                'contact_address',
                'currency_name',
                'currency_icon',
                'time_zone',
                'map'
            )->first();
            // Categories
            // $categories = Category::active()
            //     ->select('id', 'name', 'slug')
            //     ->get()
            //     ->toArray();

            // Logos
            $logos = [
                'logo'    => LogoSetting::value('logo') ?? null,
                'favicon' => LogoSetting::value('favicon') ?? null,
            ];

            // Footer info
            $footerInfo = FooterInfo::select('logo', 'phone', 'email', 'address', 'copyright')
                ->first()?->makeHidden([])->toArray() ?? [
                    'logo' => null,
                    'phone' => '',
                    'email' => '',
                    'address' => '',
                    'copyright' => '',
                ];

            // Footer Social
            $footerSocial = FooterSocial::where('status', 1)
                ->select('icon', 'icon_extra', 'name', 'url', 'serial_no')
                ->get()
                ->map(fn($item) => $item->only(['icon', 'icon_extra', 'name', 'url', 'serial_no']))
                ->values()
                ->toArray();

            return [
                'settings'      => $generalSetting,
                // 'categoriess'   => $categories,
                'logos'         => $logos,
                'footerInfo'    => $footerInfo,
                'footer_social' => $footerSocial,
            ];
        });

        // 🔹 Cart data (never cache)
        $cart = $cartService->getNavbarCartInfo() ?? [];

        return array_merge(parent::share($request), $cachedData, [
            'auth' => [
                'user' => Auth::guard('customer')->user(),
            ],
            'cart' => $cart,
            'categoriess'   => $categories,
        ]);
    }
}
