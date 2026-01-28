<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 11px; }
        h2, h3 { margin-bottom: 5px; }
        table { width: 100%; border-collapse: collapse; margin-top: 8px; }
        th, td { border: 1px solid #000; padding: 6px; }
        th { background: #f2f2f2; }
        .right { text-align: right; }
        .center { text-align: center; }
        .no-border td { border: none; }
        .page-break { page-break-after: always; }
    </style>
</head>

<body>

    {{-- HEADER --}}
    <h2>{{ config('app.name') }}</h2>
    <h3>Payroll Register</h3>

    <table class="no-border">
        <tr>
            <td>Payroll for : </td>
            <td>{{ $payroll->division->name }}</td>
        </tr>
        <tr>
            <td>Payroll Period:</td>
            <td><strong>{{ date('F d, Y', strtotime($payroll->period_start)) }} -{{ date('F d, Y', strtotime($payroll->period_end)) }}</strong></td>
            <td>Payroll Date:</td>
            <td><strong>{{ date('F d, Y', strtotime($payroll->pay_date)) }}</strong></td>
        </tr>
    </table>

    {{-- SUMMARY --}}
    <h3>Summary</h3>
    <table>
        <tr>
            <th>Total Employees</th>
            <th>Total Gross</th>
            <th>Total Deductions</th>
            <th>Total Net</th>
        </tr>
        <tr class="center">
            <td>{{ $summary['employees'] }}</td>
            <td>₱ {{ number_format($summary['gross'], 2) }}</td>
            <td>₱ {{ number_format($summary['deductions'], 2) }}</td>
            <td>₱ {{ number_format($summary['net'], 2) }}</td>
        </tr>
    </table>

    {{-- EMPLOYEE LIST --}}
    <h3>Employee Payroll</h3>
    <table>
        <tr>
            <th>Emp No</th>
            <th>Name</th>
            <th>Position</th>
            <th>Attendance Duration</th>
            <th>Overtime Duration</th>
            <th>Daily Rate</th>
            <th>Gross</th>
            <th>Deductions</th>
            <th>Net</th>
        </tr>
        @foreach ($items as $item)
            <tr>
                <td>{{ $item->employee->employee_code }}</td>
                <td style="text-transform: capitalize">{{ $item->employee->first_name }} {{ $item->employee->last_name }}</td>
                <td>{{ $item->employee->position->name }}</td>
                <td class="right">{{ $item->total_attendance > 0 ? $item->total_attendance / 60 : 0 }} </td>
                <td class="right">{{ $item->total_overtime > 0 ? number_format(($item->total_overtime / 60), 2) : 0 }} </td>
                <td>{{ $item->employee->salary }}</td>
                <td class="right">₱ {{ number_format($item->gross_pay, 2) }}</td>
                <td class="right">₱ {{ number_format($item->total_deductions, 2) }}</td>
                <td class="right">₱ {{ number_format($item->net_pay, 2) }}</td>
            </tr>
        @endforeach
    </table>

    <div class="page-break"></div>

    {{-- PER EMPLOYEE DETAILS --}}
    @foreach ($items as $item)
        <h3>Employee Payroll Slip</h3>

        <table class="no-border">
            <tr>
                <td>Employee:</td>
                <td style="text-transform: capitalize"><strong>{{ $item->employee->first_name }} {{ $item->employee->last_name }}</strong></td>
                <td>Employee No:</td>
                <td >{{ $item->employee->employee_code }}</td>
            </tr>
            <tr>
                <td>Position:</td>
                <td>{{ $item->employee->position?->name ?? '-' }}</td>
                <td>Daily Rate:</td>
                <td>₱ {{ number_format($item->employee->salary, 2) }}</td>
            </tr>
        </table>
        @if (count($item->earnings) > 0)
            <h4>Earnings</h4>
            <table>
                @foreach ($item->earnings as $e)
                    <tr>
                        <td>{{ $e->label }}</td>
                        <td class="right">₱ {{ number_format($e->amount, 2) }}</td>
                    </tr>
                @endforeach
            </table>
        @endif
        @if (count($item->deductions) > 0)
            <h4>Deductions</h4>
            <table>
                @foreach ($item->deductions as $d)
                    <tr>
                        <td>{{ $d->label }} ({{ $d->source }})</td>
                        <td class="right">₱ {{ number_format($d->amount, 2) }}</td>
                    </tr>
                @endforeach
            </table>
        @endif


        <table>
            <tr>
                <th>Attendance Duration</th>
                <th>Overtime Duration</th>
                <th>Gross</th>
                <th>Deductions</th>
                <th>Net Pay</th>
            </tr>
            <tr class="center">
                <td class="right">{{ $item->total_attendance > 0 ? $item->total_attendance / 60 : 0 }} </td>
                <td class="right">{{ $item->total_overtime > 0 ? number_format(($item->total_overtime / 60), 2) : 0 }} </td>
                <td>₱ {{ number_format($item->gross_pay, 2) }}</td>
                <td>₱ {{ number_format($item->total_deductions, 2) }}</td>
                <td><strong>₱ {{ number_format($item->net_pay, 2) }}</strong></td>
            </tr>
        </table>
        <table class="no-border">
            
            <tr>
                <td>Signature : _______________________</td>
                <td></td>
            </tr>
        </table>
        <hr style="margin-top: 20px">
    @endforeach

</body>
</html>
