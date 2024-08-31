<script lang="ts">
    import { push } from "svelte-spa-router";
    import { doFetch, type material, type priceFeed } from "../lib/getData";
    import { materials_data } from "../lib/stores";
    import { onMount } from "svelte";
    export let secret: string;
    onMount(async () => {
        await grabData(secret);
    });

    async function grabData(key: string) {
        if (key.length != 0) {
            let material_list: material[] = [];
            let result = await doFetch("{}", "/getMaterialList", secret);
            if (typeof result === "object" && "list" in result) {
                material_list = result.list as material[];
            } else {
                material_list = [];
            }
            if (material_list.length !== 0) {
                const updateDates = await getLastUpdateDate(material_list);
                for (let i = 0; i < material_list.length; i++) {
                    material_list[i].update_date = updateDates[i];
                }
            }
            materials_data.set(material_list);
            materials_data.subscribe((val) =>
                localStorage.setItem("materials_data", JSON.stringify(val)),
            );
        } else {
            push("/login");
        }
    }

    async function getLastUpdateDate(mat_list: material[]) {
        const today = new Date().toISOString().split("T")[0];
        let updateDatesArr = [];
        for (let matObj of mat_list) {
            let paylad = {
                finish: today,
                material_source_id: matObj.Id,
                n_values: 1,
                property_id: 1,
            };
            const res = (await doFetch(
                JSON.stringify(paylad),
                "/getNLastValues",
                secret,
            ).then((val) => {
                if (typeof val === "object" && "price_feed" in val) {
                    return val.price_feed;
                }
            })) as priceFeed[];
            if (res !== null) {
                updateDatesArr.push(res[0].date.split("T")[0]);
            } else {
                updateDatesArr.push("");
            }
        }
        return updateDatesArr;
    }
</script>

<button
    on:click={async () => {
        await grabData(secret);
    }}
    class="btn btn-primary">Обновить список материалов</button
>

