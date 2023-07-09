<script lang="ts">
	import { browser } from '$app/environment';

	import RecipeAttribution from '$lib/components/recipes/details/RecipeAttribution.svelte';
	import RecipeHeader from '$lib/components/recipes/details/RecipeHeader.svelte';
	import RecipeIngredients from '$lib/components/recipes/details/RecipeIngredients.svelte';
	import RecipeStatistics from '$lib/components/recipes/details/RecipeStatistics.svelte';
	import RecipeSteps from '$lib/components/recipes/details/RecipeSteps.svelte';

	export let data;
</script>

<svelte:head>
	<title>{data.headline} | Plate my week</title>
	<meta name="description" content={data.description} />
</svelte:head>

<div class="row g-4">
	<div class="col-12 offset-lg-3 col-lg-6 d-flex gap-4 flex-column">
		<RecipeHeader recipe={data} />
	</div>
	<div class="col-12 col-lg-6 d-flex gap-4 flex-column">
		<RecipeStatistics recipe={data} />
		<RecipeIngredients ingredients={data.ingredients} />
	</div>
	<div class="col-12 col-lg-6 d-flex gap-4 flex-column">
		{#each data.publishers ?? [] as publisher}
			<RecipeAttribution {publisher} externalUrl={data.externalUrl} />
		{/each}
		<RecipeSteps steps={data.instructions} />
	</div>
</div>
