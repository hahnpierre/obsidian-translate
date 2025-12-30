<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let min = 0;
  export let max = 100;
  export let step = 1;
  export let value: number | string = 0;
  export let getTooltip: ((value: number) => string) | undefined = undefined;
  export let onChange: ((value: number) => void | Promise<void>) | undefined =
    undefined;

  const dispatch = createEventDispatcher<{ change: number }>();

  function handleInput(event: Event) {
    const newValue = parseInt((event.target as HTMLInputElement).value);
    value = newValue;
    onChange?.(newValue);
    dispatch("change", newValue);
  }
</script>

<div class={`translator-component-slider ${$$props.class ?? ""}`}>
  <input
    type="range"
    min={min}
    max={max}
    step={step}
    value={value}
    on:input={handleInput}
  />
  <div class="translator-component-slider-value">
    {#if getTooltip}
      {getTooltip(Number(value))}
    {:else}
      {value}
    {/if}
  </div>
</div>

