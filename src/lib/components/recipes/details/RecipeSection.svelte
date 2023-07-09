<script lang="ts">
	import type { InstructionSection } from '$lib/models/instruction-section';

	import RecipeStepsItem from './RecipeStepsItem.svelte';

	export let section: InstructionSection;
</script>

<div>
	<h5>{section.name}</h5>
	<hr />
	{#each section.instructions as step, i}
		<RecipeStepsItem {step} index={i} />
	{/each}
</div>
