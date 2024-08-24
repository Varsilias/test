<?php

namespace App\Http\Controllers;

use App\Models\ReportReceiver;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class ReportReceiverController extends Controller
{
    // Display a listing of report receivers
    public function index()
    {
        return ReportReceiver::all();
    }

    // Store a newly created report receiver
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:report_receivers,email',
            'website_id' => 'required|exists:websites,id',
            'active' => 'boolean',
        ]);

        ReportReceiver::create($request->all());

        return Redirect::back()->with(['message' => 'Receiver updated successfully']);
    }

    // Display the specified report receiver
    public function show($id)
    {
        return ReportReceiver::findOrFail($id);
    }

    // Update the specified report receiver
    public function update(Request $request)
    {
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:report_receivers,email,' . $request->receiver_id,
            'website_id' => 'sometimes|required|exists:websites,id',
            'active' => 'boolean',
        ]);

        $reportReceiver = ReportReceiver::findOrFail($request->receiver_id);
        $reportReceiver->update($request->all());

        return Redirect::back()->with(['message' => 'Receiver updated successfully']);
    }

    // Remove the specified report receiver
    public function destroy($id)
    {
        $reportReceiver = ReportReceiver::findOrFail($id);
        $reportReceiver->delete();

        return Redirect::back()->with(['message' => 'Receiver deleted successfully']);
    }
}
