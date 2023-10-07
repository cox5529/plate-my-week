<script lang="ts">
	import { Roles } from '$lib/models/enums/roles.js';
	import { authenticationStore, roleStore } from '../stores.js';

	export let data;

	$: authenticationStore.set(data.authentication ? data.authentication : null);
	$: roleStore.set(data.role ? data.role : null);
</script>

<nav class="navbar navbar-expand-lg bg-body-tertiary">
	<div class="container-fluid">
		<a class="navbar-brand" href="/">Plate my week</a>
		<button
			class="navbar-toggler"
			type="button"
			data-bs-toggle="collapse"
			data-bs-target="#navbarSupportedContent"
			aria-controls="navbarSupportedContent"
			aria-expanded="false"
			aria-label="Toggle navigation"
		>
			<span class="navbar-toggler-icon" />
		</button>
		<div class="collapse navbar-collapse" id="navbarSupportedContent">
			<ul class="navbar-nav me-auto mb-2 mb-lg-0">
				<li class="nav-item">
					<a class="nav-link" aria-current="page" href="/">Home</a>
				</li>
				{#if $roleStore === Roles.Administrator}
					<li class="nav-item">
						<a class="nav-link" aria-current="page" href="/recipes/import">Import</a>
					</li>
				{/if}
				{#if $authenticationStore}
					<li class="nav-item">
						<a class="nav-link" aria-current="page" href="/recipes/create">Create</a>
					</li>
				{/if}
			</ul>
			<ul class="navbar-nav mb-2 mb-lg-0">
				{#if $authenticationStore}
					<li class="nav-item">
						<a class="nav-link" aria-current="page" href="/auth/logout">Log out</a>
					</li>
				{:else}
					<li class="nav-item">
						<a class="nav-link" aria-current="page" href="/auth/login">Login</a>
					</li>
				{/if}
			</ul>
		</div>
	</div>
</nav>
<div class="container p-4">
	<slot />
</div>

<style lang="scss" global src="../style/index.scss">
</style>
