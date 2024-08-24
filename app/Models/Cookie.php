<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cookie extends Model
{
    // use HasFactory;
    protected $fillable = ['website_id', 'name', 'provider', 'category', 'value', 'type', 'expiry', 'path', 'secure', 'http_only'];

    public function website()
    {
        return $this->belongsTo(Website::class);
    }
}
