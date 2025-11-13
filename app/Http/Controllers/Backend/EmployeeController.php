<?php

namespace App\Http\Controllers\Backend;

use App\DataTables\AllEmployeeAttendanceDataTable;
use App\DataTables\EmployeeDataTable;
use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Employee;
use App\Models\User;
use Brian2694\Toastr\Facades\Toastr;
use Carbon\Carbon;
use Illuminate\Http\Request;

class EmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(EmployeeDataTable $dataTable)
    {
        return $dataTable->render('backend.employee.index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('backend.employee.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
            'designation' => 'nullable|string',
            'status' => 'required|boolean',
        ]);

        // Create user
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'status' => $request->status
        ]);

        // Assign role
        // $user->assignRole('employee');

        // Create employee profile
        Employee::create([
            'user_id' => $user->id,
            'name' => $request->name,
            'designation' => $request->designation,
        ]);
        Toastr::success('Employee created successfully');
        return redirect()->route('admin.employees.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id, AllEmployeeAttendanceDataTable $dataTable)
    {

        // $dataTable->setEmployeeId($id);
        $employee = Employee::findOrFail($id);
        $dataTable->setUserId($employee->user_id);
        return $dataTable->render('backend.employee.show', compact('id', 'employee'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $employee = Employee::findOrFail($id);
        $employee->user()->delete();
        $employee->delete();
        return response(['status' => 'success', 'message' => 'Delete Successfully!']);
    }
    public function changeStatus(Request $request)
    {
        $employee = Employee::findOrFail($request->id);
        if ($employee->user) {
            $employee->user->status = $request->status === 'true' ? 1 : 0;
            $employee->user->save();
        }

        return response(['message' => 'Status has been Updated!']);
    }
    public function summary(Employee $employee, Request $request)
    {
        $summary = $this->getEmployeeSummary($employee->user_id, $request->only('date'));
        return response()->json($summary);
    }

    private function getEmployeeSummary($employeeId, $filter = [])
    {
        $today = Carbon::today();
        $thisMonth = Carbon::now()->month;
        $thisYear = Carbon::now()->year;

        $calculateHours = function ($query) {
            $totalMinutes = 0;
            foreach ($query->get() as $attendance) {
                if ($attendance->start_time && $attendance->end_time) {
                    $start = Carbon::parse($attendance->start_time);
                    $end = Carbon::parse($attendance->end_time);
                    $totalMinutes += $start->diffInMinutes($end);
                }
            }
            $hours = intdiv($totalMinutes, 60);
            $minutes = $totalMinutes % 60;
            return "{$hours}h {$minutes}m";
        };

        $totalToday = $calculateHours(
            Attendance::where('user_id', $employeeId)->whereDate('date', $today)
        );

        $totalMonth = $calculateHours(
            Attendance::where('user_id', $employeeId)
                ->whereMonth('date', $thisMonth)
                ->whereYear('date', $thisYear)
        );

        $totalYear = $calculateHours(
            Attendance::where('user_id', $employeeId)
                ->whereYear('date', $thisYear)
        );

        $totalFiltered = null;
        if (isset($filter['date']) && $filter['date'] != '') {
            $totalFiltered = $calculateHours(
                Attendance::where('user_id', $employeeId)
                    ->whereDate('date', $filter['date'])
            );
        }

        return [
            'today' => $totalToday,
            'month' => $totalMonth,
            'year' => $totalYear,
            'filtered' => $totalFiltered
        ];
    }
}
