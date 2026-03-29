<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Brand extends Model
{
    protected $guarded = ['id'];


    public function scopeActive($query)
    {
        return $query->where('status', 1);        
    }
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', 1);
    }

     protected static function booted()
    {
        static::saved(function ($size) {
            Cache::forget('active_brands');
            Cache::forget('brands');

            // Cache::tags(['products', 'filters'])->flush();
        });

        static::deleted(function ($size) {
            Cache::forget('active_brands');
            Cache::forget('brands');

            // Cache::tags(['products', 'filters'])->flush();
        });
    }
}
