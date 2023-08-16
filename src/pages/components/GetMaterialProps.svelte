<script lang="ts">
    import { onMount } from "svelte";
    import { getMatProps, type matProps } from "../lib/getData";
    import { token } from "../lib/stores";
    import { push } from "svelte-spa-router";
    let material_props_list: string | matProps[];
    let secret: string;
    export let mat_id: number;
    token.subscribe((value) => (secret = value));
    onMount(async () => {
        material_props_list = await getMatProps(secret, mat_id);
        console.log(material_props_list);
    });
</script>

{#if typeof material_props_list == "object"}
    <table class="table table-striped props-table">
        <caption>Свойства</caption>
        <thead>
            <tr>
                <th>ID</th>
                <th>Название</th>
                <th>Вид</th>
            </tr>
        </thead>
        <tbody>
            {#each material_props_list as row}
                <tr>
                    <td>{row.Id}</td>
                    <td>{row.Name}</td>
                    <td>{row.Kind}</td>
                </tr>
            {/each}
        </tbody>
    </table>
    <button on:click={(()=>push(`/props/${mat_id}`))}   class="btn btn-secondary">Добавить свойство</button>
{/if}

<style>
    .props-table caption {
        caption-side: top;
        font-weight: bold;
    }
</style>
