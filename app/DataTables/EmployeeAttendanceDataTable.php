<?php

namespace App\DataTables;

use App\Models\Attendance;
use App\Models\Employee;
use App\Models\EmployeeAttendance;
use Illuminate\Database\Eloquent\Builder as QueryBuilder;
use Illuminate\Support\Carbon;
use Yajra\DataTables\EloquentDataTable;
use Yajra\DataTables\Html\Builder as HtmlBuilder;
use Yajra\DataTables\Html\Button;
use Yajra\DataTables\Html\Column;
use Yajra\DataTables\Html\Editor\Editor;
use Yajra\DataTables\Html\Editor\Fields;
use Yajra\DataTables\Services\DataTable;

class EmployeeAttendanceDataTable extends DataTable
{
    /**
     * Build the DataTable class.
     *
     * @param QueryBuilder<EmployeeAttendance> $query Results from query() method.
     */
    public function dataTable(QueryBuilder $query): EloquentDataTable
    {
        return (new EloquentDataTable($query))
            // ->addColumn('action', 'employeeattendance.action')
            ->addColumn('employee_name', function ($query) {
                return $query->user->name;
            })
            ->addColumn('start_time', function ($row) {
                return $row->start_time ? Carbon::parse($row->start_time)->format('h:i A') : '-';
            })
            ->addColumn('end_time', function ($row) {
                return $row->end_time ? Carbon::parse($row->end_time)->format('h:i A') : '-';
            })

            ->addColumn('total_hours', function ($row) {
                if ($row->start_time && $row->end_time) {
                    $start = Carbon::parse($row->start_time);
                    $end = Carbon::parse($row->end_time);

                    // Total minutes
                    $totalMinutes = $start->diffInMinutes($end);
                    $hours = intdiv($totalMinutes, 60);
                    $minutes = $totalMinutes % 60;

                    return $hours . 'h:' . $minutes . 'm';
                }

                return '-';
            })
            ->rawColumns(['employee_name', 'total_hours'])
            ->setRowId('id');
    }

    /**
     * Get the query source of dataTable.
     *
     * @return QueryBuilder<EmployeeAttendance>
     */
    public function query(Attendance $model): QueryBuilder
    {
        // // return $model->newQuery();
        // $query = $model->where('user_id', auth()->id());

        // // Filter by Year
        // if (request()->filled('year')) {
        //     $query->whereYear('date', request('year')); // <-- date column চেক করো
        // }

        // // Filter by Month
        // if (request()->filled('month')) {
        //     $query->whereMonth('date', request('month'));
        // }

        // // Filter by Day
        // if (request()->filled('day')) {
        //     $query->whereDay('date', request('day'));
        // }

        // return $query;
        $query = $model->where('user_id', auth()->id());

        if (request()->filled('date')) {
            $query->whereDate('date', request('date'));
        }

        return $query;
    }

    /**
     * Optional method if you want to use the html builder.
     */
    public function html(): HtmlBuilder
    {
        return $this->builder()
            ->setTableId('employeeattendance-table')
            ->columns($this->getColumns())
            ->minifiedAjax()
            ->orderBy(1)
            ->selectStyleSingle()
            ->dom('lBfrtip')
            ->buttons([
                Button::make('excel')->addClass('btn btn-primary'),
                Button::make('csv')->addClass('btn btn-primary'),
                Button::make('pdf')->addClass('btn btn-primary'),
                Button::make('print')->addClass('btn btn-primary'),
                // Button::make('reset'),
                // Button::make('reload')
            ]);
    }

    /**
     * Get the dataTable columns definition.
     */
    public function getColumns(): array
    {
        return [
            Column::make('id'),
            Column::make('employee_name')->title('Name'),
            Column::make('date'),
            Column::make('start_time'),
            Column::make('end_time'),
            Column::make('total_hours'),
            // Column::computed('action')
            //     ->exportable(false)
            //     ->printable(false)
            //     ->width(60)
            //     ->addClass('text-center'),
        ];
    }

    /**
     * Get the filename for export.
     */
    protected function filename(): string
    {
        return 'EmployeeAttendance_' . date('YmdHis');
    }
}
