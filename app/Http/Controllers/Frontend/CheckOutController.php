<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CustomerAddress;
use App\Models\PickupShippingMethod;
use App\Models\Promotion;
use App\Models\ShippingRule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CheckOutController extends Controller
{
    // public function index()
    // {
    //     $user = Auth::guard('customer')->user();

    //     if (!$user) {
    //         return redirect()->route('customer.login')->with('error', 'Please login to checkout.');
    //     }

    //     $shippingMethods = ShippingRule::where('status', 1)
    //         ->select('id', 'name', 'type', 'cost')
    //         ->get();

    //     $pickupMethods = PickupShippingMethod::where('status', 1)->get();

    //     $countryList = config('settings.country_list', []);

    //     $customerAddresses = CustomerAddress::where('customer_id', $user->id)->get();

    //     return Inertia::render('CheckoutPage', [
    //         'shipping_methods' => $shippingMethods,
    //         'pickup_methods'   => $pickupMethods,
    //         'countries'        => $countryList,
    //         'customer_addresses' => $customerAddresses,
    //     ]);
    // }


    private function currentCart()
    {
        $userId = auth('customer')->id();
        $sessionId = session()->getId();

        return Cart::with('product')
            ->where(function ($query) use ($userId, $sessionId) {
                if ($userId) {
                    $query->where('user_id', $userId);
                } else {
                    $query->where('session_id', $sessionId);
                }
            })
            ->get();
    }

    private function checkAppliedPromotions()
    {
        $cartItems = $this->currentCart();
        $promotions = Promotion::where('status', 1)->get();
        $applied = [];

        foreach ($promotions as $promo) {
            $qualifiedQty = 0;

            if ($promo->product_id && !$promo->category_id) {
                $qualifiedQty = $cartItems
                    ->filter(
                        fn($i) =>
                        $i->product_id == $promo->product_id &&
                            !($i->options['is_free_product'] ?? false)
                    )
                    ->sum('quantity');
            } elseif ($promo->category_id) {
                $qualifiedQty = $cartItems
                    ->filter(
                        fn($i) =>
                        $i->product->category_id == $promo->category_id &&
                            !($i->options['is_free_product'] ?? false)
                    )
                    ->sum('quantity');
            } else {
                $qualifiedQty = $cartItems
                    ->filter(fn($i) => !($i->options['is_free_product'] ?? false))
                    ->sum('quantity');
            }

            if ($qualifiedQty >= $promo->buy_quantity) {
                $applied[] = [
                    'promotion_id' => $promo->id,
                    'type' => $promo->type,
                    'message' => $promo->type === 'free_shipping',
                ];
            }
        }

        return $applied;
    }

    public function index()
    {
        $user = Auth::guard('customer')->user();

        if (!$user) {
            return redirect()->route('customer.login')->with('error', 'Please login to checkout.');
        }

        $shippingMethods = ShippingRule::where('status', 1)
            ->select('id', 'name', 'type', 'cost')
            ->get();

        $pickupMethods = PickupShippingMethod::where('status', 1)->get();

        $countryList = config('settings.country_list', []);

        $customerAddresses = CustomerAddress::where('customer_id', $user->id)->get();

        $appliedPromotions = $this->checkAppliedPromotions();

        $hasFreeShipping = collect($appliedPromotions)->contains('type', 'free_shipping');

        return Inertia::render('CheckoutPage', [
            'shipping_methods'       => $shippingMethods,
            'pickup_methods'         => $pickupMethods,
            'countries'              => $countryList,
            'customer_addresses'     => $customerAddresses,
            'has_free_shipping'      => $hasFreeShipping,
            'free_shipping_message'  => $hasFreeShipping ? 'Free Shipping Unlocked!' : null,
            'applied_promotions'     => $appliedPromotions,
        ]);
    }

    public function success()
    {
        return Inertia::render('OrderSuccessPage');
    }
}
