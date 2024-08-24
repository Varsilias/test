<?php

namespace App\Http\Controllers;

use App\Models\Website;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ConfigurationsController extends Controller
{
    public function index(Request $request): Response
    {
        $domains = Website::with('cookies')->get();
        return Inertia::render('Configurations/Index', ['status' => session('status'), 'domains' => $domains]);
    }

    public function update(Request $request)
    {
        try {
            $request->validate([
                'website_id' => 'required',
            ]);

            $website = Website::findOrFail($request->website_id);

            $website->update($request->all());

            return Redirect::back()->with(['message' => 'Website updated successfully']);
        } catch (\Exception $e) {
            return Redirect::back()->withErrors(['error' => $e->getMessage()]);
        }
    }

}
