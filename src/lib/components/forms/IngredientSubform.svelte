<script lang="ts">
	import type { RecipeFormSchema } from '$lib/form-schemas';
	import type { ZodValidation } from 'sveltekit-superforms';
	import type { SuperForm } from 'sveltekit-superforms/client';

	import FormButton from '../buttons/FormButton.svelte';
	import TextField from '../form-fields/TextField.svelte';

	export let form: SuperForm<ZodValidation<RecipeFormSchema>, unknown>;
	const formData = form.form;

	const addIngredient = () => {
		formData.update((x) => ({
			...x,
			ingredients: [...x.ingredients, '']
		}));
	};

	const removeIngredient = (index: number) => {
		formData.update((x) => ({
			...x,
			ingredients: [...x.ingredients.slice(0, index), ...x.ingredients.slice(index + 1)]
		}));
	};
</script>

{#each $formData.ingredients as _, i}
	<div class="d-flex gap-2">
		<div class="flex-grow-1">
			<TextField name="ingredients[{i}]" {form} label="Ingredient" inline />
		</div>
		<FormButton
			color="danger"
			type="button"
			on:click={() => removeIngredient(i)}
			disabled={$formData.ingredients.length === 1}
		>
			X
		</FormButton>
	</div>
{/each}
<div>
	<FormButton color="secondary" type="button" on:click={addIngredient}>Add ingredient</FormButton>
</div>
