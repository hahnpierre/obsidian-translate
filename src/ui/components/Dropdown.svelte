<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export interface DropdownOption {
    value: any;
    text: string;
  }

  export let options: DropdownOption[] = [];
  export let value: any = "";
  export let placeholder: string | undefined = undefined;
  export let disabled = false;
  export let onChange: ((value: any) => void | Promise<void>) | undefined =
    undefined;

  const dispatch = createEventDispatcher<{ change: any }>();

  function handleChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    value = target.value;
    onChange?.(value);
    dispatch("change", value);
  }
</script>

<select
  class={`translator-component-select ${$$props.class ?? ""}`}
  bind:value
  on:change={handleChange}
  {disabled}
>
  {#if placeholder}
    <option value="">{placeholder}</option>
  {/if}
  {#each options as option}
    <option value={option.value}>{option.text ?? option.value}</option>
  {/each}
</select>

