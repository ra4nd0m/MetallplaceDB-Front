<script lang="ts">
    import { onMount } from "svelte";
    import { doFetch } from "../lib/getData";
    import type { matProp, priceFeed } from "../lib/getData";
    import Flatpickr from "svelte-flatpickr";
    export let mat_id: number;
    export let secret: string;
    let dates: string;
    let start_date: string;
    let finish_date = "";
    let propList: matProp[];
    onMount(async () => {
        let payload = JSON.stringify({ material_source_id: `${mat_id}` });
        propList =
            (await doFetch(payload, "/getPropertyList", secret).then((val) => {
                if (typeof val === "object" && "list" in val) {
                    return val.list as matProp[];
                }
            })) || [];
    });
    function extractDates(dates: string) {
        const buf = dates.split(" ");
        start_date = buf[0];
        finish_date = buf[2];
    }
    let dataList: dataListToDisplay[] = [];

    //Not good
    //Backend support should work better
    async function getAllRecords() {
        let initialData: dateValuePair[][] = [];
        extractDates(dates);
        for (const prop of propList) {
            let payload = {
                material_source_id: mat_id,
                property_id: prop.Id,
                start: start_date,
                finish: finish_date,
            };
            let value: priceFeed[] = (await doFetch(
                JSON.stringify(payload),
                "/getValueForPeriod",
                secret,
            ).then((val) => {
                if (typeof val === "object" && "price_feed" in val) {
                    return val.price_feed;
                } else {
                    return [];
                }
            })) as priceFeed[];
            value.forEach((item: { date: string }) => {
                const buf = item.date.split("T");
                item.date = buf[0];
            });
            initialData.push(value);
        }
        let recivedDates = [
            ...new Set(
                initialData.flatMap((item) => item.map((obj) => obj.date)),
            ),
        ];
        dataList = recivedDates.map((item) => {
            let object: {
                date: string;
                [key: string]: number | string | undefined;
            } = { date: item };
            initialData.forEach((arr, index) => {
                let valObj = arr.find((obj) => obj.date === item);
                object[`value${index + 1}`] = valObj ? valObj.value : "";
            });
            return object as dataListToDisplay;
        });
    }
    type dateValuePair = {
        date: string;
        value: number;
    };
    $: dateFilled = dates !== "";
    interface dataListToDisplay {
        date: string;
        value1?: string;
        value2?: string;
        value3?: string;
        value4?: string;
        value5?: string;
    }
</script>

<div>
    <div class="d-flex justify-content-center">
        <div class="ms-3 mt-3">
            <Flatpickr
                options={{ enableTime: false, mode: "range" }}
                bind:formattedValue={dates}
                class="form-control"
                placeholder="Дата"
            />
        </div>
        <div class="ms-3 mt-3">
            <button
                class="btn btn-primary"
                disabled={!dateFilled}
                on:click={async () => {
                    await getAllRecords();
                }}>Загрузить</button
            >
        </div>
    </div>
    <div>
        <table class="table">
            <thead>
                <tr>
                    {#if typeof propList !== "undefined" && dataList.length !== 0}
                        <th>Дата</th>
                        {#each propList as prop}
                            <th>{prop.Name}</th>
                        {/each}
                    {/if}
                </tr>
            </thead>
            <tbody>
                {#each dataList as item}
                    <tr>
                        <td>{item.date}</td>
                        <td>{item.value1 ? item.value1 : ""}</td>
                        <td>{item.value2 ? item.value2 : ""}</td>
                        <td>{item.value3 ? item.value3 : ""}</td>
                        <td>{item.value4 ? item.value4 : ""}</td>
                        <td>{item.value5 ? item.value5 : ""}</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>
