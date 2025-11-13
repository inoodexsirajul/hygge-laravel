<?php

namespace App\Http\Controllers\Backend;

use App\DataTables\EmployeeAttendanceDataTable;
use App\Http\Controllers\Controller;
use App\Models\Attendance;
use Brian2694\Toastr\Facades\Toastr;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AttendanceController extends Controller
{
    public function index(EmployeeAttendanceDataTable $dataTable)
    {
        return $dataTable->render('backend.employee_dashboard.index');
    }
    // public function startAttendance()
    // {
    //     $today = now()->toDateString();

    //     $attendance = Attendance::firstOrCreate(
    //         ['user_id' => auth()->id(), 'date' => $today],
    //         ['start_time' => now()]
    //     );

    //     // যদি start_time আগে থেকেই থাকে, overwrite করা যাবে না
    //     // if (!$attendance->start_time) {
    //     //     $attendance->update(['start_time' => now()]);
    //     // }

    //     Toastr::success('Attendance started successfully.');

    //     return redirect()->back();
    // }

    // public function endAttendance()
    // {
    //     $today = now()->toDateString();
    //     $attendance = Attendance::where('user_id', auth()->id())->where('date', $today)->first();

    //     if ($attendance && !$attendance->end_time) {
    //         $attendance->update(['end_time' => now()]);
    //         Toastr::success('Attendance ended successfully.');
    //         return redirect()->back()->with('success', 'Attendance ended successfully.');
    //     }
    //     Toastr::success('Attendance ended successfully.');
    //     return redirect()->back();
    // }
    // public function attendanceStatus()
    // {
    //     $activeAttendance = Attendance::where('user_id', auth()->id())
    //         ->whereNull('end_time')
    //         ->first();

    //     return response()->json([
    //         'active' => $activeAttendance ? true : false,
    //         'startTime' => $activeAttendance ? $activeAttendance->start_time->format('h:i A') : null
    //     ]);
    // }

    public function startAttendance()
    {
        $today = now()->toDateString();

        $attendance = Attendance::firstOrCreate(
            ['user_id' => auth()->id(), 'date' => $today],
            ['start_time' => now()]
        );

        return response()->json([
            'status' => 'success',
            'message' => $attendance->wasRecentlyCreated ? 'Attendance started successfully.' : 'Attendance already started.'
        ]);
    }

    public function endAttendance()
    {
        $today = now()->toDateString();
        $attendance = Attendance::where('user_id', auth()->id())
            ->where('date', $today)
            ->first();

        if (!$attendance) {
            return response()->json(['status' => 'error', 'message' => 'Attendance has not been started yet']);
        }
        if ($attendance->end_time) {
            return response()->json(['status' => 'info', 'message' => 'Attendance already ended']);
        }

        $attendance->update(['end_time' => now()]);
        Toastr::success('Attendance ended successfully.');

        return redirect()->back(); // Page reload here
        // return redirect()->back();
        // return response()->json(['status' => 'success', 'message' => 'Attendance ended successfully.']);
    }

    public function attendanceStatus()
    {
        $activeAttendance = Attendance::where('user_id', auth()->id())
            ->whereNull('end_time')
            ->first();

        return response()->json([
            'active' => $activeAttendance ? true : false,
            'startTime' => $activeAttendance ? $activeAttendance->start_time->format('h:i A') : null
        ]);
    }
}
