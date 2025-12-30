<script lang="ts">
  import Button from "./Button.svelte";

  export let text = "";
  export let value: boolean | null | undefined = false;
  export let onToggle:
  	| (() => boolean | void | Promise<boolean | void>)
  	| undefined = undefined;
  export let fn:
  	| (() => boolean | void | Promise<boolean | void>)
  	| undefined = undefined;

  let busy = false;

  async function handleToggle() {
    if (busy) return;
    busy = true;
    const callback = onToggle ?? fn;
    const result = callback ? await callback() : !value;
    value = result ?? !value;
    busy = false;
  }
</script>

<Button
  text={text || (value ? "On" : "Off")}
  class={`${value ? "translator-toggle-button-active" : ""} ${$$props.class ?? ""}`}
  onClick={handleToggle}
/>

