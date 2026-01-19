<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEmployeeRequest extends FormRequest
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
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'middle_name' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255', 'unique:employees,email'],
            'phone' => ['nullable', 'string', 'max:20'],
            'salary' => ['nullable', 'numeric', 'gt:0'],
            'hired_at' => ['nullable', 'date'],
            'department_id' => ['required', 'exists:departments,id'],
            'position_id' => ['required', 'exists:positions,id'],   
            'division_id' => ['nullable', 'exists:divisions,id'],
            'gender' => ['required', 'string', 'in:male,female,other'],
            'marital_status' => ['required', 'string', 'in:single,married,divorced,widowed'],
            'employment_type' => ['required', 'string'],
            'employment_status' => ['required', 'string'],
            'address' => ['nullable', 'string', 'max:500'],
        ];
    }
}
