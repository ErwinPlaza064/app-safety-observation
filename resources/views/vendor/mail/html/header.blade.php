@props(['url'])
<tr>
<td class="header">
<a href="{{ $url }}" style="display: inline-block;">
@if (trim($slot) === 'Laravel')
<img src="{{ asset('images/wasion-logo.svg') }}" class="logo" alt="Wasion Logo">
@else
{!! $slot !!}
@endif
</a>
</td>
</tr>
