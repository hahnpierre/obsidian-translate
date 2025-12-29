<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let value = "";
  export let type = "text";
  export let placeholder: string | undefined = undefined;
  export let valid: boolean | undefined = undefined;
  export let onChange: ((value: string) => void | Promise<void>) | undefined =
    undefined;

  const dispatch = createEventDispatcher<{ change: string }>();

  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    value = target.value;
    onChange?.(value);
    dispatch("change", value);
  }
</script>

<input
  class={`${$$props.class ?? ""} ${valid === false ? "translator-input-invalid" : ""}`}
  value={value}
  type={type}
  placeholder={placeholder}
  on:input={handleInput}
/>
