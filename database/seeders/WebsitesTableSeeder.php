<?php

namespace Database\Seeders;

use App\Models\Website;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class WebsitesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Example data, adjust to your needs
        $websites = [
            [
                'user_id' => 2,
                'domain_id' => 'aadc5a46-d245-4936-98fc-58f1ee680ed5',
                'name' => 'Concept cycles',
                'company_name' => 'Concept Company 1',
                'domain' => 'https://cycleconcept.co.uk',
                'scan_frequency' => 'monthly',
                'config' => json_encode(['key' => 'value']), // Example JSON data
                'showSettingsBtn' => true,
                'showCloseIcon' => false,
                'showBannerIcon' => true,
                'moreInfoBtnLink' => '/privacy-policy/',
                'moreInfoBtnLabel' => 'Privacy Policy',
                'fullWidth' => true,
                'enableMinimize' => true,
                'displayPosition' => 'right',
                'primaryColor' => '#09bf15',
                'bannerTitle' => 'Cookie consent',
                'bannerDescription' => 'This website uses cookie or similar technologies, to enhance your browsing experience and provide personalised recommendations. By continuing to use our website, you agree to our.'
            ],
            [
                'user_id' => 2,
                'domain_id' => '309e242d-d464-4049-9b48-e81c82d4b747',
                'name' => 'Example 2',
                'company_name' => 'Example Company 2',
                'domain' => 'example2.com',
                'scan_frequency' => 'daily',
                'config' => json_encode(['key2' => 'value2']), // Example JSON data
                'showSettingsBtn' => false,
                'showCloseIcon' => true,
                'showBannerIcon' => true,
                'moreInfoBtnLink' => '/terms/',
                'moreInfoBtnLabel' => 'Terms of Service',
                'fullWidth' => false,
                'enableMinimize' => false,
                'displayPosition' => 'left',
                'primaryColor' => '#ff5722',
                'bannerTitle' => 'Data Usage',
                'bannerDescription' => 'We use cookies and other tracking technologies to improve your browsing experience on our site. Read our privacy policy for more details.'
            ]
        ];

        foreach ($websites as $website) {
            Website::create($website);
        }
    }
}
