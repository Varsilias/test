<?php

namespace App\Services;

use App\Models\Cookie;
use App\Models\Report;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class ReportsService
{
    public function store($data)
    {
        Log::info($data);

        $report = Report::create([
            'website_id' => $data['website_id'],
            'domain_name' => $data['domain_name'],
            'scan_id' => $data['scan_id'],
            'pages_scanned' => $data['pages_scanned'],
            'scan_time' => $data['scan_time'],
            'cookies' => json_encode($data['cookies'])
        ]);

        // process the result and save as cookie
        $this->processScanData($data);
    }

    public function processScanData($data)
    {
        $websiteId = $data['website_id'];
        $domainName = $data['domain_name'];

        foreach ($data['cookies'] as $domainUrl => $cookies) {
            foreach ($cookies as $cookie) {
                // Check if the cookie already exists based on website_id and name
                $exists = Cookie::where([
                    'website_id' => $websiteId,
                    'name' => $cookie['name'],
                    'path' => $cookie['path']  // Including path in the uniqueness check if needed
                ])->exists();

                if (!$exists) {
                    $category = Str::startsWith($cookie['name'], '_ga') ? 'analytics' : null;

                    // Cookie does not exist, create a new record
                    $cookieRecord = Cookie::create([
                        'website_id' => $websiteId,
                        'name' => $cookie['name'],
                        'provider' => $domainName,
                        'value' => $cookie['value'],
                        'type' => $cookie['session'] ? 'session' : 'persistent',
                        'expiry' => $this->convertExpiry($cookie['expires']),
                        'path' => $cookie['path'],
                        'secure' => $cookie['secure'],
                        'http_only' => $cookie['httpOnly'],
                        'category' => $category
                    ]);

                    // Log the creation of a new cookie
                    Log::info("New cookie created: " . print_r($cookieRecord->toArray(), true));
                } else {
                    // Log that the cookie already exists and skip creation
                    Log::info("Cookie already exists with website_id {$websiteId}, name {$cookie['name']}, and path {$cookie['path']}. Skipping creation.");
                }
            }
        }
    }

    public function batchSaveCookies($websiteId, $data)
    {

        foreach ($data as $domainUrl => $cookie) {
            // Check if the cookie already exists based on website_id and name
            $exists = Cookie::where([
                'website_id' => $websiteId,
                'name' => $cookie['name'],
                'path' => $cookie['path']  // Including path in the uniqueness check if needed
            ])->exists();

            if (!$exists) {
                $category = Str::startsWith($cookie['name'], '_ga') ? 'analytics' : null;

                // Cookie does not exist, create a new record
                $cookieRecord = Cookie::create([
                    'website_id' => $websiteId,
                    'name' => $cookie['name'],
                    'provider' => $cookie['domain'],
                    'value' => $cookie['value'],
                    'type' => $cookie['session'] ? 'session' : 'persistent',
                    'expiry' => $this->convertExpiry($cookie['expires']),
                    'path' => $cookie['path'],
                    'secure' => $cookie['secure'],
                    'http_only' => $cookie['httpOnly'],
                    'category' => $category
                ]);

                // Log the creation of a new cookie
                Log::info("New cookie created: " . print_r($cookieRecord->toArray(), true));
            } else {
                // Log that the cookie already exists and skip creation
                Log::info("Cookie already exists with website_id {$websiteId}, name {$cookie['name']}, and path {$cookie['path']}. Skipping creation.");
            }
        }
    }

    /**
     * Converts Unix timestamp expiry to a more readable format or calculates duration until expiry.
     * Example returns minutes until expiry.
     *
     * @param $unixTimestamp
     * @return int
     */
    private function convertExpiry($unixTimestamp)
    {
        return max(0, ($unixTimestamp - time()) / 60);
    }
}
