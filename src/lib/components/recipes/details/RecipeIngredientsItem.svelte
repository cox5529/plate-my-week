<script lang="ts">
	import type { Ingredient } from '$lib/models/ingredient';
	import { PluralUnitMap, SingularUnitMap, Units } from '$lib/models/units';

	export let ingredient: Ingredient;

	const toFraction = (value: number): string => {
		if (value % 1 === 0) {
			return `${value}`;
		}

		const maxdenom = 32;

		const best = { numerator: 1, denominator: 1, error: Math.abs(value - 1) };
		for (let denominator = 1; best.error > 0 && denominator <= maxdenom; denominator++) {
			const numerator = Math.round(value * denominator);
			const error = Math.abs(value - numerator / denominator);
			if (error >= best.error) continue;
			best.numerator = numerator;
			best.denominator = denominator;
			best.error = error;
		}

		if (best.numerator > best.denominator) {
			const whole = Math.floor(best.numerator / best.denominator);
			return `${whole} ${best.numerator % best.denominator}/${best.denominator}`;
		}

		return `${best.numerator}/${best.denominator}`;
	};

	const renderQuantity = (quantity: number, unit: Units): string => {
		const quantityDisplay = toFraction(quantity);
		if (unit === Units.Unit) {
			return quantityDisplay;
		}

		if (quantity === 1) {
			return `1 ${SingularUnitMap[unit]}`;
		}

		return `${quantityDisplay} ${PluralUnitMap[unit]}`;
	};

	const contentString = `${renderQuantity(ingredient.quantity, ingredient.unit)} ${
		ingredient.name
	}`;
</script>

<div class="list-group-item">
	<h6>{contentString}</h6>
	{#if ingredient.instruction}
		<small class="font-sm">{ingredient.instruction}</small>
	{/if}
</div>
