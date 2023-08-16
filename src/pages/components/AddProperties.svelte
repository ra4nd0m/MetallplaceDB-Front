<script lang="ts">
    import { onMount } from "svelte";

    export let params:link_params;
    onMount(()=>console.log(params.id));

    interface link_params{
        id:Number;
    }
</script>

<form>
    <input type="text" placeholder="Имя свойства">
    <button type="submit">Добавить</button>
</form>