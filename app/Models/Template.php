<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Rorecek\Ulid\HasUlid;

class Template extends Model
{
    use HasFactory, HasUlid;
    
    public $guarded = [];
}
