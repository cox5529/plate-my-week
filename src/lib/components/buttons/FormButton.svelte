<script lang="ts">
	import Spinner from '../Spinner.svelte';

	export let type: 'submit' | 'button' = 'submit';
	export let color: string = 'primary';
	export let submitting: boolean = false;
	export let disabled: boolean = false;
</script>

<button class={`btn btn-${color}`} {type} disabled={submitting || disabled} on:click>
	{#if submitting}
		<Spinner />
	{:else}
		<slot />
	{/if}
</button>
