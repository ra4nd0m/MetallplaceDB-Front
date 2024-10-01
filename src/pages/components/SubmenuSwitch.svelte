<script lang="ts">
    let recordsDisabled = false;
    let listDisabled = false;
    export let selectedMenu = "addRecord";
    $: {
        switch (selectedMenu) {
            case "propsList":
                listDisabled = true;
                recordsDisabled = false;
                break;
            case "addRecord":
                listDisabled = false;
                recordsDisabled = true;
                break;
        }
    }
</script>

<div>
    <button
        class="btn btn-primary"
        disabled={recordsDisabled}
        on:click={() => (selectedMenu = "addRecord")}>Добавить запись</button
    >
    <button
        class="btn btn-primary"
        disabled={listDisabled}
        on:click={() => (selectedMenu = "propsList")}>Список свойств</button
    > 
    <slot />
</div>
