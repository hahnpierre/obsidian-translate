<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import Icon from "./Icon.svelte";

  const dispatch = createEventDispatcher<{ click: MouseEvent }>();

  export let text: string | undefined = undefined;
  export let icon: string | undefined = undefined;
  export let tooltip: string | undefined = undefined;
  export let onClick: ((event: MouseEvent) => void | Promise<void>) | undefined =
    undefined;
  export let type: "button" | "submit" = "button";
  export let disabled = false;
</script>

<button
  class={`translator-component-button ${$$props.class ?? ""}`}
  {type}
  {disabled}
  title={tooltip ?? text}
  aria-label={tooltip ?? text}
  on:click={async (event) => {
    await onClick?.(event);
    dispatch("click", event);
  }}
>
  {#if icon}
    <Icon icon={icon} />
  {/if}
  {#if text}
    <span>{text}</span>
  {/if}
  <slot />
</button>

