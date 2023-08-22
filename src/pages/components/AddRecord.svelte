<script lang="ts">
    import { onMount } from "svelte";
    import { doFetch, type matProp } from "../lib/getData";
    import Flatpickr from "svelte-flatpickr";
    import "flatpickr/dist/flatpickr.css";
    let material_props_list: propVal[];
    export let mat_id: number;
    export let secret: string;
    let created_on;
    onMount(async () => {
        let payload = JSON.stringify({ material_source_id: mat_id });
        material_props_list = await doFetch(
            payload,
            "/getPropertyList",
            secret
        ).then((val) => {
            return val.list;
        });
        console.log(material_props_list);
    });
    interface propVal extends matProp {
        Value?: string;
    }
</script>

{#if typeof material_props_list != "undefined"}
<div class="d-flex justify-content-center">
    <form>
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
