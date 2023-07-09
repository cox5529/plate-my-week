<script lang="ts">
	import type { Ingredient } from '$lib/models/ingredient';
	import { startCase } from 'lodash';

	import RecipeIngredientsItem from './RecipeIngredientsItem.svelte';

	import Card from '../Card.svelte';

	export let ingredients: Ingredient[];
</script>

<Card>
	<h3 class="card-title">Ingredients</h3>
	<div class="list-group list-group-flush">
		{#each ingredients as ingredient}
			<RecipeIngredientsItem {ingredient} />
		{/each}
	</div>
</Card>
