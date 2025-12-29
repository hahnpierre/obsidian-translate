<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let value = false;
  export let onChange: ((value: boolean) => void | Promise<void>) | undefined =
    undefined;
  export let label: string | undefined = undefined;
  export let disabled = false;

  const dispatch = createEventDispatcher<{ change: boolean }>();

  function handleChange(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    value = checked;
    onChange?.(checked);
    dispatch("change", checked);
  }
</script>

<label class={`translator-component-toggle ${$$props.class ?? ""}`}>
  <input
    type="checkbox"
    bind:checked={value}
    {disabled}
    on:change={handleChange}
  />
  <span>
    <slot>{label}</slot>
  </span>
</label>

