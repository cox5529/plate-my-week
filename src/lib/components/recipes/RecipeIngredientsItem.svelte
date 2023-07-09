<script lang="ts">
	import type { Ingredient } from '$lib/models/ingredient';
	import { Units } from '$lib/models/units';
	import { startCase } from 'lodash';

	export let ingredient: Ingredient;

	const content = [ingredient.quantity, Units[ingredient.unit], ingredient.name].join(' ');
</script>

<div class="list-group-item">
	<h6>{content}</h6>
	{#if ingredient.instruction}
		<small class="font-sm">{ingredient.instruction}</small>
	{/if}
</div>
