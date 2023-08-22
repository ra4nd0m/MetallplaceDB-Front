<script lang="ts">
    export let selectedMenu;
</script>

<div>
    <button class="btn btn-primary" on:click={() => (selectedMenu = "propsList")}
        >Список свойств</button
    >
    <button class="btn btn-primary" on:click={() => (selectedMenu = "addRecord")}
        >Добавить запись</button
    >
    <button class="btn btn-primary" on:click={() => (selectedMenu = "showRecords")}
        >Показать записи</button
    >
    <slot />
</div>
