<script lang="ts">
	import Spinner from '../Spinner.svelte';

	export let type: 'submit' | 'button' = 'submit';
	export let color: string = 'primary';
	export let submitting: boolean = false;
</script>

<button class={`btn btn-${color}`} {type} disabled={submitting}>
	{#if submitting}
		<Spinner />
	{:else}
		<slot />
	{/if}
</button>
