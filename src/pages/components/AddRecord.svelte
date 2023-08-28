<script lang="ts">
    import { onMount } from "svelte";
    import { doFetch, type matProp } from "../lib/getData";
    import Flatpickr from "svelte-flatpickr";
    import "flatpickr/dist/flatpickr.css";
    let material_props_list: propVal[];
    export let mat_id: number;
    export let secret: string;
    let created_on;
    let search_item: string = "";
    onMount(async () => {
        let payload = JSON.stringify({ material_source_id: `${mat_id}` });
        material_props_list = await doFetch(
            payload,
            "/getPropertyList",
            secret
        ).then((val) => {
            return val.list;
        });
    });
    async function submitRecord() {
        let sentSomething: boolean = false;
        for (const prop of material_props_list) {
            if (typeof prop.Value != "undefined") {
                sentSomething = true;
                let payload = {
                    material_source_id: mat_id,
                    property_name: prop.Name,
                    value_float: prop.Value,
                    value_str: prop.Value,
                    created_on: created_on,
                };
                await doFetch(JSON.stringify(payload), "/addValue", secret);
            }
        }
        if (!sentSomething) alert("Поля пусты!\nЗаполните хотя бы одно!");
    }
    interface propVal extends matProp {
        Value?: string;
    }
</script>

{#if typeof material_props_list != "undefined"}
    <div class="d-flex justify-content-center">
        <form on:submit|preventDefault={async () => await submitRecord()}>
            {#each material_props_list as prop}
                <div class="ms-3 mt-3">
                    <input
                        type="text"
                        class="form-control"
                        placeholder={prop.Name}
                        bind:value={prop.Value}
                    />
                </div>
            {/each}
            <div class="ms-3 mt-3">
                <Flatpickr
                    options={{ enableTime: false }}
                    bind:formattedValue={created_on}
                    class="form-control"
                    on:change={(dateStr) => {
                        created_on = dateStr;
                    }}
                    placeholder="Дата"
                />
            </div>
            <div class="ms-3 mt-3">
                <button type="submit" class="btn btn-success">Добавить</button>
            </div>
        </form>
    </div>
{/if}
