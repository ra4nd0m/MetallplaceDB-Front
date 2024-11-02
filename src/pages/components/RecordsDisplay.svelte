<script lang="ts">
    import { onMount } from "svelte";
    import { doFetch } from "../lib/getData";
    import type { matProp } from "../lib/getData";
    import Flatpickr from "svelte-flatpickr";
    import { date } from "yup";
    export let mat_id: number;
    export let updateTriggered = false;
    let dates: string;
    let start_date: string;
    let finish_date = "";
    let propList: matProp[] = [];
    let isTableFolded = true;
    let fetchFired = false;
    let isAvgChecked = false;
    let dataValues: valuesForDateRange[] = [];
    let columnsToShow = {
        value1: false,
        value2: false,
        value3: false,
        value4: false,
        value5: false,
        valueAvg: false,
    };

    // Fetch the list of properties when the component mounts
    onMount(async () => {
        let payload = JSON.stringify({ material_source_id: `${mat_id}` });
        propList =
            (await doFetch(payload, "/getPropertyList").then((val) => {
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
    let preheckdProps = ["Средняя цена", "Мин цена", "Макс цена", "Запас"];

    //Not good
    //Backend support should work better
    async function getAllRecords() {
        // Extract the start and finish dates from the dates string
        let isFetchAttempted = false;
        extractDates(dates);
        let propertyIdList: number[] = [];
        // Loop over each property in the propList
        for (const prop of propList) {
            //Check for bad props and skip if found
            if (prop.Id > 6 || prop.Id < 1) {
                continue;
            }
            //If prop is not selected skip
            if (!prop.isSelected) {
                continue;
            }
            //Push prop into list
            propertyIdList.push(prop.Id);
        }
        //Treat avg val as prop with -1
        if (isAvgChecked) {
            propertyIdList.push(-1);
        }
        //Make request
        isFetchAttempted = true;
        let payload = {
            matId: mat_id,
            propertyIdList: propertyIdList,
            dateStart: start_date,
            dateFinish: finish_date,
        };
        dataValues = (await doFetch(
            JSON.stringify(payload),
            "/backend/materialValue/getValuesForPropsListPeriod",
            false,
            true,
        ).then((val) => {
            if (typeof val === "object") {
                return val;
            } else {
                return [];
            }
        })) as valuesForDateRange[];

        //If no recived dates are filled, alert and return
        if (isFetchAttempted && dataValues.length === 0) {
            alert("Данные за указанный период не найдены!");
            return;
        }
        isTableFolded = false;
        columnsToShow = {
            value1: false,
            value2: false,
            value3: false,
            value4: false,
            value5: false,
            valueAvg: isAvgChecked,
        };
        dataValues.forEach((item) => {
            if (item.value1) columnsToShow.value1 = true;
            if (item.value2) columnsToShow.value2 = true;
            if (item.value3) columnsToShow.value3 = true;
            if (item.value4) columnsToShow.value4 = true;
            if (item.value5) columnsToShow.value5 = true;
        });
    }

    async function deleteRecord(date: string, propsUsed: number[]) {
        if (
            window.confirm(
                `Вы уверены что хотите удалить ВСЕ записи за ${date}?`,
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
                        true,
                        true,
                    );
                } else {
                    alert(
                        `Среднее значение не записано в базу и удалить его не выйдет\nЧтобы изменить его, измените средние занчения за месяц`,
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
    $: dateFilled = dates !== "";
    $: {
        if (
            updateTriggered &&
            start_date !== "" &&
            finish_date !== "" &&
            dates.length !== 0 &&
            dates.indexOf("to") !== -1
        ) {
            console.log("trg", " ", dates," ",updateTriggered);
            getAllRecords();
            updateTriggered = false;
        } else{
            updateTriggered =false;
        }
    }
    interface valuesForDateRange {
        date: string;
        propsUsed: number[];
        value1?: string;
        value2?: string;
        value3?: string;
        value4?: string;
        value5?: string;
        valueAvg?: string;
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
                        {#if typeof propList !== "undefined" && dataValues.length !== 0}
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
                    {#each dataValues as item}
                        <tr>
                            <td>{item.date}</td>
                            {#if columnsToShow.value1}<td
                                    >{item.value1 ?? ""}</td
                                >{/if}
                            {#if columnsToShow.value2}<td
                                    >{item.value2 ?? ""}</td
                                >{/if}
                            {#if columnsToShow.value3}<td
                                    >{item.value3 ?? ""}</td
                                >{/if}
                            {#if columnsToShow.value4}<td
                                    >{item.value4 ?? ""}</td
                                >{/if}
                            {#if columnsToShow.value5}<td
                                    >{item.value5 ?? ""}</td
                                >{/if}
                            {#if columnsToShow.valueAvg}<td
                                    >{item.valueAvg ?? ""}</td
                                >{/if}
                            <td
                                ><a
                                    href="/#/delete"
                                    on:click|preventDefault={async () =>
                                        await deleteRecord(
                                            item.date,
                                            item.propsUsed,
                                        )}>Удалить</a
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
