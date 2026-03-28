<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use App\Models\Product;
use App\Models\customerCustomization;
use App\Models\Coupon;
use App\Models\Promotion;
use App\Traits\ImageUploadTrait;
use Illuminate\Support\Facades\DB;

//working version of cart controller
// class CartController extends Controller
// {
//     /* =========================
//         ADD TO CART
//     ========================= */
//     public function addToCart(Request $request)
//     {
//         // dd($request->all());
//         $request->validate([
//             'product_id' => 'required|integer|exists:products,id',
//             'qty' => 'required|integer|min:1',
//             'size_id' => 'nullable|integer|exists:sizes,id',
//             'color_id' => 'nullable|integer|exists:colors,id',
//             'customization_id' => 'nullable|integer|exists:customer_customizations,id',
//         ]);

//         $product = Product::with(['sizes', 'colors'])->findOrFail($request->product_id);

//         if ($product->qty < $request->qty) {
//             return back()->withErrors(['qty' => 'Requested quantity not available']);
//         }

//         /* Variant */
//         $sizePrice = $sizeName = 0;
//         $colorPrice = $colorName = 0;

//         if ($request->size_id) {
//             $size = $product->sizes->firstWhere('id', $request->size_id);
//             $sizePrice = $size->pivot->size_price ?? 0;
//             $sizeName = $size->size_name ?? null;
//         }

//         if ($request->color_id) {
//             $color = $product->colors->firstWhere('id', $request->color_id);
//             $colorPrice = $color->pivot->color_price ?? 0;
//             $colorName = $color->color_name ?? null;
//         }

//         $variantTotal = $sizePrice + $colorPrice;
//         $basePrice = $product->offer_price ?? $product->price;

//         /* Auth / Session */
//         $userId = auth()->id();
//         $sessionId = session()->getId();

//         /* Customization */
//         $extraPrice = 0;
//         $frontImage = $backImage = null;

//         if ($request->customization_id) {
//             $cust = customerCustomization::find($request->customization_id);
//             $extraPrice = $cust->price ?? 0;
//             $frontImage = $cust->front_image ?? null;
//             $backImage = $cust->back_image ?? null;
//         }

//         /* Existing cart item */
//         $cartItem = Cart::where('product_id', $product->id)
//             ->when($userId, fn($q) => $q->where('user_id', $userId))
//             ->when(!$userId, fn($q) => $q->where('session_id', $sessionId))
//             ->whereJsonContains('options->size_id', $request->size_id)
//             ->whereJsonContains('options->color_id', $request->color_id)
//             ->whereJsonContains('options->customization_id', $request->customization_id)
//             ->first();

//         if ($cartItem) {
//             $cartItem->increment('quantity', $request->qty);
//         } else {
//             Cart::create([
//                 'user_id' => $userId,
//                 'session_id' => $userId ? null : $sessionId,
//                 'product_id' => $product->id,
//                 'quantity' => $request->qty,
//                 'price' => $basePrice,
//                 'options' => [
//                     'image' => $product->thumb_image,
//                     'size_id' => $request->size_id,
//                     'size_name' => $sizeName,
//                     'size_price' => $sizePrice,
//                     'color_id' => $request->color_id,
//                     'color_name' => $colorName,
//                     'color_price' => $colorPrice,
//                     'variant_total' => $variantTotal,
//                     'customization_id' => $request->customization_id,
//                     'extra_price' => $extraPrice,
//                     'front_image' => $frontImage,
//                     'back_image' => $backImage,
//                 ],
//             ]);
//         }

//         return back()->with('success', 'Product added to cart');
//     }

//     /* =========================
//         CART PAGE
//     ========================= */
//     public function index()
//     {
//         $cartItems = $this->currentCart();

//         $cartItems->each(function ($item) {
//             $opt = $item->options;
//             $item->total =
//                 ($item->price
//                     + ($opt['variant_total'] ?? 0)
//                     + ($opt['extra_price'] ?? 0))
//                 * $item->quantity;
//         });

//         return Inertia::render('CartPage', [
//             'cart_items' => $cartItems->values(),
//             'total' => number_format($cartItems->sum('total'), 2),
//         ]);
//     }

//     /* =========================
//         UPDATE QTY
//     ========================= */
//     public function updateCart(Request $request)
//     {
//         $request->validate([
//             'cart_id' => 'required|integer',
//             'quantity' => 'required|integer|min:1',
//         ]);

//         $cart = Cart::findOrFail($request->cart_id);
//         $cart->update(['quantity' => $request->quantity]);

//         return back();
//     }

//     /* =========================
//         REMOVE ITEM
//     ========================= */
//     public function removeCart($id)
//     {
//         Cart::where('id', $id)
//             ->when(
//                 auth()->check(),
//                 fn($q) => $q->where('user_id', auth()->id()),
//                 fn($q) => $q->where('session_id', session()->getId())
//             )->delete();

//         return back();
//     }

//     /* =========================
//         CLEAR CART
//     ========================= */
//     public function clearCart()
//     {
//         Cart::where(
//             fn($q) =>
//             auth()->check()
//                 ? $q->where('user_id', auth()->id())
//                 : $q->where('session_id', session()->getId())
//         )->delete();

//         return back();
//     }

//     /* =========================
//         HELPERS
//     ========================= */
//     private function currentCart()
//     {
//         return Cart::with('product')
//             ->where(
//                 fn($q) =>
//                 auth()->check()
//                     ? $q->where('user_id', auth()->id())
//                     : $q->where('session_id', session()->getId())
//             )->get();
//     }
// }

//new cart controller check if this working 

// class CartController extends Controller
// {
//     /* =========================
//         ADD TO CART
//     ========================= */
//     public function addToCart(Request $request)
//     {
//         $request->validate([
//             'product_id' => 'required|integer|exists:products,id',
//             'qty' => 'required|integer|min:1',
//             'size_id' => 'nullable|integer',
//             'color_id' => 'nullable|integer',
//             'customization_id' => 'nullable|integer|exists:customer_customizations,id',
//         ]);

//         $product = Product::with(['sizes', 'colors'])->findOrFail($request->product_id);

//         if ($product->qty < $request->qty) {
//             return back()->withErrors(['qty' => 'Requested quantity not available']);
//         }

//         /* Variant */
//         $sizePrice = $sizeName = 0;
//         $colorPrice = $colorName = 0;

//         if ($request->size_id) {
//             $size = $product->sizes->firstWhere('id', $request->size_id);
//             $sizePrice = $size->pivot->size_price ?? 0;
//             $sizeName = $size->size_name ?? null;
//         }

//         if ($request->color_id) {
//             $color = $product->colors->firstWhere('id', $request->color_id);
//             $colorPrice = $color->pivot->color_price ?? 0;
//             $colorName = $color->color_name ?? null;
//         }

//         $variantTotal = $sizePrice + $colorPrice;
//         $basePrice = $product->offer_price ?? $product->price;

//         /* Auth / Session */
//         $userId = auth()->id();
//         $sessionId = session()->getId();

//         /* Merge guest cart if login */
//         if ($userId) {
//             Cart::where('session_id', $sessionId)
//                 ->whereNull('user_id')
//                 ->update(['user_id' => $userId, 'session_id' => null]);
//         }

//         /* Customization */
//         $extraPrice = 0;
//         $frontImage = $backImage = null;

//         if ($request->customization_id) {
//             $cust = CustomerCustomization::find($request->customization_id);
//             if ($cust) {
//                 $extraPrice = $cust->price ?? 0;
//                 $frontImage = $cust->front_image ?? null;
//                 $backImage = $cust->back_image ?? null;
//             }
//         }

//         /* Check existing cart item */
//         $cartItem = Cart::where('product_id', $product->id)
//             ->when($userId, fn($q) => $q->where('user_id', $userId))
//             ->when(!$userId, fn($q) => $q->where('session_id', $sessionId))
//             ->whereJsonContains('options->size_id', $request->size_id)
//             ->whereJsonContains('options->color_id', $request->color_id)
//             ->whereJsonContains('options->customization_id', $request->customization_id)
//             ->first();

//         if ($cartItem) {
//             $cartItem->increment('quantity', $request->qty);
//         } else {
//             Cart::create([
//                 'user_id' => $userId,
//                 'session_id' => $userId ? null : $sessionId,
//                 'product_id' => $product->id,
//                 'quantity' => $request->qty,
//                 'price' => $basePrice,
//                 'options' => [
//                     'image' => $product->thumb_image,
//                     'size_id' => $request->size_id,
//                     'size_name' => $sizeName,
//                     'size_price' => $sizePrice,
//                     'color_id' => $request->color_id,
//                     'color_name' => $colorName,
//                     'color_price' => $colorPrice,
//                     'variant_total' => $variantTotal,
//                     'customization_id' => $request->customization_id,
//                     'extra_price' => $extraPrice,
//                     'front_image' => $frontImage,
//                     'back_image' => $backImage,
//                     'is_free_product' => false,
//                 ],
//             ]);
//         }

//         return back()->with('success', 'Product added to cart successfully!');
//     }

//     /* =========================
//         CART PAGE
//     ========================= */
//     public function index()
//     {
//         $cartItems = $this->currentCart();

//         $cartItems->each(function ($item) {
//             $opt = $item->options;

//             $item->customization = null;
//             if (!empty($opt['customization_id'])) {
//                 $cust = CustomerCustomization::find($opt['customization_id']);
//                 if ($cust) {
//                     $item->customization = [
//                         'id' => $cust->id,
//                         'front_image' => $cust->front_image,
//                         'back_image' => $cust->back_image,
//                         'price' => $cust->price,
//                     ];
//                 }
//             }

//             $item->total =
//                 ($item->price
//                     + ($opt['variant_total'] ?? 0)
//                     + ($opt['extra_price'] ?? 0))
//                 * $item->quantity;
//         });

//         // Apply promotions / free products
//         $this->applyPromotions($cartItems);

//         return Inertia::render('CartPage', [
//             'cart_items' => $cartItems->values(),
//             'total' => number_format($cartItems->sum('total'), 2),
//         ]);
//     }

//     /* =========================
//         UPDATE QTY
//     ========================= */
//     public function updateCart(Request $request)
//     {
//         $request->validate([
//             'cart_id' => 'required|integer',
//             'quantity' => 'required|integer|min:1',
//         ]);

//         $cart = Cart::findOrFail($request->cart_id);
//         $cart->update(['quantity' => $request->quantity]);

//         return back()->with('success', 'Cart updated successfully!');
//     }

//     /* =========================
//         REMOVE ITEM
//     ========================= */
//     public function removeCart($id)
//     {
//         $userId = auth()->id();
//         $sessionId = session()->getId();

//         Cart::where('id', $id)
//             ->when($userId, fn($q) => $q->where('user_id', $userId))
//             ->when(!$userId, fn($q) => $q->where('session_id', $sessionId))
//             ->delete();

//         return back()->with('success', 'Cart item removed!');
//     }

//     /* =========================
//         CLEAR CART
//     ========================= */
//     public function clearCart()
//     {
//         $userId = auth()->id();
//         $sessionId = session()->getId();

//         Cart::when($userId, fn($q) => $q->where('user_id', $userId))
//             ->when(!$userId, fn($q) => $q->where('session_id', $sessionId))
//             ->delete();

//         return back()->with('success', 'Cart cleared successfully!');
//     }

//     /* =========================
//         HELPERS
//     ========================= */
//     private function currentCart()
//     {
//         $userId = auth()->id();
//         $sessionId = session()->getId();

//         return Cart::with('product')
//             ->when($userId, fn($q) => $q->where('user_id', $userId))
//             ->when(!$userId, fn($q) => $q->where('session_id', $sessionId))
//             ->get();
//     }

//     /* =========================
//         PROMOTION / FREE PRODUCT
//     ========================= */
//     private function applyPromotions($cartItems)
//     {
//         $userId = auth()->id();
//         $sessionId = session()->getId();

//         $promotions = Promotion::where('status', 1)->get();

//         foreach ($promotions as $promo) {
//             $qty = $promo->product_id
//                 ? $cartItems->where('product_id', $promo->product_id)->sum('quantity')
//                 : ($promo->category_id
//                     ? $cartItems->filter(fn($i) => $i->product->category_id == $promo->category_id)->sum('quantity')
//                     : $cartItems->sum('quantity'));

//             if ($qty >= $promo->buy_quantity) {
//                 if ($promo->type === 'free_product' && $promo->product_id) {
//                     $existing = $cartItems->where('product_id', $promo->product_id)
//                         ->where(fn($i) => ($i->options['is_free_product'] ?? false))
//                         ->first();

//                     if (!$existing) {
//                         $freeProduct = Product::find($promo->product_id);
//                         if ($freeProduct) {
//                             Cart::create([
//                                 'user_id' => $userId,
//                                 'session_id' => $userId ? null : $sessionId,
//                                 'product_id' => $freeProduct->id,
//                                 'quantity' => $promo->get_quantity ?? 1,
//                                 'price' => 0,
//                                 'options' => [
//                                     'image' => $freeProduct->thumb_image,
//                                     'variant_total' => 0,
//                                     'extra_price' => 0,
//                                     'is_free_product' => true,
//                                 ],
//                             ]);
//                         }
//                     }
//                 }
//             }
//         }
//     }
// }

//update new cart controller

class CartController extends Controller
{
    use ImageUploadTrait;
    /* =========================
        ADD TO CART
    ========================= */
    public function addToCart(Request $request)
    {
        // dd($request->all());
        $request->validate([
            'product_id' => 'required|integer|exists:products,id',
            'qty' => 'required|integer|min:1',
            'size_id' => 'nullable|integer|exists:sizes,id',
            'color_id' => 'nullable|integer|exists:colors,id',
            'customization_id' => 'nullable|integer|exists:customer_customizations,id',
        ]);

        $product = Product::with(['sizes', 'colors'])->findOrFail($request->product_id);

        if ($product->qty < $request->qty) {
            return back()->withErrors(['qty' => 'Requested quantity not available']);
        }

        /* Variant calculation */
        [$sizePrice, $sizeName] = [0, null];
        [$colorPrice, $colorName] = [0, null];

        if ($request->size_id) {
            $size = $product->sizes->firstWhere('id', $request->size_id);
            $sizePrice = $size->pivot->size_price ?? 0;
            $sizeName = $size->size_name ?? null;
        }

        if ($request->color_id) {
            $color = $product->colors->firstWhere('id', $request->color_id);
            $colorPrice = $color->pivot->color_price ?? 0;
            $colorName = $color->color_name ?? null;
        }

        $variantTotal = $sizePrice + $colorPrice;
        $basePrice = $product->offer_price ?? $product->price;

        /* Auth / Session */
        $userId = auth('customer')->id();
        $sessionId = session()->getId();
        // dd('user_id',$userId, 'session_id'.$sessionId);
        /* Customization */
        $extraPrice = 0;
        $frontImage = $backImage = null;
        if ($request->customization_id) {
            $cust = CustomerCustomization::find($request->customization_id);
            $extraPrice = $cust->price ?? 0;
            $frontImage = $cust->front_image ?? null;
            $backImage = $cust->back_image ?? null;
        }

        /* Existing cart item */
        $cartItem = Cart::where('product_id', $product->id)
            ->when($userId, fn($q) => $q->where('user_id', $userId))
            ->when(!$userId, fn($q) => $q->where('session_id', $sessionId))
            ->whereJsonContains('options->size_id', $request->size_id)
            ->whereJsonContains('options->color_id', $request->color_id)
            ->whereJsonContains('options->customization_id', $request->customization_id)
            ->first();

        if ($cartItem) {
            $cartItem->increment('quantity', $request->qty);
        } else {
            $cartItem = Cart::create([
                'user_id' => $userId,
                'session_id' => $userId ? null : $sessionId,
                'product_id' => $product->id,
                'quantity' => $request->qty,
                'price' => $basePrice,
                'options' => [
                    'image' => $product->thumb_image,
                    'size_id' => $request->size_id,
                    'size_name' => $sizeName,
                    'size_price' => $sizePrice,
                    'color_id' => $request->color_id,
                    'color_name' => $colorName,
                    'color_price' => $colorPrice,
                    'variant_total' => $variantTotal,
                    'customization_id' => $request->customization_id,
                    'extra_price' => $extraPrice,
                    'front_image' => $frontImage,
                    'back_image' => $backImage,
                    'is_free_product' => false,
                ],
            ]);
        }

        // Apply promotions / free products after add
        $this->applyPromotions();

        // return redirect()->route('cart.index')->with('success', 'Product added to cart');
        return back()->with('success', 'Product added to cart successfully!');
    }

    /* =========================
        CART PAGE
    ========================= */
    // public function index()
    // {
    //     $cartItems = $this->currentCart();

    //     $cartItems->each(function ($item) {
    //         $opt = $item->options;
    //         $item->total = ($item->price + ($opt['variant_total'] ?? 0) + ($opt['extra_price'] ?? 0)) * $item->quantity;
    //         $item->customization = (!empty($opt['front_image']) || !empty($opt['back_image'])) ? ['front_image' => $opt['front_image'], 'back_image' => $opt['back_image']] : null;
    //     });

    //     $total = $cartItems->sum('total');
    //     $promotions = $this->getPromotions($cartItems);

    //     return Inertia::render('CartPage', [
    //         'cart_items' => $cartItems->values(),
    //         'total' => number_format($total, 2),
    //         'promotions' => $promotions,
    //     ]);
    // }
    public function index()
    {
        $cartItems = $this->currentCart();
        // dd($cartItems);
        $cartItems->each(function ($item) {
            $opt = $item->options;

            // Calculate total
            $item->total = ($item->price + ($opt['variant_total'] ?? 0) + ($opt['extra_price'] ?? 0)) * $item->quantity;

            // Customization info with price
            $item->customization = (!empty($opt['front_image']) || !empty($opt['back_image']))
                ? [
                    'front_image' => $opt['front_image'] ?? null,
                    'back_image' => $opt['back_image'] ?? null,
                    'price' => $opt['extra_price'] ?? 0, // add the customization price here
                ]
                : null;

            // Optionally, include the customization_id if needed
            $item->customization_id = $opt['customization_id'] ?? null;
        });

        $total = $cartItems->sum('total');
        $promotions = $this->getPromotions($cartItems);

        // return Inertia::render('CartPage', [
        //     'initialCartItems' => $cartItems->values(),
        //     'initialTotal' => number_format($total, 2),
        //     'promotions' => $promotions,
        // ]);
        return Inertia::render('CartPage', [
            'cart_items' => $cartItems->values(),
            'total' => number_format($total, 2),
            'promotions' => $promotions,
        ]);
    }


    /* =========================
        UPDATE QTY
    ========================= */
    // public function updateCart(Request $request)
    // {
    //     $request->validate([
    //         'cart_id' => 'required|integer',
    //         'quantity' => 'required|integer|min:1',
    //     ]);

    //     $cartItem = Cart::findOrFail($request->cart_id);
    //     $cartItem->update(['quantity' => $request->quantity]);

    //     return back();
    // }
    public function updateCart(Request $request)
    {
        $request->validate([
            'cart_id' => 'required|integer',
            'quantity' => 'required|integer|min:1',
        ]);

        $cart = Cart::with('product')->findOrFail($request->cart_id);

        // Stock check
        if ($cart->product && $cart->product->qty < $request->quantity) {
            return back()->withErrors([
                'quantity' => 'Not enough stock available!',
            ]);
        }

        $cart->update([
            'quantity' => $request->quantity,
        ]);

        return back();
    }





    /* =========================
        REMOVE ITEM
    ========================= */
    // public function removeCart($id)
    // {
    //     $userId = auth()->id();
    //     $sessionId = session()->getId();

    //     $cartItem = Cart::where('id', $id)
    //         ->when($userId, fn($q) => $q->where('user_id', $userId))
    //         ->when(!$userId, fn($q) => $q->where('session_id', $sessionId))
    //         ->firstOrFail();

    //     $cartItem->delete();

    //     return back();
    // }


    // public function removeCart($id)
    // {
    //     $userId = auth()->id();
    //     $sessionId = session()->getId();

    //     $cart = Cart::where('id', $id)
    //         ->where(function ($q) use ($userId, $sessionId) {
    //             $q->when($userId, fn($qq) => $qq->where('user_id', $userId))
    //                 ->when(!$userId, fn($qq) => $qq->where('session_id', $sessionId));
    //         })
    //         ->firstOrFail();

    //     /* ===============================
    //    DELETE RELATED CUSTOMIZATION
    // ================================ */
    //     if ($cart->customization_id) {
    //         customerCustomization::where('id', $cart->customization_id)->delete();
    //     } else {
    //         // fallback (old data safety)
    //         customerCustomization::where('product_id', $cart->product_id)
    //             ->when($userId, fn($q) => $q->where('user_id', $userId))
    //             ->when(!$userId, fn($q) => $q->where('session_id', $sessionId))
    //             ->delete();
    //     }


    //     /* ===============================
    //    DELETE CART ITEM
    // ================================ */
    //     $cart->delete();

    //     return back();
    // }
    // public function removeCart($id)
    // {
    //     $userId = auth('customer')->id();
    //     $sessionId = session()->getId();

    //     $cart = Cart::where('id', $id)
    //         ->where(function ($q) use ($userId, $sessionId) {
    //             $q->when($userId, fn($qq) => $qq->where('user_id', $userId))
    //                 ->when(!$userId, fn($qq) => $qq->where('session_id', $sessionId));
    //         })
    //         ->firstOrFail();

    //     /* ============================
    //        FIND CUSTOMIZATION
    //     ============================ */
    //     $customization = customerCustomization::where('product_id', $cart->product_id)
    //         ->when($userId, fn($q) => $q->where('user_id', $userId))
    //         ->when(!$userId, fn($q) => $q->where('session_id', $sessionId))
    //         ->first();

    //     if ($customization) {

    //         if ($customization->front_image) {
    //             $this->delete_image($customization->front_image);
    //         }

    //         if ($customization->back_image) {
    //             $this->delete_image($customization->back_image);
    //         }

    //         $customization->delete();
    //     }

    //     $cart->delete();

    //     return back();
    // }

    public function removeCart($id)
    {
        $userId = auth('customer')->id();
        $sessionId = session()->getId();

        $cart = Cart::where('id', $id)
            ->where(function ($q) use ($userId, $sessionId) {
                $q->when($userId, fn($qq) => $qq->where('user_id', $userId))
                    ->when(!$userId, fn($qq) => $qq->where('session_id', $sessionId));
            })
            ->firstOrFail();

        /* ============================
       FIND CUSTOMIZATION
    ============================ */
        $customization = customerCustomization::where('product_id', $cart->product_id)
            ->when($userId, fn($q) => $q->where('user_id', $userId))
            ->when(!$userId, fn($q) => $q->where('session_id', $sessionId))
            ->first();

        if ($customization) {
            if ($customization->front_image) {
                $this->delete_image($customization->front_image);
            }

            if ($customization->back_image) {
                $this->delete_image($customization->back_image);
            }

            $customization->delete();
        }

        $cart->delete();

        // AJAX বা Inertia request 
        if (request()->wantsJson() || request()->ajax() || request()->header('X-Requested-With') || request()->header('X-Inertia')) {
            return response()->json([
                'success' => true,
                'message' => 'Cart item removed'
            ]);
        }
        return back()->with('success', 'Cart item removed!');
    }




    /* =========================
        CLEAR CART
    ========================= */
    // public function clearCart()
    // {
    //     $userId = auth()->id();
    //     $sessionId = session()->getId();

    //     Cart::where(fn($q) => $userId ? $q->where('user_id', $userId) : $q->where('session_id', $sessionId))->delete();

    //     return back();
    // }
    public function clearCart()
    {
        $userId = auth('customer')->id();
        $sessionId = session()->getId();

        $cartItems = Cart::where(function ($q) use ($userId, $sessionId) {
            $q->when($userId, fn($qq) => $qq->where('user_id', $userId))
                ->when(!$userId, fn($qq) => $qq->where('session_id', $sessionId));
        })->get();

        foreach ($cartItems as $item) {
            if ($item->customization_id) {
                customerCustomization::where('id', $item->customization_id)->delete();
            }
        }

        Cart::where(function ($q) use ($userId, $sessionId) {
            $q->when($userId, fn($qq) => $qq->where('user_id', $userId))
                ->when(!$userId, fn($qq) => $qq->where('session_id', $sessionId));
        })->delete();

        return back();
    }


    /* =========================
        HELPERS
    ========================= */
    private function currentCart()
    {
        $userId = auth('customer')->id();
        $sessionId = session()->getId();
        // $sessionId =11;

        return Cart::with('product')
            ->where(fn($q) => $userId ? $q->where('user_id', $userId) : $q->where('session_id', $sessionId))
            ->get();
    }

    /* =========================
        PROMOTIONS / FREE PRODUCTS
    ========================= */
    private function applyPromotions()
    {
        $userId = auth('customer')->id();
        $sessionId = session()->getId();
        $cartItems = $this->currentCart();

        $promotions = Promotion::where('status', 1)->get();

        foreach ($promotions as $promo) {
            $qty = $promo->product_id
                ? $cartItems->where('product_id', $promo->product_id)->sum('quantity')
                : ($promo->category_id
                    ? $cartItems->filter(fn($i) => $i->product->category_id == $promo->category_id)->sum('quantity')
                    : $cartItems->sum('quantity'));

            if ($qty >= $promo->buy_quantity && $promo->type === 'free_product' && $promo->product_id) {
                $existing = $cartItems->where('product_id', $promo->product_id)->where(fn($i) => ($i->options['is_free_product'] ?? false))->first();
                if (!$existing) {
                    $freeProduct = Product::find($promo->product_id);
                    if ($freeProduct) {
                        Cart::create([
                            'user_id' => $userId,
                            'session_id' => $userId ? null : $sessionId,
                            'product_id' => $freeProduct->id,
                            'quantity' => $promo->get_quantity ?? 1,
                            'price' => 0,
                            'options' => [
                                'image' => $freeProduct->thumb_image,
                                'variant_total' => 0,
                                'extra_price' => 0,
                                'is_free_product' => true,
                            ],
                        ]);
                    }
                }
            }
        }
    }

    private function getPromotions($cartItems)
    {
        $promotions = Promotion::where('status', 1)->get();
        $applied = [];

        foreach ($promotions as $promo) {
            $qty = $promo->product_id
                ? $cartItems->where('product_id', $promo->product_id)->sum('quantity')
                : ($promo->category_id
                    ? $cartItems->filter(fn($i) => $i->product->category_id == $promo->category_id)->sum('quantity')
                    : $cartItems->sum('quantity'));

            if ($qty >= $promo->buy_quantity) {
                $applied[] = [
                    'promotion_id' => $promo->id,
                    'type' => $promo->type,
                    'message' => $promo->type === 'free_shipping' ? 'Free Shipping!' : 'Free Product Unlocked!',
                    'free_product_id' => $promo->type === 'free_product' ? $promo->product_id : null,
                    'free_quantity' => $promo->get_quantity ?? 1,
                ];
            }
        }

        return $applied;
    }

    // public function sync(Request $request)
    // {
    //     $request->validate([
    //         'items' => 'required|array',
    //         'items.*.id' => 'required|integer|exists:carts,id',
    //         'items.*.quantity' => 'required|integer|min:1',
    //     ]);

    //     $userId = auth()->id();
    //     $sessionId = session()->getId();

    //     DB::transaction(function () use ($request, $userId, $sessionId) {
    //         foreach ($request->items as $item) {
    //             Cart::where('id', $item['id'])
    //                 ->where(function ($q) use ($userId, $sessionId) {
    //                     $q->when($userId, fn($qq) => $qq->where('user_id', $userId))
    //                         ->when(!$userId, fn($qq) => $qq->where('session_id', $sessionId));
    //                 })
    //                 ->update(['quantity' => $item['quantity']]);
    //         }
    //     });

    //     return response()->json(['success' => true]);
    // }
    public function sync(Request $request)
    {
        // শুধু 'items' অ্যারে চেক করো, খালি হলেও অ্যালাউ করো
        $request->validate([
            'items' => 'present|array', // এটাই যথেষ্ট
        ]);

        $userId = auth('customer')->id();
        $sessionId = session()->getId();

        DB::transaction(function () use ($request, $userId, $sessionId) {
            // যদি items খালি হয় তাহলে সব কার্ট আইটেম ডিলিট করো (অপশনাল, কিন্তু ভালো)
            if (empty($request->items)) {
                Cart::where(function ($q) use ($userId, $sessionId) {
                    $q->when($userId, fn($qq) => $qq->where('user_id', $userId))
                        ->when(!$userId, fn($qq) => $qq->where('session_id', $sessionId));
                })->delete();

                return; // ট্রানজেকশন শেষ
            }

            // আইটেম আপডেট করা
            foreach ($request->items as $item) {
                Cart::where('id', $item['id'])
                    ->where(function ($q) use ($userId, $sessionId) {
                        $q->when($userId, fn($qq) => $qq->where('user_id', $userId))
                            ->when(!$userId, fn($qq) => $qq->where('session_id', $sessionId));
                    })
                    ->update(['quantity' => $item['quantity']]);
            }

            // অবশিষ্ট আইটেম ডিলিট করা (যেগুলো sync-এ পাঠানো হয়নি)
            $syncedIds = collect($request->items)->pluck('id')->toArray();
            Cart::whereNotIn('id', $syncedIds)
                ->where(function ($q) use ($userId, $sessionId) {
                    $q->when($userId, fn($qq) => $qq->where('user_id', $userId))
                        ->when(!$userId, fn($qq) => $qq->where('session_id', $sessionId));
                })
                ->delete();
        });

        return response()->json(['success' => true]);
    }
}
