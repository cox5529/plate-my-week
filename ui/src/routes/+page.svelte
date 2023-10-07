<script lang="ts">
	import RecipeCard from '$lib/components/recipes/RecipeCard.svelte';

	export let data;
</script>

<svelte:head>
	<title>Recipes | Plate my week</title>
</svelte:head>

<h1>Recipes</h1>
<div class="row g-3">
	{#each data.recipes as recipe}
		<div class="col-12 col-md-6 col-lg-4 col-xl-3 d-flex flex-column">
			<RecipeCard {recipe} />
		</div>
	{/each}
</div>
