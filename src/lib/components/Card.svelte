<div class="card">
	{#if $$slots.header}
		<div class="card-header">
			<slot name="header" />
		</div>
	{/if}
	<div class="card-body">
		<slot />
	</div>
</div>
