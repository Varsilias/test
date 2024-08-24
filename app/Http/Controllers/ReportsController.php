<?php

namespace App\Http\Controllers;

use App\Models\Cookie;
use App\Models\Report;
use App\Models\ReportReceiver;
use App\Models\Website;
use App\Services\ReportsService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class ReportsController extends Controller
{
    protected ReportsService $reportsService;

    public function __construct(ReportsService $reportsService){
        $this->reportsService = $reportsService;
    }

    public function index(Request $request): Response
    {
        $cookies = Cookie::with('website')->get();
        $reports = Report::with('website')->get();
        $report_receivers = ReportReceiver::with('website')->get();
        $websites = Website::all();

        return Inertia::render('Reports/Index', [
            'status' => session('status'),
            'cookies' => $cookies,
            'reports' => $reports,
            'report_receivers' => $report_receivers,
            'websites' => $websites,
        ]);
    }

    // Create a new report
    public function store(Request $request)
    {
        // Find or create the website by domain_name (assuming you have a Website model)
        $website = Website::getByUUID($request->input('scan_id'));

        // Create the report
        $report = Report::create([
            'website_id' => $website->id,
            'domain_name' => $request->input('domain_name'),
            'scan_id' => $request->input('scan_id'),
            'scan_time' => $request->input('scan_time'),
            'pages_scanned' => $request->input('pages_scanned'),
            'cookies' => json_encode($request->input('report')),
        ]);

        // save indivdual cookies
        $this->reportsService->batchSaveCookies($website->id, $request->input('cookies'));

        // Return a response
        return response()->json([
            'message' => 'Report stored successfully',
        ], 201);
    }

    // Retrieve a single report
    public function show($id)
    {
        $report = Report::find($id);
        if (!$report) {
            return response()->json(['message' => 'Not found'], 404);
        }
        return response()->json($report);
    }

    // Update a report
    public function update(Request $request, $id)
    {
        $report = Report::find($id);
        if (!$report) {
            return response()->json(['message' => 'Not found'], 404);
        }
        $report->update($request->all());
        return response()->json($report);
    }

    // Delete a report
    public function destroy($id)
    {
        $report = Report::find($id);
        if (!$report) {
            return response()->json(['message' => 'Not found'], 404);
        }
        $report->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
