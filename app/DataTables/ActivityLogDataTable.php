<?php

namespace App\DataTables;

use App\Models\ActivityLog;
use Illuminate\Database\Eloquent\Builder as QueryBuilder;
use Yajra\DataTables\EloquentDataTable;
use Yajra\DataTables\Html\Builder as HtmlBuilder;
use Yajra\DataTables\Html\Button;
use Yajra\DataTables\Html\Column;
use Yajra\DataTables\Services\DataTable;

class ActivityLogDataTable extends DataTable
{
    /**
     * Build the DataTable class.
     *
     * @param QueryBuilder<ActivityLog> $query Results from query() method.
     */
    public function dataTable(QueryBuilder $query): EloquentDataTable
    {
        return (new EloquentDataTable($query))
            ->addColumn('user', function ($query) {
                return $query->user ? $query->user->name : 'System/Guest';
            })
            ->addColumn('action', function ($query) {
                if (str_contains($query->action, 'ALERT')) {
                    return "<span class='badge badge-danger'>{$query->action}</span>";
                } elseif (str_contains($query->action, 'FAILED')) {
                    return "<span class='badge badge-warning'>{$query->action}</span>";
                } else {
                    return "<span class='badge badge-info'>{$query->action}</span>";
                }
            })
            ->addColumn('date', function ($query) {
                return $query->created_at->format('Y-m-d H:i:s');
            })
            ->addColumn('user_agent', function ($query) {
                return '<small>' . \Illuminate\Support\Str::limit($query->user_agent, 50) . '</small>';
            })
            ->rawColumns(['action', 'user_agent'])
            ->setRowId('id');
    }

    /**
     * Get the query source of dataTable.
     *
     * @return QueryBuilder<ActivityLog>
     */
    public function query(ActivityLog $model): QueryBuilder
    {
        return $model->newQuery()->with('user');
    }

    /**
     * Optional method if you want to use the html builder.
     */
    public function html(): HtmlBuilder
    {
        return $this->builder()
            ->setTableId('activitylog-table')
            ->columns($this->getColumns())
            ->minifiedAjax()
            ->orderBy(0, 'desc')
            ->selectStyleSingle()
            ->processing(true)
            ->dom('lBfrtip')
            ->buttons([
                Button::make('excel')->addClass('btn btn-primary'),
                Button::make('csv')->addClass('btn btn-primary'),
                Button::make('pdf')->addClass('btn btn-primary'),
                Button::make('print')->addClass('btn btn-primary'),
            ]);
    }

    /**
     * Get the dataTable columns definition.
     */
    public function getColumns(): array
    {
        return [
            Column::make('id'),
            Column::make('date')->title('Time'),
            Column::make('user'),
            Column::make('action'),
            Column::make('description'),
            Column::make('ip_address')->title('IP Address'),
            Column::make('user_agent')->title('User Agent'),
        ];
    }

    /**
     * Get the filename for export.
     */
    protected function filename(): string
    {
        return 'ActivityLog_' . date('YmdHis');
    }
}
