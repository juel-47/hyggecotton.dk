<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Category extends Model
{
    protected $fillable = [
        'icon',
        'name',
        'slug',
        'status',
        'front_show',
        'image',
        'meta_title',
        'meta_description',
    ];
    /** Elequent relationships */
    public function subCategories()
    {
        return $this->hasMany(SubCategory::class);
    }

    /** scope */
    public function scopeActive($query)
    {
        return $query->where('status', 1);
    }
    public function scopeFrontShow($query)
    {
        return $query->where('front_show', 1);
    }
    public function products()
    {
        return $this->hasMany(Product::class);
    }
    /** booted */
    protected static function booted()
    {
        static::saved(function ($category) {
            Cache::forget('categories');
            Cache::forget('home_products');
            Cache::forget('all_products');
        });

        static::deleted(function ($category) {
            Cache::forget('categories');
            Cache::forget('home_products');
            Cache::forget('all_products');
        });
    }
    // protected static function booted()
    // {
    //     static::saved(function ($category) {
    //         Cache::forget('home_page_data'); // Clear categories cache
    //         Cache::forget('categories');
    //     });

    //     static::deleted(function ($category) {
    //         Cache::forget('home_page_data');
    //         Cache::forget('categories');
    //     });
    // }
}
