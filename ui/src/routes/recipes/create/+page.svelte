<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';

	import FormButton from '$lib/components/buttons/FormButton.svelte';
	import NumberField from '$lib/components/form-fields/NumberField.svelte';
	import TextArea from '$lib/components/form-fields/TextArea.svelte';
	import TextField from '$lib/components/form-fields/TextField.svelte';
	import { Units } from '$lib/models/enums/units.js';
	import IngredientSubform from '$lib/components/forms/IngredientSubform.svelte';
	import InstructionSectionSubform from '$lib/components/forms/InstructionSectionSubform.svelte';

	export let data;

	const form = superForm(data.form, {
		taintedMessage: null,
		dataType: 'json'
	});

	const formData = form.form;
	const submitting = form.submitting;
</script>

<svelte:head>
	<title>Create | Plate my week</title>
</svelte:head>

<div class="row">
	<div class="col-12 col-lg-6 offset-lg-3">
		<h1>Add a Recipe</h1>
		<form class="d-flex flex-column gap-4" method={'post'} use:form.enhance>
			<TextField label="Title" name="title" {form} />
			<TextArea label="Description" name="description" {form} />
			<hr />
			<NumberField name="servings" label="Servings" {form} />
			<NumberField name="prepTime" label="Prep Time (minutes)" {form} />
			<NumberField name="cookTime" label="Cook Time (minutes)" {form} />
			<NumberField name="totalTime" label="Total Time (minutes)" {form} />
			<hr />
			<IngredientSubform {form} />
			<hr />
      <InstructionSectionSubform {form} />
			<div>
				<FormButton color="primary" type="submit" submitting={$submitting}>Submit</FormButton>
			</div>
		</form>
	</div>
</div>
