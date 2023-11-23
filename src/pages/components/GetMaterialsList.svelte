<script lang="ts">
    import { push } from "svelte-spa-router";
    import { doFetch, type material } from "../lib/getData";
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
            }
            materials_data.set(material_list);
            materials_data.subscribe((val) =>
                localStorage.setItem("materials_data", JSON.stringify(val)),
            );
        } else {
            push("/login");
        }
    }
</script>

<button
    on:click={async () => {
        await grabData(secret);
    }}
    class="btn btn-primary">Обновить список материалов</button
>
