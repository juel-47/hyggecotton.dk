<?php

namespace App\Http\Controllers\Backend;

use App\DataTables\OutOfStockDataTable;
use App\DataTables\ProductDataTable;
use App\DataTables\ProductsPendingDataTable;
use App\Http\Controllers\Controller;
use App\Http\Requests\ProductCreateRequest;
use App\Http\Requests\ProductUpdateRequest;
use App\Models\Brand;
use App\Models\Category;
use App\Models\ChildCategory;
use App\Models\Color;
use App\Models\OrderProduct;
use App\Models\Product;
use App\Models\productCustomization;
use App\Models\ProductImageGallery;
use App\Models\Size;
use App\Models\SubCategory;
use App\Traits\ImageUploadTrait;
use Brian2694\Toastr\Facades\Toastr;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Cache;
use App\Support\CacheKeys;


class ProductController extends Controller
{
    use ImageUploadTrait;
    /**
     * Display a listing of the resource.
     */
    public function index(ProductDataTable $dataTable)
    {
        return $dataTable->render('backend.product.index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = Category::where('status', 1)->get();
        $brands = Brand::where('status', 1)->get();
        $colors = Color::where('status', 1)->get();
        $sizes = Size::where('status', 1)->get();
        return view('backend.product.create', compact('categories', 'brands', 'colors', 'sizes'));
    }

    /**
     * Store a newly created resource in storage.
     */

    public function store(ProductCreateRequest $request)
    {
        /** ensure array exists */
        $proColors = $request->proColor ?? [];
        $colorImages = $request->file('color_image') ?? [];

        /** COLOR + IMAGE VALIDATION */
        foreach ($proColors as $index => $color_id) {
            $imageFile = $colorImages[$index] ?? null;

            if ($color_id && !$imageFile) {
                Toastr::error("Color image is required when a color is selected!", "Error");
                return back()->withInput();
            }

            if (!$color_id && $imageFile) {
                Toastr::error("Please select a color for the uploaded image!", "Error");
                return back()->withInput();
            }
        }

        /** PRODUCT CREATE */
        $lastId = (Product::max('id') ?? 0) + 1;
        $productCode = 'P' . str_pad($lastId, 4, '0', STR_PAD_LEFT);

        $imagePath = $this->upload_image($request, 'image', 'uploads/products');

        $product = new Product();
        $product->thumb_image = $imagePath;
        $product->name = $request->name;
        $product->slug = Str::slug($request->name);
        $product->category_id = $request->category;
        $product->sub_category_id = $request->sub_category;
        $product->child_category_id = $request->child_category;
        $product->brand_id = $request->brand;
        $product->qty = $request->qty;
        $product->short_description = $request->short_description;
        $product->long_description = $request->long_description;
        $product->video_link = $request->video_link;
        $product->sku = $request->sku;
        $product->purchase_price = $request->purchase_price ?? null;
        $product->price = $request->price;
        $product->offer_price = $request->offer_price;
        $product->offer_start_date = $request->offer_start_date;
        $product->offer_end_date = $request->offer_end_date;
        $product->product_type = $request->product_type;
        $product->status = $request->status;
        $product->meta_title = $request->meta_title;
        $product->meta_description = $request->meta_description;
        $product->created_by = auth()->id();
        $product->product_code = $productCode;
        $product->is_approved = auth()->user()->hasRole('SuperAdmin') || auth()->user()->hasRole('Admin') ? 1 : 0;
        $product->save();

        /** SIZE SYNC FROM VARIANTS */
        $sizesToSync = [];

        if ($request->filled('variants') && is_array($request->variants)) {
            foreach ($request->variants as $variant) {
                if (!empty($variant['size_id'])) {
                    $sizesToSync[$variant['size_id']] = [
                        'size_price' => $variant['price'] ?? 0,
                    ];
                }
            }
            $product->sizes()->sync($sizesToSync);
        }

        /** COLOR IMAGE UPLOAD + SYNC TO product_colors (with color_price = 0) */
        $colorsToSync = [];

        foreach ($proColors as $index => $color_id) {
            if (!$color_id) continue;

            $imageFile = $colorImages[$index] ?? null;
            if (!$imageFile) continue;

            // Image upload
            $path = public_path('uploads/image-gallery');
            if (!file_exists($path)) {
                mkdir($path, 0755, true);
            }

            $ext = $imageFile->getClientOriginalExtension();
            $imageName = 'media_' . uniqid() . '.' . $ext;
            $imageFile->move($path, $imageName);

            // Store in gallery
            ProductImageGallery::create([
                'product_id' => $product->id,
                'color_id'   => $color_id,
                'image'      => 'uploads/image-gallery/' . $imageName,
            ]);

            // Add to product_colors with color_price = 0
            $colorsToSync[$color_id] = [
                'color_price' => 0,
            ];
        }

        // Sync colors to product_colors table
        if (!empty($colorsToSync)) {
            $product->colors()->sync($colorsToSync);
        }

        /** CUSTOMIZATION */
        $isCustomizable = $request->input('is_customizable', 0);

        if ($isCustomizable) {
            $frontPath = $request->hasFile('front_image')
                ? $this->upload_image($request, 'front_image', 'uploads/customize')
                : null;

            $backPath = $request->hasFile('back_image')
                ? $this->upload_image($request, 'back_image', 'uploads/customize')
                : null;

            $product->customization()->updateOrCreate(
                ['product_id' => $product->id],
                [
                    'is_customizable' => 1,
                    'front_image'     => $frontPath,
                    'back_image'      => $backPath,
                    'front_price'     => $request->input('front_price', 0) ?: 0,
                    'back_price'      => $request->input('back_price', 0) ?: 0,
                    'both_price'      => $request->input('both_price', 0) ?: 0,
                ]
            );
        }

        \App\Helpers\SecurityLogger::log('PRODUCT_CREATED', "Created product: " . $product->name);
        Toastr::success('Created Product Successfully!', 'success');
        return redirect()->route('admin.products.index');
    }


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $product = Product::with(['customization', 'productImageGalleries'])->findOr($id);
        $subCategories = SubCategory::where('category_id', $product->category_id)->get();
        $childCategories = ChildCategory::where('sub_category_id', $product->sub_category_id)->get();
        $categories = Category::where('status', 1)->get();
        $brands = Brand::all();
        $colors = Color::where('status', 1)->get();
        $sizes = Size::where('status', 1)->get();
        return view('backend.product.edit', compact('product', 'categories', 'brands', 'subCategories', 'childCategories', 'colors', 'sizes'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ProductUpdateRequest $request, string $id)
    {
        $product = Product::findOrFail($id);

        /** handle image update */
        $imagePath = $this->update_image($request, 'image', 'uploads/products', $product->thumb_image);
        $product->thumb_image = !empty($imagePath) ? $imagePath : $product->thumb_image;

        $product->name = $request->name;
        $product->slug = Str::slug($request->name);
        $product->category_id = $request->category;
        $product->sub_category_id = $request->sub_category;
        $product->child_category_id = $request->child_category;
        $product->brand_id = $request->brand;
        $product->qty = $request->qty;
        $product->short_description = $request->short_description;
        $product->long_description = $request->long_description;
        $product->video_link = $request->video_link;
        $product->sku = $request->sku;
        $product->price = $request->price;
        $product->offer_price = $request->offer_price;
        $product->offer_start_date = $request->offer_start_date;
        $product->offer_end_date = $request->offer_end_date;
        $product->product_type = $request->product_type;
        $product->status = $request->status;

        if (auth()->user()->hasRole('SuperAdmin') || auth()->user()->hasRole('Admin')) {
            $product->is_approved = 1;
        } else {
            $product->is_approved = $product->getOriginal('is_approved');
        }

        $product->meta_title = $request->meta_title;
        $product->meta_description = $request->meta_description;
        $product->save();

        /** Handle Size Variants */
        $sizesToSync = [];
        if ($request->has('variants')) {
            foreach ($request->variants as $variant) {
                if (!empty($variant['size_id'])) {
                    $sizesToSync[$variant['size_id']] = ['size_price' => $variant['price'] ?? 0];
                }
            }
        }
        $product->sizes()->sync($sizesToSync);

        /** Handle Deleted Colors */
        if ($request->has('deleted_color_ids') && !empty($request->deleted_color_ids)) {
            $deletedIds = explode(',', $request->deleted_color_ids);
            ProductImageGallery::where('product_id', $product->id)
                ->whereIn('color_id', $deletedIds)
                ->delete();
        }

        /** Handle Color + Color Images */
        $colorsToSync = [];  //product color synce

        if ($request->has('proColor')) {
            foreach ($request->proColor as $index => $color_id) {
                if (!$color_id) continue;

                $existingGallery = $product->productImageGalleries()->where('color_id', $color_id)->first();
                $imagePathColor = null;

                if ($request->hasFile('color_image') && isset($request->file('color_image')[$index])) {
                    $singleFileRequest = new \Illuminate\Http\Request();
                    $singleFileRequest->files->set('color_image', $request->file('color_image')[$index]);
                    $imagePathColor = $this->update_image(
                        $singleFileRequest,
                        'color_image',
                        'uploads/image-gallery',
                        $existingGallery?->image
                    );
                }

                $finalImage = $imagePathColor ?? $existingGallery?->image;

                if ($finalImage || $existingGallery) {
                    ProductImageGallery::updateOrCreate(
                        ['product_id' => $product->id, 'color_id' => $color_id],
                        ['image' => $finalImage]
                    );
                }

                // collect color and price
                $colorsToSync[$color_id] = ['color_price' => 0];
            }
        }

        // new color sync — product_colors sync

    
        $product->colors()->sync($colorsToSync);
    
        // 1. Clear specific product details cache
        Cache::forget(CacheKeys::PRODUCT_DETAILS . $product->slug);

        // 2. Invalidate "Active Products" listing by incrementing version tag
        Cache::increment(CacheKeys::ALL_PRODUCTS_TAG);

        // 3. Clear Home Page Cache
        Cache::forget(CacheKeys::HOME_PAGE);
        
        Cache::forget('active_colors');
        Cache::forget('colors');
        Cache::forget('colors_with_gallery');
        Cache::forget('active_sizes');
        Cache::forget('sizes');

        /** Handle Product Customization */
        if ($request->is_customizable == 1) {
            $customization = $product->customization ?? new ProductCustomization(['product_id' => $product->id]);

            $customization->is_customizable = 1;

            $frontNew = $this->update_image($request, 'front_image', 'uploads/customize', $customization->front_image ?? null);
            $customization->front_image = $frontNew ?: ($customization->front_image ?? null);

            $backNew = $this->update_image($request, 'back_image', 'uploads/customize', $customization->back_image ?? null);
            $customization->back_image = $backNew ?: ($customization->back_image ?? null);

            $customization->front_price = $request->front_price ?? 0;
            $customization->back_price = $request->back_price ?? 0;
            $customization->both_price = $request->both_price ?? 0;

            $customization->save();
        } else {
            $product->customization?->delete();
        }

        \App\Helpers\SecurityLogger::log('PRODUCT_UPDATED', "Updated product: " . $product->name);
        Toastr::success('Product Updated Successfully!', 'success');
        return redirect()->route('admin.products.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $product = Product::findOrFail($id);
        if (OrderProduct::where('product_id', $product->id)->count() > 0) {
            return response(['status' => 'error', 'message' => 'Product have orders! Can not be deleted']);
        }

        // Detach sizes and colors from pivot tables
        $product->sizes()->detach();
        $product->colors()->detach();

        // /**Delete main product image */
        $this->deleteImage($product->thumb_image);

        // /** delete product gallery images */
        $galleryImages = ProductImageGallery::where('product_id', $product->id)->get();
        foreach ($galleryImages as $image) {
            $this->deleteImage($image->image);
            $image->delete();
        }
        $product->customization?->delete();
        $product->delete();
        \App\Helpers\SecurityLogger::log('PRODUCT_DELETED', "Deleted product: " . $product->name);
        return response(['status' => 'success', 'message' => 'Deleted Successfully!']);
    }
    /**
     * Get all sub categories
     */
    public function getSubCategories(Request $request)
    {
        $subCategories = SubCategory::where('category_id', $request->id)->get();
        return $subCategories;
    }
    /**
     * Get all child categories
     */
    public function getChildCategories(Request $request)
    {
        $childCategories = ChildCategory::where('sub_category_id', $request->id)->get();
        return $childCategories;
    }
    /**
     * Change product status
     */
    function changeStatus(Request $request)
    {
        $product = Product::findOrFail($request->id);
        $product->status = $request->status == 'true' ? 1 : 0;
        $product->save();
        return response(['message' => 'Status has been Updated!']);
    }
    /**
     * product pending 
     */
    public function productsPending(ProductsPendingDataTable $dataTable)
    {
        return $dataTable->render('backend.product.pending.index');
    }
    /** change product approve status */
    public function changeApproveStatus(Request $request)
    {
        $product = Product::findOrFail($request->id);
        $product->is_approved = $request->value;
        $product->save();
        return response(['message' => 'Product Approved Status Has Been Changed!']);
    }

    public function outOfStock(OutOfStockDataTable $dataTable)
    {
        return $dataTable->render('backend.product.outofstock.index');
    }
}
