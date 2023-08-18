<script lang="ts">
    export let key: string = "";
</script>

<nav class="navbar navbar-expand-lg navbar-light bg-light p-2">
    <ul class="navbar-nav me-auto">
        {#if key != ""}
            <li class="nav-item">
                <a class="nav-link" href="#/">Материалы</a>
            </li>
            <li>
                <a class="nav-link" href='/#/addRecord'>Добавить запись</a>
            </li>
        {/if}
    </ul>
    <ul class="navbar-nav ms-auto">
        <li class="nav-item">
            {#if key == ""}
                <a class="nav-link" href="/#/login">Вход</a>
            {:else}
                <a class="nav-link" href="/#/logout">Выход</a>
            {/if}
        </li>
    </ul>
</nav>
