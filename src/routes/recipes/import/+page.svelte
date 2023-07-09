<script lang="ts">
	import { enhance } from '$app/forms';

	import type { ActionData } from './$types';

	import TextField from '$lib/components/form-fields/TextField.svelte';

	export let form: ActionData = null;
</script>

<svelte:head>
	<title>Import | Plate my week</title>
</svelte:head>

<form method="post" use:enhance>
	<TextField name="url" label="Link to recipe" value={form?.url.value} error={form?.url.error} />
	<button class="btn btn-primary" type="submit">Submit</button>
</form>
