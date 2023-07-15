<script lang="ts">
	import { renderIngredient, type Ingredient } from '$lib/models/entities/ingredient';

	export let ingredient: Ingredient;

	const contentString = renderIngredient(ingredient);
</script>

<div class="list-group-item">
	<h6>{contentString}</h6>
	{#if ingredient.instruction}
		<small class="font-sm">{ingredient.instruction}</small>
	{/if}
</div>
