<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobApplication;
use Illuminate\Http\Request;

class JobApplicationController extends Controller
{
    // public function store(Request $request)
    // {
    //     $validated = $request->validate([
    //         'name' => 'required|max:200',
    //         'email' => 'required|email|max:200',
    //         'phone' => 'required|max:20',
    //         'position' => 'required|max:100',
    //         'resume' => 'required|file|mimes:pdf,doc,docx,xls,xlsx,csv,txt|max:5120',
    //         'cover_letter' => 'nullable|string',
    //     ]);

    //     // File upload
    //     // if ($request->hasFile('resume')) {
    //     //     $path = $request->file('resume')->store('applications');
    //     //     $validated['resume'] = $path;
    //     // }
    //     // custom upload path
    //     $uploadPath = public_path('uploads/applications');

    //     // folder create if not exists
    //     if (!file_exists($uploadPath)) {
    //         mkdir($uploadPath, 0777, true);
    //     }

    //     // File upload
    //     if ($request->hasFile('resume')) {
    //         $file = $request->file('resume');
    //         $filename = time() . '_' . $file->getClientOriginalName();
    //         $file->move($uploadPath, $filename);

    //         // save only relative path
    //         $validated['resume'] = 'uploads/applications/' . $filename;
    //     }


    //     $application = JobApplication::create($validated);

    //     return response()->json([
    //         'status' => 'success',
    //         'message' => 'Application submitted successfully',
    //         'data' => $application
    //     ]);
    // }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|max:200',
            'email' => 'required|email|max:200',
            'phone' => 'required|max:20',
            'position' => 'required|max:100',
            'resume' => 'required|file|mimes:pdf,doc,docx,xls,xlsx,csv,txt|max:5120',
            'cover_letter' => 'nullable|string',
        ]);

        // Prevent duplicate submission by same email + position
        $exists = JobApplication::where('email', $validated['email'])
            ->where('position', $validated['position'])
            ->first();

        if ($exists) {
            return response()->json([
                'status' => 'error',
                'message' => 'You have already submitted an application for this position.'
            ], 409); // 409 = Conflict
        }

        // File upload path
        $uploadPath = public_path('uploads/applications');

        if (!file_exists($uploadPath)) {
            mkdir($uploadPath, 0777, true);
        }

        // File upload
        if ($request->hasFile('resume')) {
            $file = $request->file('resume');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move($uploadPath, $filename);

            // Save relative path
            $validated['resume'] = 'uploads/applications/' . $filename;
        }

        // Create application
        $application = JobApplication::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Application submitted successfully',
            'data' => $application
        ]);
    }
}
