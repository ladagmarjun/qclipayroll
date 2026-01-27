<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PayrollDeduction extends Model
{
    protected $fillable = [
        'payroll_item_id',
        'type',
        'amount',
        'source',
    ];
}
