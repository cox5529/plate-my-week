<script lang="ts">
	import uniqueId from 'lodash/uniqueId';
	import type { InputConstraints, ValidationErrors } from 'sveltekit-superforms';
	import type { AnyZodObject } from 'zod';

	export let constraints: InputConstraints<AnyZodObject>;
	export let errors: ValidationErrors<AnyZodObject>;
	export let label: string | null = null;
	export let name: string;
	export let value: FormDataEntryValue | null | undefined = null;

	let id = uniqueId('form-control-');

	$: error = errors[name];
	$: constraint = constraints[name];
</script>

<div>
	{#if label}
		<label for={id} class="form-label">{label}</label>
	{/if}
	<input
		class="form-control"
		type="text"
		class:is-invalid={!!error}
		{name}
		{id}
		bind:value
		{...constraint}
	/>
	{#if error}
		<p class="invalid-feedback">{error}</p>
	{/if}
</div>
