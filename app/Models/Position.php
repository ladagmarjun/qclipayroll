<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Position extends BaseModel
{
    protected $fillable = [
        'name',
        'description',
    ];
}
