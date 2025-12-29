<script lang="ts">
  export let icon: string;
  export let label: string | undefined = undefined;
</script>

<span
  class={`translator-component-icon ${$$props.class ?? ""}`}
  aria-label={label ?? icon}
  title={label ?? icon}
>
  <slot>{icon}</slot>
</span>

