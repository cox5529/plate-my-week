<script lang="ts">
	import { onMount } from 'svelte';

	import { authenticationStore } from '../../../stores';

	onMount(() => {
    authenticationStore.set(null);
    window.location.href = '/';
  });
  console.log('logout')
</script>

Logging you out...
