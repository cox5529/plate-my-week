<script lang="ts">
	import type { Ingredient } from '$lib/models/entities/ingredient';

	import RecipeIngredientsItem from './RecipeIngredientsItem.svelte';

	import Card from '../../Card.svelte';

	export let ingredients: Ingredient[];
</script>

<Card>
	<div slot="header" class="card-header">
		<h3 class="card-title">Ingredients</h3>
	</div>
	<div class="list-group list-group-flush">
		{#each ingredients as ingredient}
			<RecipeIngredientsItem {ingredient} />
		{/each}
	</div>
</Card>
