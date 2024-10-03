<script lang="ts">
    import RecordsDisplay from "./RecordsDisplay.svelte";
    import AddRecord from "./AddRecord.svelte";
    export let mat_id: number;
    export let secret: string;
</script>

<AddRecord {mat_id} {secret} />
<RecordsDisplay {mat_id} {secret} />
