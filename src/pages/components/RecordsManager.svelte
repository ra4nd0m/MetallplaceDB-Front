<script lang="ts">
    import RecordsDisplay from "./RecordsDisplay.svelte";
    import AddRecord from "./AddRecord.svelte";
    export let mat_id: number;
    export let secret: string;
    let updateTriggered: boolean;
    function triggerDataRefresh() {
        updateTriggered = true;
    }
</script>

<AddRecord {mat_id} {secret} on:dataAdded={() => triggerDataRefresh()} />
<RecordsDisplay {mat_id} {secret} bind:updateTriggered />
