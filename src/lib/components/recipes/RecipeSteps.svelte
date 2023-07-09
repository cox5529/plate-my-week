<script lang="ts">
	import RecipeStepsItem from './RecipeStepsItem.svelte';

	export let steps: string[];
</script>

<h3>Directions</h3>
{#each steps as step, i}
	<RecipeStepsItem {step} index={i} />
{/each}
