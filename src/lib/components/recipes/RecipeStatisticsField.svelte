<script lang="ts">
	import moment from 'moment';

	export let label: string;
	export let value: string = '';
	export let isDuration: boolean = false;

	let displayValue = value;
	if (isDuration) {
		const duration = moment.duration(value);
		const hours = duration.hours();
		const minutes = duration.minutes();

		if (hours === 0) {
			displayValue = `${minutes} minutes`;
		} else if (minutes === 0) {
      displayValue = `${hours} hours`
    } else {
      displayValue = `${hours} hrs ${minutes} mins`
    }
	}
</script>

{#if value}
	<div class="col-4">
		<h6>{label}</h6>
		<p>{displayValue}</p>
	</div>
{/if}
