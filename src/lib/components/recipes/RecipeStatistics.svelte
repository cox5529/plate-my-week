<script lang="ts">
	import type { AppRecipe } from '$lib/models/recipe';

	import RecipeStatisticsField from './RecipeStatisticsField.svelte';

	import Card from '../Card.svelte';

	export let recipe: AppRecipe;
</script>

<Card>
	<div class="row">
		<RecipeStatisticsField label="Prep time" value={recipe.prepTime} isDuration />
		<RecipeStatisticsField label="Cook time" value={recipe.cookTime} isDuration />
		<RecipeStatisticsField label="Total time" value={recipe.totalTime} isDuration />
		<RecipeStatisticsField label="Servings" value={recipe.servings} />
	</div>
</Card>
