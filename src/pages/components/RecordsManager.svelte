<script lang="ts">
    import RecordsDisplay from "./RecordsDisplay.svelte";
    import AddRecord from "./AddRecord.svelte";
    export let mat_id: number;
    let updateTriggered: boolean;
    function triggerDataRefresh() {
        updateTriggered = true;
    }
</script>

<AddRecord {mat_id} on:dataAdded={() => triggerDataRefresh()} />
<RecordsDisplay {mat_id} bind:updateTriggered />
