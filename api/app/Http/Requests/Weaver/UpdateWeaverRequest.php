<?php

namespace App\Http\Requests\Weaver;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateWeaverRequest extends FormRequest
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
            'bio' => 'nullable|string|max:1000',
            'location' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => [
                'sometimes',
                'email',
                Rule::unique('weavers', 'email')->ignore($this->weaver),
            ],
            'profile_image' => 'nullable|string|max:255',
            'skills' => 'nullable|array',
            'skills.*' => 'string|max:100',
            'specialties' => 'nullable|array',
            'specialties.*' => 'string|max:100',
            'experience_years' => 'nullable|integer|min:0|max:100',
            'story' => 'nullable|string|max:2000',
            'status' => 'sometimes|in:active,inactive,suspended',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'name.string' => 'The weaver name must be a string.',
            'email.email' => 'Please provide a valid email address.',
            'email.unique' => 'This email address is already registered.',
            'experience_years.integer' => 'Experience years must be a whole number.',
            'experience_years.min' => 'Experience years cannot be negative.',
            'experience_years.max' => 'Experience years cannot exceed 100.',
            'status.in' => 'Status must be active, inactive, or suspended.',
        ];
    }
}
