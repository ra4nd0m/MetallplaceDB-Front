<script lang="ts">
    import { doFetch, type matProp } from "../lib/getData";
    import Flatpickr from "svelte-flatpickr";
    import "flatpickr/dist/flatpickr.css";
    import * as Sentry from "@sentry/svelte";
    import RecordsDisplay from "./RecordsDisplay.svelte";
    import { onMount } from "svelte";
    export let mat_id: number;
    export let secret: string;
    let created_on: string | any;
    let propValuePairs: propValuePair[] = [];
    let isPropsFetched = false;
    let updateTrigger = false;

    let propList: matProp[] = [];
    onMount(async () => {
        let payload = JSON.stringify({ material_source_id: `${mat_id}` });
        propList =
            (await doFetch(payload, "/getPropertyList", secret).then((val) => {
                if (typeof val === "object" && "list" in val) {
                    return val.list as matProp[];
                }
            })) || [];
        propList.forEach((prop) => {
            if (prop.Name !== "") {
                propValuePairs.push({ propName: prop.Name });
            }
        });
        isPropsFetched = true;
    });

    async function submitRecord() {
        if (created_on === "") {
            alert("Дата не задана!");
            return;
        }
        for (const propPair of propValuePairs) {
            if (propPair.propValue !== undefined && propPair.propValue !== "") {
                const payload = {
                    material_source_id: mat_id,
                    property_name: `${propPair.propName}`,
                    value_float: `${propPair.propValue}`,
                    value_str: `${propPair.propValue}`,
                    created_on: created_on,
                };
                try {
                    await addRecord(JSON.stringify(payload));
                } catch (err) {
                    Sentry.captureException(err);
                    alert(err);
                }
            }
        }
        updateTrigger = !updateTrigger;
    }
    async function addRecord(payload: string) {
        let resp = await doFetch(payload, "/addValue", secret);
        if (typeof resp !== "object" || !("success" in resp)) {
            throw new Error("Неизвестная ошибка!");
        }
        return;
    }

    $: {
        if (isPropsFetched) {
            const minPriceIndex = propValuePairs.findIndex(
                (pair) => pair.propName === "Мин цена",
            );
            const maxPriceIndex = propValuePairs.findIndex(
                (pair) => pair.propName === "Макс цена",
            );
            if (
                minPriceIndex !== -1 &&
                maxPriceIndex !== -1 &&
                propValuePairs[minPriceIndex].propValue !== undefined &&
                propValuePairs[maxPriceIndex].propValue !== undefined &&
                propValuePairs[minPriceIndex].propValue !== "" &&
                propValuePairs[maxPriceIndex].propValue !== ""
            ) {
                const avgPrice =
                    (Number(propValuePairs[minPriceIndex].propValue) +
                        Number(propValuePairs[maxPriceIndex].propValue)) /
                    2;
                const avgPriceIndex = propValuePairs.findIndex(
                    (pair) => pair.propName === "Средняя цена",
                );
                if (avgPriceIndex !== -1) {
                    if (avgPrice === 0) {
                        propValuePairs[avgPriceIndex].propValue = "";
                    } else {
                        propValuePairs[avgPriceIndex].propValue = avgPrice;
                    }
                }
            }
        }
    }

    interface propValuePair {
        propName: string;
        propValue?: string | number;
    }
</script>

<div class="d-flex justify-content-center">
    <form
        on:submit|preventDefault={async () => {
            await submitRecord();
        }}
    >
        {#if isPropsFetched}
            {#each propValuePairs as propPair}
                <div class="ms-3 mt-3">
                    <input
                        type="text"
                        class="form-control"
                        placeholder={propPair.propName}
                        bind:value={propPair.propValue}
                    />
                </div>
            {/each}
        {/if}
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

