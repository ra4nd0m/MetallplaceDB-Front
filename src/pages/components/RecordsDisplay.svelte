<script lang="ts">
    import { onMount } from "svelte";
    import { doFetch } from "../lib/getData";
    import type { matProp, priceFeed } from "../lib/getData";
    import Flatpickr from "svelte-flatpickr";
    import { token } from "../lib/stores";
    export let mat_id: number;
    export let secret: string;
    let dates: string;
    let start_date: string;
    let finish_date = "";
    let propList: matProp[] = [];
    let isTableFolded = true;
    let fetchFired = false;
    let isAvgChecked = false;
    let maxIndexArr: any[] = [];
    // Fetch the list of properties when the component mounts
    onMount(async () => {
        let payload = JSON.stringify({ material_source_id: `${mat_id}` });
        propList =
            (await doFetch(payload, "/getPropertyList", secret).then((val) => {
                if (typeof val === "object" && "list" in val) {
                    return val.list as matProp[];
                }
            })) || [];
        propList.forEach(
            (val) => (val.isSelected = preheckdProps.includes(val.Name)),
        );
        fetchFired = true;
    });

    function extractDates(dates: string) {
        const buf = dates.split(" ");
        start_date = buf[0];
        finish_date = buf[2];
    }
    let dataList: dataListToDisplay[] = [];
    let preheckdProps = ["Средняя цена", "Мин цена", "Макс цена", "Запас"];

    //Not good
    //Backend support should work better
    async function getAllRecords() {
        // Extract the start and finish dates from the dates string
        let initialData: dateValuePair[][] = [];
        let isFetchAttempted = false;
        extractDates(dates);
        // Loop over each property in the propList
        for (const prop of propList) {
            //Check for bad props and skip if found
            let propUsed: number;
            if (prop.Id > 6 || prop.Id < 1) {
                continue;
            }
            //If prop is not selected skip
            if (!prop.isSelected) {
                continue;
            }
            isFetchAttempted = true;
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
                if (
                    typeof val === "object" &&
                    "price_feed" in val &&
                    val.price_feed !== null
                ) {
                    return val.price_feed;
                } else {
                    return [];
                }
            })) as priceFeed[];
            //Skip empty dates
            if (value === null) {
                continue;
            }
            propUsed = prop.Id;
            // Format the date in each item of the value array
            value.forEach((item: { date: string }) => {
                const buf = item.date.split("T");
                item.date = buf[0];
            });
            value.forEach((item) => {
                item.propUsed = propUsed;
            });
            // Add the value array to the initialData array
            initialData.push(value);
        }
        //If avg values selected do the same thing
        if (isAvgChecked) {
            isFetchAttempted = true;
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
            valuesAvg.forEach((item) => (item.propUsed = -1));
            //Add avg dates to the initialData array
            initialData.push(valuesAvg);
        }
        // Create a new array of unique dates from the initialData array
        let recivedDates = [
            ...new Set(
                initialData.flatMap((item) => item.map((obj) => obj.date)),
            ),
        ];
        //If no recived dates are filled, alert and return
        if (isFetchAttempted && recivedDates.length === 0) {
            alert("Данные за указанный период не найдены!");
            dataList = [];
            return;
        }
        //Sort the recivedDates
        recivedDates.sort(
            (a, b) => new Date(a).getTime() - new Date(b).getTime(),
        );
        //Create maReachedIndex to calculate the amount of valueX properties created in dataList array
        let maxReachedIndex = 0;
        // Map over each date in recivedDates to create a new object for each date
        // Each object contains the date and the corresponding values from the initialData array
        dataList = recivedDates.map((item) => {
            let object: {
                date: string;
                propsUsed: number[];
                [key: string]: number | string | number[] | undefined;
            } = { date: item, propsUsed: [] };
            // Loop over each array in the initialData array
            initialData.forEach((arr, index) => {
                // Find the object in the array that has the same date as the current item
                let valObj = arr.find((obj) => obj.date === item);
                //Check if new index+1 which equals to X in valueX is bigger then previous max index+1
                //If it is so, then we have new biggest valueX
                if (index + 1 > maxReachedIndex) {
                    maxReachedIndex = index + 1;
                }
                // If an object with the same date is found, add its value to the new object
                // Otherwise, add an empty string
                object[`value${index + 1}`] = valObj ? valObj.value : "";
                if (valObj) {
                    //@ts-ignore
                    object.propsUsed.push(valObj.propUsed);
                }
            });
            // Return the new object as an item in the dataList array
            return object as dataListToDisplay;
        });
        //Create an empty array with length of maxReachedIndex to interate over when table is being rendered
        maxIndexArr = Array.from({ length: maxReachedIndex });
        isTableFolded = false;
    }

    async function deleteRecord(date: string, propsUsed: number[]) {
        if (
            window.confirm(
                `Вы уверены что хотите удалить ВСЕ запись/записи за ${date}?`,
            )
        ) {
            for (const prop of propsUsed) {
                if (prop !== -1) {
                    let payload = {
                        uid: mat_id,
                        propertyId: prop,
                        createdOn: date,
                    };
                    await doFetch(
                        JSON.stringify(payload),
                        "/backend/materialValue/deleteValue",
                        secret,
                        true,
                        true,
                    );
                }
            }
        }
    }

    function toggleTableFold() {
        isTableFolded = !isTableFolded;
    }

    $: {
        propList;
        isAvgChecked;
        if (start_date !== "" && typeof start_date !== "undefined") {
            getAllRecords();
        }
    }

    type dateValuePair = {
        date: string;
        value: number;
        propUsed?: number;
    };
    $: dateFilled = dates !== "";
    interface valueProperty {
        [key: string]: string | number | undefined | number[];
    }
    interface dataListToDisplay {
        date: string;
        propsUsed: number[];
        [key: string]: valueProperty[keyof valueProperty];
    }
</script>

<div>
    <div>
        <div class="d-flex justify-content-center from-check mt-3">
            {#if fetchFired}
                {#each propList as prop}
                    {#if prop.Id <= 6}
                        <label class="from-check-label ms-3" for={prop.Name}
                            >{prop.Name}</label
                        >
                        <input
                            type="checkbox"
                            class="from-check-input ms-1"
                            id={prop.Name}
                            value={prop.Id}
                            bind:checked={prop.isSelected}
                        />
                    {/if}
                {/each}
                <label class="from-check-label ms-3" for="avgCheck"
                    >Среднее значение за месяц</label
                >
                <input
                    type="checkbox"
                    class="from-check-input ms-2"
                    id="avgCheck"
                    bind:checked={isAvgChecked}
                />
            {/if}
        </div>
    </div>
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
        <button
            class="btn btn-primary mb-3"
            on:click={() => {
                toggleTableFold();
            }}
            >{#if isTableFolded}Развернуть таблицу{:else}Свернуть таблицу{/if}</button
        >

        {#if !isTableFolded}
            <table class="table">
                <thead>
                    <tr>
                        {#if typeof propList !== "undefined" && dataList.length !== 0}
                            <th>Дата</th>
                            {#each propList as prop}
                                {#if prop.Name !== "" && prop.isSelected}
                                    <th>{prop.Name}</th>
                                {/if}
                            {/each}
                            {#if isAvgChecked}
                                <th>Среднее значение за месяц</th>
                            {/if}
                        {/if}
                        <th />
                    </tr>
                </thead>
                <tbody>
                    {#each dataList as item}
                        <tr>
                            <td>{item.date}</td>
                            {#each maxIndexArr as _, i}
                                <td>{item[`value${i + 1}`]}</td>
                            {/each}
                            <td
                                ><button
                                    class="btn btn-danger"
                                    on:click={() =>
                                        deleteRecord(item.date, item.propsUsed)}
                                    >Удалить</button
                                ></td
                            >
                        </tr>
                    {/each}
                </tbody>
            </table>
        {/if}
        {#if !isTableFolded}
            <button
                class="btn btn-primary"
                on:click={() => {
                    toggleTableFold();
                }}
                >{#if isTableFolded}Развернуть таблицу{:else}Свернуть таблицу{/if}</button
            >
        {/if}
    </div>
</div>
