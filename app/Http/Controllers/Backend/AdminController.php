<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Category;
use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderStatus;
use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function index()
    {
        $todaysOrders = Order::whereDate('created_at', Carbon::today())->count();
        $totalOrders = Order::count();
        $totalCategories = Category::count();
        $orderStatuses = OrderStatus::where('status', 1)->get();
        $totalUsers = Customer::count();

        $ordersByStatus = [];

        foreach ($orderStatuses as $status) {
            $ordersByStatus[] = [
                'name' => $status->name,
                'count' => Order::where('order_status_id', $status->id)->count(),
                'color' => $status->color ?? 'primary', // optional color
                'icon' => $status->icon ?? 'fas fa-shopping-cart', // optional icon
                'order_status_id' => $status->id
            ];
        }
        $totalProduct = Product::count();

        // $employeeId = auth()->user()->id ?? null;

        // if (!$employeeId) {
        //     $todayHoursFormatted = $monthHoursFormatted = $yearHoursFormatted = '0h 0m';
        // } else {

        //     $todayMinutes = Attendance::where('user_id', $employeeId)
        //         ->whereDate('start_time', Carbon::today())
        //         ->whereNotNull('end_time')
        //         ->get()
        //         ->sum(function ($att) {
        //             return Carbon::parse($att->start_time)->diffInMinutes(Carbon::parse($att->end_time));
        //         });
        //     $todayHoursFormatted = intdiv($todayMinutes, 60) . 'h ' . ($todayMinutes % 60) . 'm';


        //     $monthMinutes = Attendance::where('user_id', $employeeId)
        //         ->whereMonth('start_time', Carbon::now()->month)
        //         ->whereYear('start_time', Carbon::now()->year)
        //         ->whereNotNull('end_time')
        //         ->get()
        //         ->sum(function ($att) {
        //             return Carbon::parse($att->start_time)->diffInMinutes(Carbon::parse($att->end_time));
        //         });
        //     $monthHoursFormatted = intdiv($monthMinutes, 60) . 'h ' . ($monthMinutes % 60) . 'm';


        //     $yearMinutes = Attendance::where('user_id', $employeeId)
        //         ->whereYear('start_time', Carbon::now()->year)
        //         ->whereNotNull('end_time')
        //         ->get()
        //         ->sum(function ($att) {
        //             return Carbon::parse($att->start_time)->diffInMinutes(Carbon::parse($att->end_time));
        //         });
        //     $yearHoursFormatted = intdiv($yearMinutes, 60) . 'h ' . ($yearMinutes % 60) . 'm';
        // }
        $workingHours = $this->calculateWorkingHours();
        return view('backend.dashboard', compact('todaysOrders', 'ordersByStatus', 'totalOrders', 'totalCategories', 'totalUsers', 'totalProduct', 'workingHours'));
    }

    private function getWorkingTime($userId, $period)
    {
        $query = Attendance::where('user_id', $userId)
            ->whereNotNull('end_time');

        switch ($period) {
            case 'today':
                $query->whereDate('start_time', Carbon::today());
                break;
            case 'month':
                $query->whereMonth('start_time', Carbon::now()->month)
                    ->whereYear('start_time', Carbon::now()->year);
                break;
            case 'year':
                $query->whereYear('start_time', Carbon::now()->year);
                break;
        }

        $totalMinutes = $query->get()->sum(function ($att) {
            return Carbon::parse($att->start_time)
                ->diffInMinutes(Carbon::parse($att->end_time));
        });

        return sprintf("%2dh:%2dm", intdiv($totalMinutes, 60), $totalMinutes % 60);
    }

   
    private function calculateWorkingHours()
    {
        $userId = auth()->id();

        if (!$userId) {
            return [
                'today' => '0h:0m',
                'month' => '0h:0m',
                'year' => '0h:0m',
            ];
        }

        return [
            'today' => $this->getWorkingTime($userId, 'today'),
            'month' => $this->getWorkingTime($userId, 'month'),
            'year'  => $this->getWorkingTime($userId, 'year'),
        ];
    }
}
