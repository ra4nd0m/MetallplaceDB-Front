<script>
    import { push } from "svelte-spa-router";
    import { token } from "./stores";
    import { onDestroy } from "svelte";

    let key;
    token.subscribe((val) => (key = val));
    if (key == "") {
        push("/login");
    }
    let name;
    let source;
    let market;
    let delivery_type;
    let unit;
    function addMaterial() {
        let payload = {
            name: name,
            source: source,
            market: market,
            delivery_type: delivery_type,
            unit: unit,
        };

        fetch("http://localhost:3030/addMaterial", {
            method: "POST",
            headers: { Authorization: key, "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        })
            .then(() => {
                alert("OK!");
                push("/");
            })
            .catch((err) => alert(err));
    }
</script>

<div class="d-flex flex-column w-25 ">
    <form on:submit|preventDefault={addMaterial}>
        <div class="ms-3 mt-3">
            <input
                type="text"
                class="form-control"
                placeholder="Наименование"
                bind:value={name}
            />
        </div>
        <div class="ms-3 mt-3">
            <input
                type="text"
                class="form-control"
                placeholder="Источник"
                bind:value={source}
            />
        </div>
        <div class="ms-3 mt-3">
            <input
                type="text"
                class="form-control"
                placeholder="Страна"
                bind:value={market}
            />
        </div>
        <div class="ms-3 mt-3">
            <input
                type="text"
                class="form-control"
                placeholder="Усл поставки"
                bind:value={delivery_type}
            />
        </div>
        <div class="ms-3 mt-3">
            <input
                type="text"
                class="form-control"
                placeholder="Еденица измерения"
                bind:value={unit}
            />
        </div>
        <div class="ms-3 mt-3">
            <button type="submit" class="btn btn-primary">Добавить</button>
        </div>
    </form>
</div>
