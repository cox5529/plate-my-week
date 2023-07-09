<script lang="ts">
	import uniqueId from 'lodash/uniqueId';

	export let label: string | null = null;
	export let name: string;
	export let value: FormDataEntryValue | null | undefined = null;
	export let error: string | null = null;
	export let required: boolean = true;

	let id = uniqueId('form-control-');
</script>

<div>
	{#if label}
		<label for={id} class="form-label">{label}</label>
	{/if}
	<input class="form-control" type='text' class:is-invalid={!!error} {name} {id} bind:value {required} />
	{#if error}
		<p class="invalid-feedback">{error}</p>
	{/if}
</div>
