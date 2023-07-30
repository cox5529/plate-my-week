<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';

	import FormButton from '$lib/components/buttons/FormButton.svelte';
	import TextField from '$lib/components/form-fields/TextField.svelte';

	export let data;

	const { form, errors, constraints, enhance, submitting } = superForm(data.form, {
		taintedMessage: null
	});
</script>

<svelte:head>
	<title>Import | Plate my week</title>
</svelte:head>

<form class="d-flex flex-column gap-4" method={'post'} use:enhance>
	<TextField
		name="url"
		label="Link to recipe"
		bind:value={$form.url}
		errors={$errors}
		constraints={$constraints}
	/>
	<div>
		<FormButton color="primary" type="submit" submitting={$submitting}>Submit</FormButton>
	</div>
</form>
