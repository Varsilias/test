<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Website extends Model
{
    // use HasFactory;
    protected $fillable = [
        'user_id',
        'domain_id',
        'domain',
        'logo',
        'name',
        'email',
        'report_to_email',
        'company_name',
        'config',
        'scan_frequency',
        'displayPosition',
        'showSettingsBtn',
        'showCloseIcon',
        'fullWidth',
        'enableMinimize',
        'primaryColor',
        'moreInfoBtnLabel',
        'showBannerIcon',
        'moreInfoBtnLink',
        'bannerTitle',
        'bannerDescription',
        'primaryTextColor',
        'primaryBtnColor',
        'primaryBtnBorderColor',
        'secondaryTextColor',
        'secondaryBtnColor',
        'secondaryBtnBorderColor',
        'declineTextColor',
        'declineBtnColor',
        'declineBtnBorderColor',
        'primaryBtnLabel',
        'declineInfoBtnLabel',
        'secondaryBtnLabel',
        'consentWidgetMounted',
        'cookiesTableMounted',
        'openGtagDefaults'
    ];

    protected $casts = [
        'config' => 'array', // Cast config column to array
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function cookies()
    {
        return $this->hasMany(Cookie::class);
    }

    public function reports()
    {
        return $this->hasMany(Report::class);
    }

    public function reportReceivers()
    {
        return $this->hasMany(ReportReceiver::class);
    }

    public static function getByUUID($uuid)
    {
        return static::where('domain_id', $uuid)->first();
    }

    public function deleteLogo()
    {
        $this->logo = '';
        $this->showBannerIcon = false;
        $this->save();
    }
}
