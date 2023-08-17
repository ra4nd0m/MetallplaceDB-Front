<script lang="ts">
    import { materials_data } from "../lib/stores";
    import { postMaterial, type material } from "../lib/getData";
    export let token: string;
    let name: string;
    let source: string;
    let group: string;
    let market: string;
    let delivery_type: string;
    let unit: string;
    const addMaterial = async () => {
        let newMaterial: material = {
            Name: name,
            Source: source,
            Group: group,
            Market: market,
            DeliveryType: delivery_type,
            Unit: unit,
        };
        name = "";
        source = "";
        group = "";
        market = "";
        delivery_type = "";
        unit = "";
        newMaterial.Id = await postMaterial(token, newMaterial).then((val) => {
            return val.id;
        });
        materials_data.update((items) => [...items, newMaterial]);
    };
</script>

<tr>
    <td />
    <td><input type="text" bind:value={name} placeholder="Наименование" /></td>
    <td><input type="text" bind:value={source} placeholder="Источник данных"/></td>
    <td><input type="text" bind:value={group}  placeholder="Группа"/></td>
    <td><input type="text" bind:value={market} placeholder="Рынок" /></td>
    <td><input type="text" bind:value={delivery_type} placeholder="	Тип поставки"/></td>
    <td><input type="text" bind:value={unit} placeholder="Еденица" /></td>
    <td><button on:click={async () => await addMaterial()}>Добавить</button></td
    >
    <td><button>Отмена</button></td>
</tr>
