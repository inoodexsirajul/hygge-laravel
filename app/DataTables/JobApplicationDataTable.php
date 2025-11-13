<?php

namespace App\DataTables;

use App\Models\JobApplication;
use Illuminate\Database\Eloquent\Builder as QueryBuilder;
use Yajra\DataTables\EloquentDataTable;
use Yajra\DataTables\Html\Builder as HtmlBuilder;
use Yajra\DataTables\Html\Button;
use Yajra\DataTables\Html\Column;
use Yajra\DataTables\Html\Editor\Editor;
use Yajra\DataTables\Html\Editor\Fields;
use Yajra\DataTables\Services\DataTable;

class JobApplicationDataTable extends DataTable
{
    /**
     * Build the DataTable class.
     *
     * @param QueryBuilder<JobApplication> $query Results from query() method.
     */
    public function dataTable(QueryBuilder $query): EloquentDataTable
    {
        return (new EloquentDataTable($query))
            ->addColumn('action', function ($query) {

                // View file (PDF/Excel/CSV/Other)
                $viewBtn = $query->resume
                    ? "<a href='" . route('admin.job-application.show', $query->id) . "' class='btn  btn-primary mr-1' target='_blank'>
                    <i class='fas fa-eye'></i> 
                  </a>"
                    : '';

                // Download file
                $downloadBtn = $query->resume
                    ? "<a href='" . route('admin.job-application.download', $query->id) . "' class='btn  btn-success mr-1'>
                    <i class='fas fa-download'></i> 
                  </a>"
                    : '';

                // Delete button
                $deleteBtn = "<a href='" . route('admin.job-application.destroy', $query->id) . "' class='btn  btn-danger delete-item'>
                <i class='fas fa-trash'></i> 
            </a>";

                return $viewBtn . $downloadBtn . $deleteBtn;
            })
            ->addColumn('cover_letter', function ($query) {
                $coverLetterBtn = $query->cover_letter
                    ? "<button class='btn btn-sm btn-info mr-1' onclick='showCoverLetter(`" . addslashes($query->cover_letter) . "`)'>
            <i class='far fa-eye'></i> Cover Letter
          </button>"
                    : '';

                return $coverLetterBtn;
            })
            ->rawColumns(['action', 'cover_letter'])
            ->setRowId('id');
    }

    /**
     * Get the query source of dataTable.
     *
     * @return QueryBuilder<JobApplication>
     */
    public function query(JobApplication $model): QueryBuilder
    {
        return $model->newQuery()->orderBy('id', 'desc');
    }

    /**
     * Optional method if you want to use the html builder.
     */
    public function html(): HtmlBuilder
    {
        return $this->builder()
            ->setTableId('jobapplication-table')
            ->columns($this->getColumns())
            ->minifiedAjax()
            ->orderBy(1)
            ->stateSave(true)
            ->selectStyleSingle()
            ->buttons([
                Button::make('excel'),
                Button::make('csv'),
                Button::make('pdf'),
                Button::make('print'),
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
            Column::make('name'),
            Column::make('email'),
            Column::make('phone'),
            Column::make('position'),
            Column::make('cover_letter'),
            Column::computed('action')
                ->exportable(false)
                ->printable(false)
                ->width(260)
                ->addClass('text-center'),
        ];
    }

    /**
     * Get the filename for export.
     */
    protected function filename(): string
    {
        return 'JobApplication_' . date('YmdHis');
    }
}
