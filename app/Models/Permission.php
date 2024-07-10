<?php

namespace App\Models;

use Laratrust\Models\Permission as PermissionModel;
use Rorecek\Ulid\HasUlid;

class Permission extends PermissionModel
{
    use HasUlid;
    
    public $guarded = [];
}
