<script lang="ts">
    import { onMount } from "svelte";
    import { doFetch } from "../lib/getData";
    import Flatpickr from "svelte-flatpickr";
    export let mat_id: number;
    export let secret: string;
    let dates;
    let start_date;
    let finish_date = "";
    let propList;
    let list;
    let selected: any = "";
    onMount(async () => {
        let payload = JSON.stringify({ material_source_id: `${mat_id}` });
        propList = await doFetch(payload, "/getPropertyList", secret).then(
            (val) => {
                return val.list;
            }
        );
    });
    function extractDates(dates: string) {
        const buf = dates.split(" ");
        start_date = buf[0];
        finish_date = buf[2];
        console.log(start_date, finish_date);
    }
    function datesSplit(date: string) {
        const buf = date.split("T");
        console.log(buf);
    }
    async function getRecords(propId: number) {
        extractDates(dates);
        let payload = {
            material_source_id: mat_id,
            property_id: propId,
            start: start_date,
            finish: finish_date,
        };
        list = await doFetch(
            JSON.stringify(payload),
            "/getValueForPeriod",
            secret
        ).then((val) => {
            return val;
        });
        list = list.price_feed;
        for (let i = 0; i < list.length; i++) {
            const buf = list[i].date.split('T');
            list[i].date = buf[0];
        }
    }
</script>

<div>
    <div>
        <div class="ms-3 mt-3">
            <select
                class="form-select"
                bind:value={selected}
                on:change={async () => {}}
            >
                <option value="" />
                {#if typeof propList != "undefined"}
                    {#each propList as prop}
                        <option value={prop}>{prop.Name}</option>
                    {/each}
                {/if}
            </select>
        </div>
        <div class="ms-3 mt-3">
            <Flatpickr
                options={{ enableTime: false, mode: "range" }}
                bind:formattedValue={dates}
                class="form-control"
            />
        </div>
        <div class="ms-3 mt-3">
            <button
                class="btn btn-primary"
                on:click={async () => {
                    if (selected != "") await getRecords(selected.Id);
                }}>Загрузить</button
            >
        </div>
    </div>
    {#if selected.length != 0}
        <div>
            <table class="table">
                <thead>
                    <tr>
                        <th>Дата</th>
                        <th>Значение</th>
                    </tr>
                </thead>
                <tbody>
                    {#if typeof list != "undefined"}
                        {#each list as item}
                            <tr>
                                <td>{item.date}</td>
                                <td>{item.value}</td>
                            </tr>
                        {/each}
                    {/if}
                </tbody>
            </table>
        </div>
    {/if}
</div>
