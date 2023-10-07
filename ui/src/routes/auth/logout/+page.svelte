<script lang="ts">
	import { onMount } from 'svelte';

	import { authenticationStore, roleStore } from '../../../stores';

	onMount(() => {
		authenticationStore.set(null);
		roleStore.set(null);
		window.location.href = '/';
	});
	console.log('logout');
</script>

Logging you out...
