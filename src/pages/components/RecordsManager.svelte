<script lang="ts">
    import RecordsDisplay from "./RecordsDisplay.svelte";
    import AddRecord from "./AddRecord.svelte";
    export let mat_id: number;
    export let secret: string;

    function triggerDataRefresh(){
        console.log("Dispatched");
    }
</script>

<AddRecord {mat_id} {secret} on:dataAdded={()=>triggerDataRefresh()} />
<RecordsDisplay {mat_id} {secret} />
