<script lang="ts">
	import type { ActionData } from './$types';

	import Form from '$lib/components/Form.svelte';
	import TextField from '$lib/components/form-fields/TextField.svelte';

	export let form: ActionData = null;
</script>

<svelte:head>
	<title>Import | Plate my week</title>
</svelte:head>

<Form>
	<TextField name="url" label="Link to recipe" value={form?.url.value} error={form?.url.error} />
	<div>
		<button class="btn btn-primary" type="submit">Submit</button>
	</div>
</Form>
