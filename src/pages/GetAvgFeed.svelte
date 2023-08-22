<script lang="ts">
    import Flatpickr from "svelte-flatpickr";
    import { doFetch } from "./lib/getData";

    let material_id: number;
    let start_date;
    let finish_date;
    let isWeekly: boolean = false;
    let isMonthly: boolean = false;
    let secret: string;
    let feed: priceFeed[] = [];
    async function getFeed(
        secret: string,
        material_id: number,
        property_id: number
    ) {
        if (start_date > finish_date) {
            let buf = finish_date;
            finish_date = start_date;
            start_date = buf;
        }
        let payload = {
            material_source_id: material_id,
            property_id: property_id,
            start: start_date,
            finish: finish_date,
        };
        console.log(
                `start: ${start_date} finish: ${finish_date}`
            )
        feed = await doFetch(
            JSON.stringify(payload),
            "/getValueForPeriod",
            secret
        ).then((val) => {
            return val.price_feed;
        });
    }
    interface priceFeed {
        date: string;
        value: number;
    }
</script>

<div>
    <button
        class="btn btn-primary"
        on:click={() => {
            isMonthly = true;
            isWeekly = false;
        }}>Получить значения за месяц</button
    >
    <button
        class="btn btn-primary"
        on:click={() => {
            isWeekly = true;
            isMonthly = false;
        }}>Получить значения за неделю</button
    >
    {#if isWeekly}
        <div class="ms-3 mt-3">
            <Flatpickr
                options={{ enableTime: false }}
                bind:formattedValue={start_date}
                class="form-control"
                on:change={(dateStr) => {
                    start_date = dateStr;
                }}
                placeholder="Начальная дата"
            />
            <Flatpickr
                options={{ enableTime: false }}
                bind:formattedValue={finish_date}
                class="form-control"
                on:change={(dateStr) => {
                    finish_date = dateStr;
                }}
                placeholder="Конечная дата"
            />
        </div>
    {/if}
    {#if isMonthly}
        <select class="form-select" />
    {/if}
    {#if start_date != "" && finish_date != "" && typeof start_date != "undefined" && typeof finish_date != "undefined"}
        <button
            class="btn btn-primary"
            on:click={async()=>{}}>Показать</button
        >
    {/if}
    {#if feed.length != 0}
        <thead>
            <tr>
                <th>Дата</th>
                <th>Значение</th>
            </tr>
        </thead>
        <tbody>
            {#each feed as item}
                <tr>
                    <td>
                        {item.date}
                    </td>
                    <td>
                        {item.value}
                    </td>
                </tr>
            {/each}
        </tbody>
    {/if}
</div>
