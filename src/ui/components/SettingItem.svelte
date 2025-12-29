<script lang="ts">
  export let name = "";
  export let description = "";
  export let type: string | undefined = undefined;
  export let notices:
  	| Array<{
  		text: string;
  		type?: string;
  	}>
  	| undefined = undefined;
  export let subsetting = false;
</script>

<div
  class={`translator-component-setting ${subsetting ? "translator-subsetting" : ""} setting-type-${type ?? "default"} ${$$props.class ?? ""}`}
>
  <div class="setting-item-info">
    {#if name}
      <div class="setting-item-name">{name}</div>
    {/if}
    {#if description}
      <div class="setting-item-description">
        {@html description}
      </div>
    {/if}
    {#if notices?.length}
      <div class="setting-item-notices">
        {#each notices as notice}
          <div class="translator-component-notice">
            {@html notice.text}
          </div>
        {/each}
      </div>
    {/if}
  </div>
  <div class="setting-item-control">
    <slot name="control" />
    {#if !$$slots.control}
      <slot />
    {/if}
  </div>
</div>
