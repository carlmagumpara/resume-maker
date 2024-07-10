<?php

namespace App\Models;

use Laratrust\Models\Role as RoleModel;
use Rorecek\Ulid\HasUlid;

class Role extends RoleModel
{
    use HasUlid;
    
    public $guarded = [];
}
