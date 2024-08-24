<?php

namespace App\Console\Commands;

use App\Models\Website;
use App\Services\ScanService;
use DateTime;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class ScanWebsites extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'scan:websites';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Scan websites for cookies based on their scan frequency';

    protected ScanService $scanService;

    public function __construct(ScanService $scanService)
    {
        parent::__construct();

        $this->scanService = $scanService;
    }
    /**
     * Execute the console command.
     */
    public function handle()
    {
        $websites = Website::all();

        foreach ($websites as $website) {
            // Check if it's time to scan based on scan_frequency
            if ($this->shouldScan($website)) {
                // Trigger the scan
                $data = json_encode([
                    'url' => $website->domain,
                    'domainId' => $website->domain_id,
                    'websiteId' => $website->id,
                    'fullScan' => true,
                ]);

                $this->scanService->sendToQueue($data);
            }
        }

        $this->info('Scanning completed.');
    }

    /**
     * Determine if it's time to trigger a scan for the given website.
     *
     * This method checks if a scan should be triggered based on the website's scan frequency
     * and the timing of the last scan report. If no previous scan reports exist, it's considered
     * time to scan. Otherwise, it calculates the next scan time based on the scan frequency and
     * compares it with the current time.
     *
     * @param  \App\Models\Website  $website
     * @return bool True if it's time to trigger a scan, false otherwise.
     */
    private function shouldScan($website)
    {
        // Get the last scan report for the website
        $lastScanReport = $website->reports()->latest()->first();

        // If there are no previous scan reports, it's time to scan
        if (!$lastScanReport) {
            return true;
        }

        // Get the last scan time
        $lastScanTime = strtotime($lastScanReport->created_at);

        // Calculate the next scan time based on the scan frequency
        switch ($website->scan_frequency) {
            case 'daily':
                $nextScanTime = (new DateTime($lastScanReport->created_at))->modify('+1 day')->getTimestamp();
                break;
            case 'weekly':
                $nextScanTime = (new DateTime($lastScanReport->created_at))->modify('+1 week')->getTimestamp();
                break;
            case 'monthly':
                $nextScanTime = (new DateTime($lastScanReport->created_at))->modify('+1 month')->getTimestamp();
                break;
            default:
                // Handle unsupported frequency values
                Log::error('Unsupported scan frequency: ' . $website->scan_frequency);
                return false; // Or handle it according to your application's logic
        }

        // Compare with the current time
        $currentTime = time();

        // If the current time is past the next scan time, it's time to scan
        return $currentTime > $nextScanTime;
    }
}
