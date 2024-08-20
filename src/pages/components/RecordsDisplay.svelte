<script lang="ts">
    import { onMount } from "svelte";
    import { doFetch } from "../lib/getData";
    import type { matProp, priceFeed } from "../lib/getData";
    import Flatpickr from "svelte-flatpickr";
    export let mat_id: number;
    export let secret: string;
    export let bShowLastRecords: boolean;
    let dates: string;
    let start_date: string;
    let finish_date = "";
    let propList: matProp[]  =[];
    let isTableFolded = false;
    let monthsAgo = 3;
    let fetchFired = false;
    // Fetch the list of properties when the component mounts
    onMount(async () => {
        let payload = JSON.stringify({ material_source_id: `${mat_id}` });
        propList =
            (await doFetch(payload, "/getPropertyList", secret).then((val) => {
                if (typeof val === "object" && "list" in val) {
                    return val.list as matProp[];
                }
            })) || [];
        propList.forEach((val) => (val.isSelected = false));
        fetchFired = true;
        if (bShowLastRecords) {
            recalcDates();
            await getAllRecords();
        }
    });

    function recalcDates() {
        const today = new Date();
        finish_date = today.toISOString().split("T")[0];
        start_date = new Date(today.setMonth(today.getMonth() - monthsAgo))
            .toISOString()
            .split("T")[0];
    }

    $: {
        if (fetchFired && bShowLastRecords && monthsAgo) {
            recalcDates();
            getAllRecords();
        }
    }

    function extractDates(dates: string) {
        const buf = dates.split(" ");
        start_date = buf[0];
        finish_date = buf[2];
    }
    let dataList: dataListToDisplay[] = [];

    //Not good
    //Backend support should work better
    async function getAllRecords() {
        // Extract the start and finish dates from the dates string
        let initialData: dateValuePair[][] = [];
        if (!bShowLastRecords) {
            extractDates(dates);
        }
        // Loop over each property in the propList
        for (const prop of propList) {
            //Check for bad props and skip if found
            if (prop.Id > 6 || prop.Id < 1) {
                continue;
            }
            if(!prop.isSelected){
                continue;
            }
            // Create the payload for the fetch request
            let payload = {
                material_source_id: mat_id,
                property_id: prop.Id,
                start: start_date,
                finish: finish_date,
            };
            // Make the fetch request and store the returned value
            let value: priceFeed[] = (await doFetch(
                JSON.stringify(payload),
                "/getValueForPeriod",
                secret,
            ).then((val) => {
                // If the returned value is an object and contains a price_feed property, return the price_feed
                // Otherwise, return an empty array
                if (typeof val === "object" && "price_feed" in val) {
                    return val.price_feed;
                } else {
                    return [];
                }
            })) as priceFeed[];
            //Skip empty dates
            if (value === null) {
                continue;
            }
            // Format the date in each item of the value array
            value.forEach((item: { date: string }) => {
                const buf = item.date.split("T");
                item.date = buf[0];
            });
            // Add the value array to the initialData array
            initialData.push(value);
        }
        let payloadAvg = {
            material_source_id: mat_id,
            property_id: 1,
            start: start_date,
            finish: finish_date,
        };
        let valuesAvg = (await doFetch(
            JSON.stringify(payloadAvg),
            "/getMonthlyAvgFeed",
            secret,
        ).then((val) => {
            if (typeof val === "object" && "price_feed" in val) {
                return val.price_feed;
            } else {
                return [];
            }
        })) as priceFeed[];
        valuesAvg.forEach((item: { date: string }) => {
            const buf = item.date.split("T");
            item.date = buf[0];
        });
        initialData.push(valuesAvg);
        // Create a new array of unique dates from the initialData array
        let recivedDates = [
            ...new Set(
                initialData.flatMap((item) => item.map((obj) => obj.date)),
            ),
        ];
        //If no recived dates are filled, alert and return
        if (recivedDates.length === 0) {
            alert("Данные за указанный период не найдены!");
            return;
        }
        //Sort the recivedDates
        recivedDates.sort(
            (a, b) => new Date(a).getTime() - new Date(b).getTime(),
        );

        // Map over each date in recivedDates to create a new object for each date
        // Each object contains the date and the corresponding values from the initialData array
        dataList = recivedDates.map((item) => {
            let object: {
                date: string;
                [key: string]: number | string | undefined;
            } = { date: item };
            // Loop over each array in the initialData array
            initialData.forEach((arr, index) => {
                // Find the object in the array that has the same date as the current item
                let valObj = arr.find((obj) => obj.date === item);
                // If an object with the same date is found, add its value to the new object
                // Otherwise, add an empty string
                object[`value${index + 1}`] = valObj ? valObj.value : "";
            });
            // Return the new object as an item in the dataList array
            return object as dataListToDisplay;
        });
    }

    function toggleTableFold() {
        isTableFolded = !isTableFolded;
    }

    $:{
        console.log(propList);
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
        value6?: string;
    }
</script>

<div>
    <div>
        <div class="d-flex justify-content-center from-check">
            {#if fetchFired}
                {#each propList as prop}
                    {#if prop.Id <= 6}
                        <label class="from-check-label ms-3" for={prop.Name}
                            >{prop.Name}</label
                        >
                        <input
                            type="checkbox"
                            class="from-check-input ms-2"
                            id={prop.Name}
                            value={prop.Id}
                            bind:checked={prop.isSelected}
                        />
                    {/if}
                {/each}
            {/if}
        </div>
    </div>
    {#if !bShowLastRecords}
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
    {/if}
    {#if bShowLastRecords}
        <div class="d-flex justify-content-center">
            <label class="form-label" for="monthsAgoId"
                >Месяцов от текущей даты
            </label>
            <input
                class=" ms-3 from-control"
                id="monthsAgoId"
                type="number"
                min="1"
                bind:value={monthsAgo}
            />
        </div>
    {/if}
    <div>
        {#if bShowLastRecords}
            <button
                class="btn btn-primary mb-3"
                on:click={() => {
                    toggleTableFold();
                }}
                >{#if isTableFolded}Развернуть таблицу{:else}Свернуть таблицу{/if}</button
            >
        {/if}
        {#if !isTableFolded}
            <table class="table">
                <thead>
                    <tr>
                        {#if typeof propList !== "undefined" && dataList.length !== 0}
                            <th>Дата</th>
                            {#each propList as prop}
                                {#if prop.Name !== ""}
                                    <th>{prop.Name}</th>
                                {/if}
                            {/each}
                            <th>Среднее значение за месяц</th>
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
                            <td>{item.value6 ? item.value6 : ""}</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        {/if}
        {#if !isTableFolded && bShowLastRecords}
            <button
                class="btn btn-primary"
                on:click={() => {
                    toggleTableFold();
                }}
                >{#if isTableFolded}Развернуть таблицу{:else}Свернуть таблицу{/if}</button
            >
        {/if}
    </div>
    {#if bShowLastRecords && !isTableFolded}
        <div class="d-flex justify-content-center">
            <label class="form-label" for="monthsAgoId"
                >Месяцов от текущей даты
            </label>
            <input class="ms-3" type="number" min="1" bind:value={monthsAgo} />
        </div>
    {/if}
</div>
