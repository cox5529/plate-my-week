<script lang="ts">
	import type { Publisher } from '$lib/models/entities/publisher';

	import Card from '../../Card.svelte';

	export let publisher: Publisher;
	export let externalUrl: string | null = null;
</script>

<Card>
	<div slot="header" class="card-header">
		<h4 class="card-title">This recipe is based on a recipe from</h4>
	</div>
	<div class="d-flex gap-4 align-items-center">
		{#if publisher.logo}
			<img
				class="object-fit-contain"
				src={publisher.logo}
				alt={publisher.name}
				height="50"
				width="100"
			/>
		{/if}
		{#if externalUrl}
			<a href={externalUrl}>View this recipe on {publisher.name}</a>
		{:else}
			<a href={publisher.url}>{publisher.name}</a>
		{/if}
	</div>
</Card>
