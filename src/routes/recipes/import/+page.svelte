<script lang="ts">
	import { enhance } from '$app/forms';

	import type { ActionData } from './$types';

	import TextArea from '$lib/components/form-fields/TextArea.svelte';

	export let form: ActionData = null;
</script>

<form method="post" use:enhance>
	<TextArea name="json" label="Recipe JSON" value={form?.json.value} error={form?.json.error} />
	<button class="btn btn-primary" type="submit">Submit</button>
</form>
