<script lang="ts">
	import type { RecipeFormSchema } from '$lib/form-schemas';
	import type { ZodValidation } from 'sveltekit-superforms';
	import type { SuperForm } from 'sveltekit-superforms/client';

	import FormButton from '../buttons/FormButton.svelte';
	import TextField from '../form-fields/TextField.svelte';

	export let form: SuperForm<ZodValidation<RecipeFormSchema>, unknown>;
	const formData = form.form;

	const addInstructionSection = () => {
		formData.update((x) => ({
			...x,
			sections: [...x.sections, { name: '', instructions: [''] }]
		}));
	};

	const removeInstructionSection = (section: number) => {
		formData.update((x) => ({
			...x,
			sections: [...x.sections.slice(0, section), ...x.sections.slice(section + 1)]
		}));
	};

	const addInstruction = (section: number) => {
		formData.update((x) => {
			const updatedSection = {
				...x.sections[section],
				instructions: [...x.sections[section].instructions, '']
			};

			return {
				...x,
				sections: [
					...x.sections.slice(0, section),
					updatedSection,
					...x.sections.slice(section + 1)
				]
			};
		});
	};

	const removeInstruction = (section: number, index: number) => {
		formData.update((x) => {
			const updatedSection = {
				...x.sections[section],
				instructions: [
					...x.sections[section].instructions.slice(0, index),
					...x.sections[section].instructions.slice(index + 1)
				]
			};

			return {
				...x,
				sections: [
					...x.sections.slice(0, section),
					updatedSection,
					...x.sections.slice(section + 1)
				]
			};
		});
	};
</script>

{#each $formData.sections as _, i}
	<div class="d-flex gap-2 align-items-end">
		<div class="flex-grow-1">
			<TextField name="sections[{i}].name" {form} label="Section Name" />
		</div>
		{#if $formData.sections.length !== 1 && $formData.sections[i].instructions.length <= 1}
			<FormButton color="danger" type="button" on:click={() => removeInstructionSection(i)}>
				X
			</FormButton>
		{/if}
	</div>
	<div class="d-flex gap-2 flex-column">
		{#each $formData.sections[i].instructions as _, j}
			<div class="d-flex gap-2 align-items-end">
				<div class="flex-grow-1">
					<TextField name="sections[{i}].instructions[{j}]" label="Instruction" inline {form} />
				</div>
				<FormButton
					color="danger"
					type="button"
					on:click={() => removeInstruction(i, j)}
					disabled={$formData.sections[i].instructions.length === 1}
				>
					X
				</FormButton>
			</div>
		{/each}
	</div>
	<div>
		<FormButton color="secondary" type="button" on:click={() => addInstruction(i)}>
			Add instruction to section
		</FormButton>
	</div>
{/each}
<div>
	<FormButton color="secondary" type="button" on:click={addInstructionSection}>
		Add Section
	</FormButton>
</div>
