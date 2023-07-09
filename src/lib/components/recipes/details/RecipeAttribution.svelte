<script lang="ts">
	import type { Publisher } from '$lib/models/publisher';

	import Card from '../../Card.svelte';

	export let publisher: Publisher;
	export let externalUrl: string | null = null;
</script>

<Card>
	<h4>Originally uploaded to</h4>
	<div class="d-flex gap-4 align-items-center">
		<img class="object-fit-contain" src={publisher.logo} alt={publisher.name} height="50" width="100" />
		{#if externalUrl}
			<a href={externalUrl}>View this recipe on {publisher.name}</a>
		{:else}
			<a href={publisher.url}>{publisher.name}</a>
		{/if}
	</div>
</Card>
