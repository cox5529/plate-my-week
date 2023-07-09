<script lang="ts">
	import type { AppRecipe } from '$lib/models/recipe';

	import Card from '../Card.svelte';

	export let recipe: AppRecipe;

	const author = recipe.externalAuthors ? recipe.externalAuthors[0].name : '';
	const categories = recipe.categories.join(', ');
</script>

<Card class="flex-grow-1 link-underline link-underline-opacity-0 link-underline-opacity-50-hover" to={`/recipes/${recipe.id}`}>
	<img
		slot="header"
		class="object-fit-cover card-img-top"
		src={recipe.images[0]}
		alt={recipe.headline}
		height="215"
	/>

	<small>{categories}</small>
	<h5 class="card-title">{recipe.headline}</h5>
	<p>By {author}</p>
</Card>
