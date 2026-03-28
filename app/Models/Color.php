<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Color extends Model
{
    protected $guarded = [];
    public function products()
    {
        return $this->belongsToMany(Product::class, 'product_colors');
    }
    protected $hidden = ['pivot'];

    public function scopeActive($query)
    {
        return $query->where('status', 1);
    }

    // Booted method - Cache clear when color saved or deleted
    protected static function booted()
    {
        static::saved(function ($color) {
            Cache::forget('active_colors');
            Cache::forget('colors');
            Cache::forget('colors_with_gallery');


            // Cache::tags(['products', 'filters'])->flush();
        });

        static::deleted(function ($color) {
            Cache::forget('active_colors');
            Cache::forget('colors');
            Cache::forget('colors_with_gallery');

            // Cache::tags(['products', 'filters'])->flush();
        });
    }
}
