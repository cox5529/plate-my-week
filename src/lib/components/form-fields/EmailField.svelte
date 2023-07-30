<script lang="ts">
	import uniqueId from 'lodash/uniqueId';
	import type {
		FormPathLeaves,
		InputConstraints,
		ValidationErrors,
		ZodValidation
	} from 'sveltekit-superforms';
	import { formFieldProxy, type SuperForm } from 'sveltekit-superforms/client';
	import type { AnyZodObject, z } from 'zod';

	type T = $$Generic<AnyZodObject>;
	export let label: string | null = null;
	export let name: FormPathLeaves<z.infer<T>>;
	export let form: SuperForm<ZodValidation<T>, unknown>;

	let id = uniqueId('form-control-');
	const { errors, constraints, value } = formFieldProxy(form, name);
</script>

<div>
	{#if label}
		<label for={id} class="form-label">{label}</label>
	{/if}
	<input
		class="form-control"
		type="email"
		class:is-invalid={!!$errors}
		{name}
		{id}
		bind:value={$value}
		{...$constraints}
	/>
	{#if $errors}
		<p class="invalid-feedback">{$errors}</p>
	{/if}
</div>
