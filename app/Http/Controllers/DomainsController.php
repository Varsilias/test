<?php

namespace App\Http\Controllers;

use App\Models\Website;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DomainsController extends Controller
{
    public function index(Request $request): Response
    {
        $domains = Website::with('cookies')->get();
        return Inertia::render('Domains/Index', ['status' => session('status'), 'domains' => $domains]);
    }
}
