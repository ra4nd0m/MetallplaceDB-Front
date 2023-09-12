<script lang="ts">
    import { onMount } from "svelte";
    import { doFetch, type matProp } from "../lib/getData";
    import Flatpickr from "svelte-flatpickr";
    import "flatpickr/dist/flatpickr.css";
    let material_props_list: propVal[];
    export let mat_id: number;
    export let secret: string;
    let created_on;
    let minPrice: number;
    let maxPrice: number;
    let avgPrice: number;
    //Works only when prop ids are static
    //Better to utilise backend functionality
    const avgPriceId = 1;
    const minPriceId = 2;
    const maxPriceId = 3;
    onMount(async () => {
        let payload = JSON.stringify({ material_source_id: `${mat_id}` });
        material_props_list = await doFetch(
            payload,
            "/getPropertyList",
            secret
        ).then((val) => {
            return val.list;
        });
        console.log(material_props_list);
    });
    function calculateAvgPrice() {
        if (typeof minPrice != "undefined" && typeof maxPrice != "undefined") {
            avgPrice = (minPrice + maxPrice) / 2;
        }
    }
    async function submitRecord() {
        //Works only when prop ids are static
        //Better to utilise backend functionality
        let payloadAvgPrice = {
            material_source_id: mat_id,
            property_name: "Средняя цена",
            value_float: avgPrice,
            value_str:avgPrice
        };
        /*        let sentSomething: boolean = false;
        for (const prop of material_props_list) {
            if (typeof prop.Value != "undefined" && prop.Value !== "") {
                sentSomething = true;
                let payload = {
                    material_source_id: mat_id,
                    property_name: prop.Name,
                    value_float: prop.Value,
                    value_str: prop.Value,
                    created_on: created_on,
                };
                await doFetch(JSON.stringify(payload), "/addValue", secret);
                prop.Value = "";
            }
        }
        if (!sentSomething) alert("Поля пусты!\nЗаполните хотя бы одно!");*/
    }
    interface propVal extends matProp {
        Value?: string;
    }
</script>

{#if typeof material_props_list != "undefined"}
    <div class="d-flex justify-content-center">
        <form on:submit|preventDefault={() => {}}>
            <div class="ms-3 mt-3">
                <input
                    type="text"
                    class="form-control"
                    placeholder="Мин цена"
                    bind:value={minPrice}
                    on:input={() => calculateAvgPrice()}
                />
            </div>
            <div class="ms-3 mt-3">
                <input
                    type="text"
                    class="form-control"
                    placeholder="Макс цена"
                    bind:value={maxPrice}
                    on:input={() => calculateAvgPrice()}
                />
            </div>
            <div class="ms-3 mt-3">
                <input
                    type="text"
                    class="form-control"
                    placeholder="Средняя цена"
                    bind:value={avgPrice}
                    disabled
                />
            </div>

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
