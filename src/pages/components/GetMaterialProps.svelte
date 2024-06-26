<script lang="ts">
    import { onMount } from "svelte";
    import { doFetch, type matProp } from "../lib/getData";
    let material_props_list: string | matProp[];
    export let secret: string;
    export let mat_id: number;
    onMount(async () => {
        let payload = JSON.stringify({ material_source_id: `${mat_id}` });
        let result = await doFetch(payload, "/getPropertyList", secret);
        if (typeof result === "object" && "list" in result && result.list !== null) {
            material_props_list = result.list as matProp[];
        } else {
            material_props_list = [];
        }
    });
    let name: string;
    async function handleAddProp() {
        let payload = {
            material_id: mat_id,
            property: name,
            kind: "decimal",
        };
        let res = await doFetch(
            JSON.stringify(payload),
            "/addPropertyToMaterial",
            secret,
        );
        if (typeof res === "object" && "succsess" in res) {
            if (!res.succsess) {
                alert("Ошибка внутреннего сервиса!");
            }
        }
    }
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
            <tr>
                <td />
                <td
                    ><input
                        type="text"
                        class="form-control"
                        placeholder="Название"
                        bind:value={name}
                    /></td
                >
                <td
                    ><button
                        class="btn btn-success"
                        on:click={async () => {
                            await handleAddProp();
                        }}>Добавить свойство</button
                    ></td
                >
            </tr>
        </tbody>
    </table>
{/if}

<style>
    .props-table caption {
        caption-side: top;
        font-weight: bold;
    }
</style>
