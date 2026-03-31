<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'image'=>'nullable|file|mimes:jpg,jpeg,png,webp,avif|max:3000',
            'name' => 'required|max:200',
            'category'=>'required',
            // 'brand'=>'required',
            'price'=>'required',
            'qty'=>'required',
            'short_description'=>'required|max:600',
            'long_description'=>'required',
            'status'=>'required',
            'seo_title'=>'nullable|max:200',
            'seo_description'=>'nullable|max:250',

            //customization
            'front_image' => 'nullable|file|mimes:jpg,jpeg,png,webp,avif|max:2048',
            'back_image'  => 'nullable|file|mimes:jpg,jpeg,png,webp,avif|max:2048',
            'is_customizable' => 'nullable|in:0,1',
            'front_price' => 'nullable|numeric|min:0',
            'back_price' => 'nullable|numeric|min:0',
            'both_price' => 'nullable|numeric|min:0',

            //color image
            'proColor'=>'nullable|array',
            'color_image'=>'nullable|array',
            'proColor.*'=>'nullable|integer|exists:colors,id',
            'color_image.*'=>'nullable|file|mimes:jpg,jpeg,png,webp,avif|max:2048'
        ];
    }
}
