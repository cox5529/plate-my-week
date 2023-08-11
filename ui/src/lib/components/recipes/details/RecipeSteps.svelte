<script lang="ts">
	import RecipeStepsItem from './RecipeStepsItem.svelte';

	import Card from '$lib/components/Card.svelte';

	export let steps: string[];
</script>

<Card>
	<div slot="header" class="card-header">
		<h3 class="card-title">Directions</h3>
	</div>
	{#each steps as step, i}
		<RecipeStepsItem {step} index={i} />
	{/each}
</Card>
