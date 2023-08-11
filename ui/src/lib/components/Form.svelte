<script lang="ts">
	import { enhance } from '$app/forms';

	export let method: string = 'post';
</script>

<form class="d-flex flex-column gap-4" {method} use:enhance>
	<slot />
</form>
