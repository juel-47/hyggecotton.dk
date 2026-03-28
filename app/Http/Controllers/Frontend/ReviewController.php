<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\ProductReview;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ReviewController extends Controller
{
    public function create(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'rating'     => 'required|integer|min:1|max:5',
            'review'     => 'required|string|max:200',
        ]);

        $user = $request->user();
        // dd($request->all());
        if (!$user) {
            return redirect()->back()->with('error', 'Unauthorized! Please login to submit a review.');
        }

        //if user has already submitted a review for this product

        // $exists = ProductReview::where([
        //     'user_id'    => $user->id,
        //     'product_id' => $validated['product_id']
        // ])->first();

        // if ($exists) {
        //     return response()->json([
        //         'status'  => false,
        //         'message' => 'You have already submitted a review for this product'
        //     ], 409);
        // }

        ProductReview::create([
            'product_id' => $validated['product_id'],
            'user_id'    => $user->id,
            'rating'     => $validated['rating'],
            'review'     => $validated['review'],
            'status'     => 0
        ]);

        return redirect()->back()->with('Review submitted successfully');
    }
}
