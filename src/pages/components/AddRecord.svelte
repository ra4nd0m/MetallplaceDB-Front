<script lang="ts">
    import { doFetch, type matProp } from "../lib/getData";
    import Flatpickr from "svelte-flatpickr";
    import "flatpickr/dist/flatpickr.css";
    export let mat_id: number;
    export let secret: string;
    let created_on:string|any;
    let minPrice:string|number;
    let maxPrice:number|string;
    let avgPrice:number|string;
    //Works only when prop ids are static
    //Better to utilise backend functionality

    function calculateAvgPrice() {
        if (typeof minPrice != "undefined" && typeof maxPrice != "undefined") {
            avgPrice = (Number(minPrice) + Number(maxPrice)) / 2;
        }
    }
    async function submitRecord() {
        //Works only when prop ids are static
        //Better to utilise backend functionality
        let alertMessage = "";
        if (created_on === "") alertMessage += "Дата не задана!\n";

        if (typeof minPrice === "undefined" || minPrice === "")
            alertMessage += "Минимальная цена не задана!\n";

        if (typeof maxPrice === "undefined" || maxPrice === "")
            alertMessage += "Максимальная цена не задана!\n";
        if (alertMessage !== "") {
            alert(alertMessage);
            return;
        }
        let payloadAvgPrice = {
            material_source_id: mat_id,
            property_name: "Средняя цена",
            value_float: `${avgPrice}`,
            value_str: `${avgPrice}`,
            created_on: created_on,
        };
        let payloadMinPrice = {
            material_source_id: mat_id,
            property_name: "Мин цена",
            value_float: `${minPrice}`,
            value_str: `${minPrice}`,
            created_on: created_on,
        };
        let payloadMaxPrice = {
            material_source_id: mat_id,
            property_name: "Макс цена",
            value_float: `${maxPrice}`,
            value_str: `${maxPrice}`,
            created_on: created_on,
        };
        await doFetch(JSON.stringify(payloadAvgPrice), "/addValue", secret);
        await doFetch(JSON.stringify(payloadMinPrice), "/addValue", secret);
        await doFetch(JSON.stringify(payloadMaxPrice), "/addValue", secret);
    }
</script>

<div class="d-flex justify-content-center">
    <form
        on:submit|preventDefault={async () => {
            await submitRecord();
        }}
    >
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
