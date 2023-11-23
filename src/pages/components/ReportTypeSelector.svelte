<script lang="ts">
    import Reports from "./FullReport.svelte";
    import ShortReport from "./ShortReport.svelte";
    let selectedReportType = "basic";
</script>

<div class="d-flex">
    <form>
        <div class="form-check form-check-inline ms-3">
            <input
                class="form-check-input"
                type="radio"
                id="selectorBasic"
                value="basic"
                bind:group={selectedReportType}
            />
            <label class="from-check-label" for="selectorBasic">Полный</label>
        </div>
        <div class="form-check form-check-inline">
            <input
                class="form-check-input"
                type="radio"
                id="selectorComplex"
                value="complex"
                bind:group={selectedReportType}
            />
            <label class="form-check-label" for="selectorComplex"
                >Короткий</label
            >
        </div>
    </form>
</div>
<div class="mt-3">
    {#if selectedReportType === "basic"}
        <Reports />
    {/if}
    {#if selectedReportType === "complex"}
        <ShortReport />
    {/if}
</div>
