<script lang="ts">
	import type { AppRecipe } from '$lib/models/entities/recipe';

	import Card from '../Card.svelte';

	export let recipe: AppRecipe;

	const author = recipe.externalAuthors ? recipe.externalAuthors[0].name : '';
	const categories = recipe.categories.join(', ');
</script>

<Card
	class="flex-grow-1 link-underline link-underline-opacity-0 link-underline-opacity-50-hover"
	to={`/recipes/${recipe.id}`}
>
	<div slot="header">
		{#if recipe.images.length}
			<img
				class="object-fit-cover card-img-top"
				src={recipe.images[0]}
				alt={recipe.headline}
				height="215"
			/>
		{/if}
	</div>

	<small>{categories}</small>
	<h5 class="card-title">{recipe.headline}</h5>
	{#if author}
		<p>By {author}</p>
	{/if}
</Card>
