<script lang="ts">
	import type { Publisher } from '$lib/models/publisher';
	import Card from '../Card.svelte';

	export let publisher: Publisher;
</script>

<Card>
	<h4>Originally uploaded to</h4>
	<div class="d-flex gap-4">
		<img src={publisher.url} alt={publisher.name} />
	</div>
</Card>
