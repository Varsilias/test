<?php

namespace App\Http\Controllers;

use App\Models\Website;
use App\Services\ScanService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Str;
use Inertia\Inertia;

class WebsitesController extends Controller
{
    protected ScanService $scanService;

    public function __construct(ScanService $scanService)
    {
        $this->scanService = $scanService;
    }

    public function onBoarding()
    {
        $domains = Website::with('cookies')->get();
        return Inertia::render('Onboarding/Index', ['domains' => $domains,]);
    }

    public function onBoardingStore(Request $request)
    {
        $request->validate([
            'user_id' => 'required',
            'domain' => 'required|unique:websites,domain',
            'config' => 'nullable|array',
        ]);

        // Generate UUID for domain_id
        $domainId = (string) Str::uuid();

        $website = Website::create([
            'user_id' => $request->user_id,
            'domain_id' => $domainId,
            'domain' => $request->domain,
            'config' => $request->config,
            'name' => $request->name,
            'email' => $request->email,
        ]);

        $newWebsite = Website::findOrFail($website->id);
        $domains = Website::with('cookies')->get();

        // Store data in session flash
        session()->flash('website', $newWebsite);
        session()->flash('domains', $domains);

        // Redirect back to the previous page
        return Redirect::back();
        // return Inertia::render('Onboarding/Index', [
        //     'website' => $newWebsite,
        //     'domains' => $domains,
        // ]);
    }

    public function getAllWebsites()
    {
        return Website::all();
    }

    public function getWebsitesByUser($userId)
    {
        return Website::where('user_id', $userId)->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required',
            'domain' => 'required|unique:websites,domain',
            'config' => 'nullable|array',
        ]);

        // Generate UUID for domain_id
        $domainId = (string) Str::uuid();

        $website = Website::create([
            'user_id' => $request->user_id,
            'domain_id' => $domainId,
            'domain' => $request->domain,
            'config' => $request->config,
            'name' => $request->name,
        ]);

        return Redirect::back()->with(['message' => 'Operation successfully']);
    }

    public function triggerScan($domainId)
    {
        $website = Website::getByUUID($domainId);
        if ($website && $website->consentWidgetMounted) {
            $this->sendScanRequest($domainId, $website->id, $website->domain, true);
        } else {
            return redirect()->back()->withErrors(['message' => 'The consent widget is not mounted on this website.']);
        }
    }

    public function triggerScanAPI($domainId)
    {
        $website = Website::getByUUID($domainId);
        if ($website && $website->consentWidgetMounted) {
            $this->sendScanRequest($domainId, $website->id, $website->domain, true);
        }

        return response()->json(['message' => 'Scan has been triggered']);
    }

    public function sendScanRequest($domainId, $websiteId, $url, $fullScan)
    {
        $data = json_encode([
            'url' => $url,
            'domainId' => $domainId,
            'websiteId' => $websiteId,
            'fullScan' => $fullScan
        ]);

        $this->scanService->sendToQueue($data);
    }

    public function sendToQueueFromAPI(Request $request)
    {
        $data = $request->all();

        $this->scanService->sendToQueue($data);

        return response()->json(['message' => 'Data sent to the scan request queue']);
    }

    public function update(Request $request)
    {
        $request->validate([
            'website_id' => 'nullable',
            'domain' => 'nullable|unique:websites,domain,' . $request->website_id,
            'config' => 'nullable|array',
            'scan_frequency' => 'nullable',
        ]);
        $website = Website::findOrFail($request->website_id);

        $website->update($request->all());

        return Redirect::back()->with(['message' => 'Website updated successfully']);
    }

    public function getById($id)
    {
        $website = Website::findOrFail($id);

        return response()->json($website);
    }

    public function getByUUID($uuid)
    {
        $website = Website::getByUUID($uuid);

        return response()->json($website);
    }

    public function destroy($id)
    {
        $website = Website::findOrFail($id);
        $website->delete();

        return Redirect::back()->with(['message' => 'Website deleted successfully']);
    }

    public function deleteLogo($id)
    {
        $website = Website::findOrFail($id);
        $website->deleteLogo();

        return Redirect::back()->with(['message' => 'Logo deleted successfully']);
    }

    public function updateLogo(Request $request)
    {
        $website = Website::getByUUID($request->domainId);
        $website->logo = $request->logo;
        $website->save();

        return Redirect::back()->with(['message' => 'Website logo updated successfully']);
    }

    public function updateReportToEmail(Request $request)
    {
        $website = Website::getByUUID($request->domainId);
        $website->report_to_email = $request->report_to_email;
        $website->save();

        return Redirect::back()->with(['message' => 'Operation successful']);
    }

    public function updateConsentWidgetMounted(Request $request, $domainId)
    {
        $website = Website::getByUUID($domainId);
        $website->consentWidgetMounted = $request->input('consentWidgetMounted');
        $website->save();

        // $this->triggerScan($domainId);

        return response()->json(['message' => 'Consent widget mounted status updated successfully']);
    }

    public function updateCookiesTableMounted(Request $request, $domainId)
    {
        $website = Website::getByUUID($domainId);
        $website->cookiesTableMounted = $request->input('cookiesTableMounted');
        $website->save();

        return response()->json(['message' => 'Cookies table mounted status updated successfully']);
    }

    public function updateOpenGtagDefaults(Request $request, $domainId)
    {
        $website = Website::getByUUID($domainId);
        $website->openGtagDefaults = $request->input('openGtagDefaults');
        $website->save();

        return response()->json(['message' => 'Gtag defaults updated successfully']);
    }
}
