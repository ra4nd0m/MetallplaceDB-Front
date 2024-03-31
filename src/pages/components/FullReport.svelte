<script lang="ts">
    import Flatpickr from "svelte-flatpickr";
    import { token } from "../lib/stores";
    let reportType: string;
    let date: string | any;
    let secret: string;
    let downloading = false;
    let reportTypeValid = true;
    let dateValid = true;
    token.subscribe((val) => (secret = val));
    async function getReport() {
        reportTypeValid = reportType !== undefined && reportType !== "";
        dateValid = date !== "";
        console.log(dateValid, date)
        if (!reportTypeValid || !dateValid) {
            return;
        }
        try {
            downloading = true;
            const resp = await fetch(
                `${
                    import.meta.env.VITE_API_URL
                }/getReport/${reportType}/${date}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: secret,
                        "Content-Type": "application/json",
                    },
                },
            );
            if (!resp.ok) {
                throw new Error(`HTTP error! status:${resp.status}`);
            }
            console.log(resp);
            const blob = await resp.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${date}_${reportType}`;
            link.click();
            downloading = false;
            window.URL.revokeObjectURL(url);
        } catch (err) {
            alert(err);
            downloading = false;
        }
    }
</script>

<div class="d-flex">
    <form
        on:submit|preventDefault={async () => {
            await getReport();
        }}
    >
        <div class="form-check form-check-inline ms-3">
            <input
                class="form-check-input {reportTypeValid ? '' : 'is-invalid'}"
                type="radio"
                id="selectorWeekly"
                value="weekly"
                bind:group={reportType}
            />
            <label class="from-check-label" for="selectorWeekly"
                >Недельный</label
            >
        </div>
        <div class="form-check form-check-inline">
            <input
                class="form-check-input {reportTypeValid ? '' : 'is-invalid'}"
                type="radio"
                id="selectorMonthly"
                value="monthly"
                bind:group={reportType}
            />
            <label class="from-check-label" for="selectorMonthly"
                >Месячный</label
            >
        </div>
        <div class="ms-3 mt-3">
            <Flatpickr
                options={{ enableTime: false }}
                bind:formattedValue={date}
                class="form-control {dateValid ? '' : 'is-invalid'}"
                on:change={(dateStr) => {
                    date = dateStr;
                }}
                placeholder="Дата"
            />
            {#if !dateValid || !reportTypeValid}
                <div class="invalid-feedback">Данные не введены!</div>
            {/if}
        </div>
        <div class="ms-3 mt-3">
            <button
                class="btn btn-primary"
                type="submit"
                disabled={downloading}
            >
                {#if downloading}
                    Загрузка...
                {:else}
                    Получить отчет
                {/if}
            </button>
        </div>
    </form>
</div>
