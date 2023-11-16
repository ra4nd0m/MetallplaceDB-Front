<script lang="ts">
    import Flatpickr from "svelte-flatpickr";
    import { token } from "./lib/stores";
    let reportType;
    let date:string|any;
    let secret;
    token.subscribe((val) => (secret = val));
    async function getReport() {
        try {
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
                }
            );
            if (!resp.ok) {
                throw new Error(`HTTP error! status:${resp.status}`);
            }
            const blob = await resp.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = date;
            link.click();
        } catch (err) {
            alert(err);
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
                class="form-check-input"
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
                class="form-check-input"
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
                class="form-control"
                on:change={(dateStr) => {
                    date = dateStr;
                }}
                placeholder="Дата"
            />
        </div>
        <div class="ms-3 mt-3">
            <button class="btn btn-primary" type="submit">Получить отчет</button
            >
        </div>
    </form>
</div>
