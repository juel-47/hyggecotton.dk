<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Slider extends Model
{
    protected $fillable = [
        'title',
        'type',
        'starting_price',
        'btn_url',
        'serial',
        'status',
        'banner'
    ];

    public function scopeActive($query)
    {
        return $query->where('status', 1);
    }
    /** botted */
    // protected static function booted()
    // {
    //     static::created(function ($slider) {
    //         Cache::forget('sliders');
    //     });

    //     static::updated(function ($slider) {
    //         Cache::forget('sliders');
    //     });

    //     static::deleted(function ($slider) {
    //         Cache::forget('sliders');
    //     });
    // }

    // protected static function booted()
    // {
    //     static::saved(function ($slider) {
    //         Cache::forget('home_page_data'); // Clear sliders cache
    //         Cache::forget('sliders');
    //     });

    //     static::deleted(function ($slider) {
    //         Cache::forget('home_page_data');
    //         Cache::forget('sliders');
    //     });
    // }
}
