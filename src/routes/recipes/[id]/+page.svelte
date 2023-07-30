<script lang="ts">
	import { browser } from '$app/environment';

	import RecipeAttribution from '$lib/components/recipes/details/RecipeAttribution.svelte';
	import RecipeHeader from '$lib/components/recipes/details/RecipeHeader.svelte';
	import RecipeIngredients from '$lib/components/recipes/details/RecipeIngredients.svelte';
	import RecipeSections from '$lib/components/recipes/details/RecipeSections.svelte';
	import RecipeStatistics from '$lib/components/recipes/details/RecipeStatistics.svelte';
	import RecipeSteps from '$lib/components/recipes/details/RecipeSteps.svelte';

	export let data;

	const { recipe, localAuthor } = data;
</script>

<svelte:head>
	<title>{recipe.headline} | Plate my week</title>
	<meta name="description" content={recipe.description} />
</svelte:head>

<div class="row g-4">
	<div class="col-12 offset-lg-3 col-lg-6 d-flex gap-4 flex-column">
		<RecipeHeader recipe={recipe} {localAuthor} />
	</div>
	<div class="col-12 col-lg-6 d-flex gap-4 flex-column">
		<RecipeStatistics recipe={recipe} />
		<RecipeIngredients ingredients={recipe.ingredients} />
	</div>
	<div class="col-12 col-lg-6 d-flex gap-4 flex-column">
		{#each recipe.publishers ?? [] as publisher}
			<RecipeAttribution {publisher} externalUrl={recipe.externalUrl} />
		{/each}
		{#if recipe.sections}
			<RecipeSections sections={recipe.sections} />
		{:else if recipe.instructions}
			<RecipeSteps steps={recipe.instructions} />
		{/if}
	</div>
</div>
