<script lang="ts">
	import { renderIngredient, type Ingredient } from '$lib/models/ingredient';
	import { PluralUnitMap, SingularUnitMap, Units } from '$lib/models/units';

	export let ingredient: Ingredient;

	const contentString = renderIngredient(ingredient);
</script>

<div class="list-group-item">
	<h6>{contentString}</h6>
	{#if ingredient.instruction}
		<small class="font-sm">{ingredient.instruction}</small>
	{/if}
</div>
