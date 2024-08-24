<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class UsersController extends Controller
{
    public function getAllUsers()
    {
        $currentUserId = Auth::id();
        $users = User::where('id', '<>', $currentUserId) // Exclude the authenticated user
            ->get();

        return Inertia::render('Users/Index', [
            'users' => $users
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => 'required'
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'is_admin' => $request->is_admin,
            'password' => Hash::make($request->password),
        ]);

        return Redirect::back()->with(['message' => 'User created successfully']);
    }

    // Update a report
    public function update(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $request->id,
            'password' => 'nullable|string|min:8|confirmed',
            'is_admin' => 'required|boolean',
        ]);

        // dd($request->all());
        $user = User::find($request->id);
        if (!$user) {
            return response()->json(['message' => 'Not found'], 404);
        }
        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            // 'password' => $validated['password'] ? Hash::make($validated['password']) : $user->password,
            'is_admin' => $validated['is_admin'],
        ]);

        return Redirect::back()->with(['message' => 'User updated successfully']);
    }

    public function destroy($id)
    {
        $website = User::findOrFail($id);
        $website->delete();

        return Redirect::back()->with(['message' => 'User deleted successfully']);
    }

    public function impersonate(Request $request, $userId)
    {
        // Check if the current user is authorized to impersonate
        if (!Auth::user()->is_admin) {  // Adjust this condition based on your auth system
            return Inertia::render('Error', ['status' => 403]);
        }

        // Save impersonator id
        session()->put('impersonate', Auth::user()->id);
        // Start impersonating
        Auth::loginUsingId($userId);

        return Redirect::route('configurations');
    }

    public function stopImpersonating(Request $request)
    {
        // Check if we're currently impersonating
        if (!session()->has('impersonate')) {
            abort(403);
        }

        // Revert to original admin user
        Auth::loginUsingId(session()->get('impersonate'));
        session()->forget('impersonate');

        return Redirect::route('dashboard');
    }
}
