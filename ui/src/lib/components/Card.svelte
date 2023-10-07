<script lang="ts">
	import cx from 'classnames';

	export let to: string | null = null;
	let className: string = '';

	export { className as class };
</script>

{#if to}
	<a href={to} class={cx('card', className)}>
		{#if $$slots.header}
			<slot name="header" />
		{/if}
		<div class="card-body">
			<slot />
		</div>
	</a>
{:else}
	<div class={cx('card', className)}>
		{#if $$slots.header}
			<slot name="header" />
		{/if}
		<div class="card-body">
			<slot />
		</div>
	</div>
{/if}
