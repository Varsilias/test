<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    use HasFactory;
    protected $fillable = ['website_id','domain_name', 'scan_id', 'scan_time', 'pages_scanned', 'cookies'];

    protected $casts = [
        'cookies' => 'array', // This will automatically encode/decode JSON to/from array
    ];

    public function website()
    {
        return $this->belongsTo(Website::class);
    }
}
