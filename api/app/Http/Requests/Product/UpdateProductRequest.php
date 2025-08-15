<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
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
            'name' => 'sometimes|string|max:255',
            'description' => 'sometimes|string|max:2000',
            'price' => 'sometimes|numeric|min:0|max:999999.99',
            'stock_quantity' => 'sometimes|integer|min:0|max:10000',
            'category' => 'sometimes|string|max:100',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
            'images' => 'nullable|array',
            'images.*' => 'string|max:255',
            'main_image' => 'nullable|string|max:255',
            'specifications' => 'nullable|array',
            'specifications.material' => 'nullable|string|max:100',
            'specifications.size' => 'nullable|string|max:50',
            'specifications.color' => 'nullable|string|max:50',
            'specifications.weight' => 'nullable|string|max:50',
            'status' => 'sometimes|in:active,inactive,out_of_stock',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'name.string' => 'Product name must be a string.',
            'description.string' => 'Product description must be a string.',
            'price.numeric' => 'Price must be a number.',
            'price.min' => 'Price cannot be negative.',
            'price.max' => 'Price cannot exceed 999,999.99.',
            'stock_quantity.integer' => 'Stock quantity must be a whole number.',
            'stock_quantity.min' => 'Stock quantity cannot be negative.',
            'stock_quantity.max' => 'Stock quantity cannot exceed 10,000.',
            'category.string' => 'Product category must be a string.',
            'status.in' => 'Status must be active, inactive, or out_of_stock.',
        ];
    }
}
