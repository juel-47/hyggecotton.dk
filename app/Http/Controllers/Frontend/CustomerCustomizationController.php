<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\customerCustomization;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

// class CustomerCustomizationController extends Controller
// {
//     //
// }

class CustomerCustomizationController extends Controller
{
    public function customizeProduct($productId)
    {
        $product = Product::with('customization')->find($productId);

        if (!$product) {
            return redirect()->back()->with('error', 'Product not found.');
        }

        $frontImage = $product->customization->front_image ?? null;
        $backImage = $product->customization->back_image ?? null;
        $frontPrice = $product->customization->front_price ?? 0;
        $backPrice = $product->customization->back_price ?? 0;
        $bothPrice = $product->customization->both_price ?? 0;

        return Inertia::render('CustomizeProduct', [
            'product' => $product,
            'frontImage' => $frontImage,
            'backImage' => $backImage,
        ]);
    }
    // public function storeOrUpdate(Request $request)
    // {
    //     dd($request->all());
    //     $userId = auth('sanctum')->id();
    //     $sessionId = $request->cookie('cart_session');

    //     $cookie = null;
    //     if (!$userId && !$sessionId) {
    //         $sessionId = 'cart_' . Str::random(10);
    //         $cookie = cookie('cart_session', $sessionId, 60 * 24 * 30, '/', null, false, false, false, 'lax');
    //     }

    //     $request->validate([
    //         'product_id' => 'required|integer',
    //     ]);

    //     $extraPrice = 0;
    //     $customData = collect($request->except([
    //         'front_image',
    //         'back_image',
    //         'front_price',
    //         'back_price',
    //         'both_price',
    //         'product_id',
    //         'side'
    //     ]))->toArray();

    //     $uploadDir = public_path('uploads/customizations');
    //     if (!file_exists($uploadDir)) mkdir($uploadDir, 0755, true);

    //     $frontImagePath = null;
    //     $backImagePath = null;

    //     $customization = CustomerCustomization::where('product_id', $request->product_id)
    //         ->when($userId, fn($q) => $q->where('user_id', $userId))
    //         ->when(!$userId, fn($q) => $q->where('session_id', $sessionId))
    //         ->first();

    //     // Front image handle
    //     if ($request->filled('front_image')) {
    //         $frontData = $request->front_image;
    //         if (preg_match('/^data:image\/(\w+);base64,/', $frontData, $type)) {
    //             $frontData = substr($frontData, strpos($frontData, ',') + 1);
    //             $frontData = base64_decode($frontData);
    //             $frontImagePath = 'uploads/customizations/front_' . time() . '.' . $type[1];

    //             if ($customization && $customization->front_image && file_exists(public_path($customization->front_image))) {
    //                 @unlink(public_path($customization->front_image));
    //             }

    //             file_put_contents(public_path($frontImagePath), $frontData);
    //         }
    //     }

    //     // Back image handle
    //     if ($request->filled('back_image')) {
    //         $backData = $request->back_image;
    //         if (preg_match('/^data:image\/(\w+);base64,/', $backData, $type)) {
    //             $backData = substr($backData, strpos($backData, ',') + 1);
    //             $backData = base64_decode($backData);
    //             $backImagePath = 'uploads/customizations/back_' . time() . '.' . $type[1];

    //             if ($customization && $customization->back_image && file_exists(public_path($customization->back_image))) {
    //                 @unlink(public_path($customization->back_image));
    //             }

    //             file_put_contents(public_path($backImagePath), $backData);
    //         }
    //     }

    //     // Price calculation
    //     if ($request->side === 'front') $extraPrice = $request->front_price ?? 0;
    //     elseif ($request->side === 'back') $extraPrice = $request->back_price ?? 0;
    //     elseif ($request->side === 'both') $extraPrice = $request->both_price ?? 0;

    //     // Update or create customization
    //     if ($customization) {
    //         $oldData = json_decode($customization->custom_data, true) ?? [];
    //         $mergedData = array_merge($oldData, $customData);

    //         $customization->update([
    //             'custom_data' => json_encode($mergedData),
    //             'price' => $extraPrice ?: $customization->price,
    //             'front_image' => $frontImagePath ?? $customization->front_image,
    //             'back_image' => $backImagePath ?? $customization->back_image,
    //             'session_id' => $userId ? null : $sessionId,
    //         ]);
    //     } else {
    //         $customization = customerCustomization::create([
    //             'product_id' => $request->product_id,
    //             'user_id' => $userId,
    //             'session_id' => $userId ? null : $sessionId,
    //             'custom_data' => json_encode($customData),
    //             'price' => $extraPrice,
    //             'front_image' => $frontImagePath,
    //             'back_image' => $backImagePath,
    //         ]);
    //     }

    //     // Return Inertia response
    //     $response = Inertia::render('all', [
    //         'customization' => $customization,
    //         'customization_id' => $customization->id,
    //         'session_id' => $sessionId,
    //         'success' => true
    //     ]);

    //     return $cookie ? $response->withCookie($cookie) : $response;
    // }

    // public function storeOrUpdate(Request $request)
    // {
    //     // dd($request->all());

    //     $userId = auth('customer')->id();
    //     $sessionId = session()->getId();

    //     $request->validate([
    //         'product_id' => 'required|exists:products,id',
    //         'side' => 'required|in:front,back,both',
    //     ]);

    //     $extraPrice = match ($request->side) {
    //         'front' => $request->front_price ?? 0,
    //         'back'  => $request->back_price ?? 0,
    //         'both'  => $request->both_price ?? 0,
    //     };

    //     $customData = collect($request->except([
    //         'front_image',
    //         'back_image',
    //         'front_price',
    //         'back_price',
    //         'both_price',
    //         'product_id',
    //         'side'
    //     ]));

    //     $customization = customerCustomization::updateOrCreate(
    //         [
    //             'product_id' => $request->product_id,
    //             'user_id' => $userId,
    //             'session_id' => $userId ? null : $sessionId,
    //         ],
    //         [
    //             'custom_data' => $customData->toJson(),
    //             'price' => $extraPrice,
    //         ]
    //     );

    //     $customization->update([
    //         'front_image' => $this->saveBase64($request->front_image, 'front', $customization->front_image),
    //         'back_image'  => $this->saveBase64($request->back_image, 'back', $customization->back_image),
    //     ]);
    //     return response()->json([
    //         'customization_id' => $customization->id,
    //     ]);
    // }
    // private function saveBase64(?string $base64, string $prefix, ?string $oldPath = null): ?string
    // {
    //     if (!$base64) {
    //         return $oldPath;
    //     }

    //     // Check base64 image format
    //     if (!preg_match('/^data:image\/(\w+);base64,/', $base64, $matches)) {
    //         return $oldPath;
    //     }

    //     $extension = $matches[1];
    //     $data = substr($base64, strpos($base64, ',') + 1);
    //     $data = base64_decode($data);

    //     if ($data === false) {
    //         return $oldPath;
    //     }

    //     $directory = public_path('uploads/customizations');
    //     if (!file_exists($directory)) {
    //         mkdir($directory, 0755, true);
    //     }

    //     // Delete old image if exists
    //     if ($oldPath && file_exists(public_path($oldPath))) {
    //         @unlink(public_path($oldPath));
    //     }

    //     $filename = "{$prefix}_" . uniqid() . "." . $extension;
    //     $path = "uploads/customizations/{$filename}";

    //     file_put_contents(public_path($path), $data);

    //     return $path;
    // }

    public function storeOrUpdate(Request $request)
{
    $userId = auth('customer')->id();
    $sessionId = session()->getId();

    $request->validate([
        'product_id' => 'required|exists:products,id',
        'side' => 'required|in:front,back,both',
    ]);

    $extraPrice = match ($request->side) {
        'front' => $request->front_price ?? 0,
        'back'  => $request->back_price ?? 0,
        'both'  => $request->both_price ?? 0,
    };

    $customData = collect($request->except([
        'front_image', 'back_image', 'front_price', 'back_price', 'both_price', 'product_id', 'side'
    ]));

    // একই প্রোডাক্টের জন্য শুধু একটা রেকর্ড
    $customization = CustomerCustomization::updateOrCreate(
        [
            'product_id' => $request->product_id,
            'user_id' => $userId,
            'session_id' => $userId ? null : $sessionId,
        ],
        [
            'custom_data' => $customData->toJson(),
            'price' => $extraPrice,
        ]
    );

    // ⭐ মূল চেঞ্জ: পুরোনো সব ইমেজ আগেই ডিলিট করি (যেই সাইডই হোক)
    if ($customization->front_image && file_exists(public_path($customization->front_image))) {
        @unlink(public_path($customization->front_image));
    }
    if ($customization->back_image && file_exists(public_path($customization->back_image))) {
        @unlink(public_path($customization->back_image));
    }

    // নতুন ইমেজ সেভ করি (null হলে null থাকবে)
    $newFront = $this->saveBase64($request->front_image, 'front');
    $newBack = $this->saveBase64($request->back_image, 'back');

    $customization->update([
        'front_image' => $newFront,
        'back_image' => $newBack,
    ]);

    return response()->json([
        'customization_id' => $customization->id,
    ]);
}
private function saveBase64(?string $base64, string $prefix): ?string
{
    if (!$base64) {
        return null; // নতুন ইমেজ না থাকলে null
    }

    if (!preg_match('/^data:image\/(\w+);base64,/', $base64, $matches)) {
        return null;
    }

    $extension = $matches[1];
    $data = substr($base64, strpos($base64, ',') + 1);
    $data = base64_decode($data);

    if ($data === false) {
        return null;
    }

    // Strict validation of extension and mime type
    $allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'svg'];
    if (!in_array(strtolower($extension), $allowedExtensions)) {
        return null;
    }

    $directory = public_path('uploads/customizations');
    if (!file_exists($directory)) {
        mkdir($directory, 0755, true);
    }

    // Secure random filename
    $filename = "{$prefix}_" . bin2hex(random_bytes(16)) . "." . $extension;
    $path = "uploads/customizations/{$filename}";

    file_put_contents(public_path($path), $data);

    return $path;
}

}
