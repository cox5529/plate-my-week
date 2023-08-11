<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';

	import FormButton from '$lib/components/buttons/FormButton.svelte';
	import TextField from '$lib/components/form-fields/TextField.svelte';

	export let data;

	const form = superForm(data.form, {
		taintedMessage: null
	});

	$: submitting = form.submitting;
</script>

<svelte:head>
	<title>Import | Plate my week</title>
</svelte:head>

<form class="d-flex flex-column gap-4" method={'post'} use:form.enhance>
	<TextField name="url" label="Link to recipe" {form} />
	<div>
		<FormButton color="primary" type="submit" submitting={$submitting}>Submit</FormButton>
	</div>
</form>
