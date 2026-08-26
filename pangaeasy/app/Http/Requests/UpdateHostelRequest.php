<?php

namespace App\Http\Requests;

//use Illuminate\Contracts\Validation\ValidationRule;
use App\Enums\HostelType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateHostelRequest extends FormRequest
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
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'hostel_name' => [
                'required',
                'string',
                'min:3',
                'max:100',
            ],

            'description' => [
                'required',
                'string',
                'min:20',
                'max:1000',
            ],

            'region' => [
                'required',
                'string',
                'max:100',
            ],

            'district' => [
                'required',
                'string',
                'max:100',
            ],

            'ward' => [
                'required',
                'string',
                'max:100',

            ],

            'street' => [
                'required',
                'string',
                'min:2',
                'max:100',
            ],

            'landmark' => [
                'nullable',
                'string',
                'max:255',
            ],

            'hostel_type' => [
                'required',
                Rule::enum(HostelType::class),
            ],
        ];
    }
}
