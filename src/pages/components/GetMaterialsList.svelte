<script lang="ts">
    import { push } from "svelte-spa-router";
    import { getMaterials } from "../lib/getData";
    import { token, materials_data } from "../lib/stores";
    let secret: string;
    token.subscribe((value) => (secret = value));
    async function grabData(key: string) {
        if (key.length != 0) {
            let material_list;
            material_list = await getMaterials(secret);
            materials_data.set(material_list);
            materials_data.subscribe((val)=>localStorage.setItem("materials_data",JSON.stringify(val)));
        }else{
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
