<script lang="ts">
    import { materials_data } from "../lib/stores";
    import { postMaterial, type material } from "../lib/getData";
    import * as yup from "yup";
    export let secret: string;
    let name: string;
    let source: string;
    let group: string;
    let market: string;
    let delivery_type: string;
    let unit: string;
    const validation_schema = yup.object().shape({
        Name: yup.string().required("Требуется название!"),
        Source: yup.string().required("Требуется источник!"),
        Group: yup.string().required("Требуется группа!"),
        Market: yup.string().required("Требуется рынок!"),
        DeliveryType: yup.string().required("Требуется тип поставки!"),
        Unit: yup.string().required("Требуется еденица!"),
    });
    async function validateInput(material: material) {
        try {
            await validation_schema.validate(material, { abortEarly: false });
            return 0;
        } catch (error) {
            let validationErrors = error;
            return validationErrors;
        }
    }
    const addMaterial = async () => {
        let newMaterial: material = {
            Name: name,
            Source: source,
            Group: group,
            Market: market,
            DeliveryType: delivery_type,
            Unit: unit,
        };
        console.log(newMaterial);
        let errors = await validateInput(newMaterial);
        if (errors != 0) {
            alert("Ошибка!\nНе все поля заполнены!");
            return;
        }
        name = "";
        source = "";
        group = "";
        market = "";
        delivery_type = "";
        unit = "";
        newMaterial.Id = await postMaterial(secret, newMaterial).then((val) => {
            return val.id;
        });
        materials_data.update((items) => [...items, newMaterial]);
    };
</script>

<tr>
    <td />
    <td
        ><input
            class="form-control"
            type="text"
            bind:value={name}
            placeholder="Наименование"
            required
        /></td
    >
    <td
        ><input
            class="form-control"
            type="text"
            bind:value={source}
            placeholder="Источник данных"
        /></td
    >
    <td
        ><input
            class="form-control"
            type="text"
            bind:value={group}
            placeholder="Группа"
        /></td
    >
    <td
        ><input
            class="form-control"
            type="text"
            bind:value={market}
            placeholder="Рынок"
        /></td
    >
    <td
        ><input
            class="form-control"
            type="text"
            bind:value={delivery_type}
            placeholder="	Тип поставки"
        /></td
    >
    <td
        ><input
            class="form-control"
            type="text"
            bind:value={unit}
            placeholder="Еденица"
        /></td
    >
    <td
        ><button
            class="btn btn-success"
            on:click={async () => await addMaterial()}>Добавить</button
        ></td
    >
    <td />
</tr>
