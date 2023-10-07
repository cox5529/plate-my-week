<script lang="ts">
	import type { AppRecipe } from '$lib/models/entities/recipe';
	import type { AppUser } from '$lib/models/entities/user';

	export let recipe: AppRecipe;
	export let localAuthor: AppUser | null = null;
</script>

<div>
	<h1>{recipe.headline}</h1>
	{#each recipe.externalAuthors ?? [] as author}
		<p class="text-bold">by <a href={author.url}>{author.name}</a></p>
	{/each}
	{#if localAuthor && !recipe.externalAuthors?.length}
		<p class="text-bold">by {localAuthor.name}</p>
	{:else if localAuthor && recipe.externalAuthors?.length}
		<p class="text-bold">imported by {localAuthor.name}</p>
	{/if}
	<p>{recipe.description}</p>
	{#if recipe.images.length}
		<img class="w-100" src={recipe.images[0]} alt={recipe.headline} />
	{/if}
</div>
