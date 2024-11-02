<script lang="ts">
    import { materials_data } from "../lib/stores";
    import { doFetch, type material } from "../lib/getData";
    import * as yup from "yup";
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
            name: name,
            source: source,
            group: group,
            market: market,
            delivery_type: delivery_type,
            unit: unit,
        };
        if (
            newMaterial.name.length === 0 ||
            newMaterial.source.length === 0 ||
            newMaterial.group.length === 0 ||
            newMaterial.market.length === 0 ||
            newMaterial.delivery_type.length === 0 ||
            newMaterial.unit.length === 0
        ) {
            alert("Поля не заполнены!");
            return;
        }
        name = "";
        source = "";
        group = "";
        market = "";
        delivery_type = "";
        unit = "";
        newMaterial.Id = await doFetch(
            JSON.stringify(newMaterial),
            "/addUniqueMaterial"
        ).then((val) => {
            if (typeof val === "object" && "id" in val) {
                return val.id;
            }
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
            placeholder="Тип поставки"
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
