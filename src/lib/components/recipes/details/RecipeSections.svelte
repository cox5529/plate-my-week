<script lang="ts">
	import RecipeStepsItem from './RecipeStepsItem.svelte';

	import Card from '$lib/components/Card.svelte';
	import type { InstructionSection } from '$lib/models/instruction-section';
	import RecipeSection from './RecipeSection.svelte';

	export let sections: InstructionSection[];
</script>

<Card>
	<div slot="header" class="card-header">
		<h3 class="card-title">Directions</h3>
	</div>
	{#each sections as section}
		<RecipeSection {section} />
	{/each}
</Card>
