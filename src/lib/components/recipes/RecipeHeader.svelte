<script lang="ts">
	import type { AppRecipe } from '$lib/models/recipe';

	export let recipe: AppRecipe;
</script>

<div>
	<h1>{recipe.headline}</h1>
	<p>{recipe.description}</p>
	{#if recipe.images.length}
		<img class="w-100" src={recipe.images[0]} alt={recipe.headline} />
	{/if}
</div>
