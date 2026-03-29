<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Size extends Model
{
    protected $guarded = ['id'];
    public function products()
    {
        return $this->belongsToMany(Product::class, 'product_sizes');
    }
    protected $hidden = ['pivot'];
    
    public function scopeActive($query)
    {
        return $query->where('status', 1);
    }


    protected static function booted()
    {
        static::saved(function ($size) {
            Cache::forget('active_sizes');
            Cache::forget('sizes');

            // Cache::tags(['products', 'filters'])->flush();
        });

        static::deleted(function ($size) {
            Cache::forget('active_sizes');
            Cache::forget('sizes');

            // Cache::tags(['products', 'filters'])->flush();
        });
    }
}
