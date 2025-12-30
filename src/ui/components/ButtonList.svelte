<script lang="ts">
  import Button from "./Button.svelte";

  export interface ButtonListItem {
    value: any;
    text: string;
  }

  export let items: ButtonListItem[] = [];
  export let icon: string | undefined = undefined;
  export let tooltip: string | undefined = undefined;
  export let onClick: ((value: any) => void | Promise<void>) | undefined =
    undefined;
</script>

<div class={`translator-component-button-list ${$$props.class ?? ""}`}>
  {#each items as item}
    <Button
      icon={icon}
      text={item.text}
      tooltip={tooltip}
      onClick={async () => {
        await onClick?.(item.value);
      }}
    />
  {/each}
</div>

