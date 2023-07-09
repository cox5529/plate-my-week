<script lang="ts">
	import RecipeAttribution from '$lib/components/recipes/RecipeAttribution.svelte';
	import RecipeHeader from '$lib/components/recipes/RecipeHeader.svelte';
	import RecipeIngredients from '$lib/components/recipes/RecipeIngredients.svelte';
	import RecipeStatistics from '$lib/components/recipes/RecipeStatistics.svelte';
	import RecipeSteps from '$lib/components/recipes/RecipeSteps.svelte';

	export let data;
</script>

<div class="row g-2">
	<div class="col-12 offset-lg-3 col-lg-6 d-flex gap-4 flex-column">
		<RecipeHeader recipe={data} />
		{#each data.publishers ?? [] as publisher}
			<RecipeAttribution {publisher} externalUrl={data.externalUrl} />
		{/each}
		<RecipeStatistics recipe={data} />
		<RecipeIngredients ingredients={data.ingredients} />
		<RecipeSteps steps={data.instructions} />
	</div>
</div>
