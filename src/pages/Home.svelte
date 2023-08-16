<script lang="ts">
    import { token } from "./lib/stores";
    import MaterialList from "./components/MaterialList.svelte";
    import { push } from "svelte-spa-router";
    let secret: string;
    token.subscribe((value) => (secret = value));
</script>

<div>
{#if secret.length != 0}
    <MaterialList  />
{:else}{push("/login")}
{/if}
</div>