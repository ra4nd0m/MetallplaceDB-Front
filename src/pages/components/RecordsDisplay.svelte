<script lang="ts">
    import { onMount } from "svelte";
    import { doFetch } from "../lib/getData";
    export let mat_id: number;
    export let secret: string;
    let start_date = "";
    let finish_date = "";
    let propList;
    let list = [];
    let selected:any = "";
    onMount(async () => {
        let payload = JSON.stringify({ material_source_id: `${mat_id}` });
        propList = await doFetch(payload, "/getPropertyList", secret).then(
            (val) => {
                return val.list;
            }
        );
    });
    async function getRecords(propId: number) {
        let payload = {
            material_source_id: mat_id,
            property_id: propId,
            start: start_date,
            finish: finish_date,
        };
        list = await doFetch(
            JSON.stringify(payload),
            "/getMonthlyAvgFeed",
            secret
        ).then((val) => {
            return val.price_feed;
        });
    }
</script>

<div>
    <div>
        <select class="form-select" bind:value={selected} on:change={async()=>{if(selected!='')await getRecords(selected.Id)}}>
            <option value="" />
            {#if typeof propList != "undefined"}
                {#each propList as prop}
                    <option value={prop}>{prop.Name}</option>
                {/each}
            {/if}
        </select>
    </div>
    {#if selected.length != 0}
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Дата</th>
                        <th>Значение</th>
                    </tr>
                </thead>
                <tbody>
                    {#each list as item}
                        <tr>
                            <td>{item.date}</td>
                            <td>{item.value}</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    {/if}
</div>
