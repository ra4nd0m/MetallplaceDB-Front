<script lang="ts">
    import { doFetch, type matProp } from "./lib/getData";
    import { token, materials_data } from "./lib/stores";
    import Flatpickr from "svelte-flatpickr";
    import "flatpickr/dist/flatpickr.css";

    let secret: string;
    let materialsList;
    let selected;
    token.subscribe((val) => {
        secret = val;
    });
    materials_data.subscribe((val) => {
        materialsList = val;
    });

    let created_on: any = new Date().toISOString().substr(0, 10);
    let material_props_list: matProp[];
    async function getProps(id: number) {
        let payload = JSON.stringify({ material_source_id: id });
        material_props_list = await doFetch(
            payload,
            "/getPropertyList",
            secret
        ).then((val) => {
            return val.list;
        });
    }
    async function submitValues() {}
</script>

<div class="d-flex flex-column" style="width:30%">
    <select
        bind:value={selected}
        on:change={async () => {
            if (selected !='') {
                console.log(selected);
                await getProps(selected.Id);}
        }}
        class="form-select"
    >
        <option value="" />
        {#each materialsList as material}
            <option value={material}>
                {material.Name}
            </option>
        {/each}
    </select>
    <p />
    {#if typeof material_props_list != "undefined"}
        <form on:submit|preventDefault={async () => {}}>
            {#each material_props_list as prop}
                <div class="ms-3 mt-3">
                    <input
                        type="text"
                        class="form-control"
                        placeholder={prop.Name}
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
    {/if}
    <div class="form-group" />
</div>
