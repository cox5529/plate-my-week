<script lang="ts">
	import type { AppRecipe } from '$lib/models/entities/recipe';

	export let recipe: AppRecipe;
</script>

<div>
	<h1>{recipe.headline}</h1>
	{#each recipe.externalAuthors ?? [] as author}
		<p class="text-bold">by <a href={author.url}>{author.name}</a></p>
	{/each}
	<p>{recipe.description}</p>
	{#if recipe.images.length}
		<img class="w-100" src={recipe.images[0]} alt={recipe.headline} />
	{/if}
</div>
