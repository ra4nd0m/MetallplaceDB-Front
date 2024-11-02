<script lang="ts">
    import Flatpickr from "svelte-flatpickr";
    import { token } from "../lib/stores";
    import { doFetch } from "../lib/getData";
    import * as Sentry from '@sentry/svelte';


    let date: any;
    let type: string = "Мировой рынок металлургического сырья";
    let downloading = false;
    let fields: inputField[] = [{ paragraphs: "", title: "", file: null }];
    let fieldsValid = true;
    let formSubmitted = false;
    function addField() {
        fields = [...fields, { paragraphs: "", title: "", file: null }];
    }
    function removeField(index: number) {
        if (index !== 0) {
            fields = fields.filter((_, i) => i !== index);
        }
    }
    async function handleSubmit() {
        formSubmitted = true;
        fieldsValid = fields.every((field) => field.paragraphs && field.title);
        if (!fieldsValid) return;
        const processedFields = fields.map(async (field) => {
            let fileBytes: any = null;
            if (field.file) {
                fileBytes = await toBase64(field.file[0]);
                fileBytes = fileBytes.replace(/^data:.*\/.*;base64,/, "");
            }
            return {
                ...field,
                paragraphs: field.paragraphs.split("\n"),
                file: fileBytes,
            };
        });
        let payload = {
            blocks: await Promise.all(processedFields),
            date: date,
            report_header: type,
        };
        await getReport(JSON.stringify(payload));
    }
    const toBase64 = (file: File) =>
        new Promise((res, rej) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => res(reader.result);
            reader.onerror = rej;
        });
    async function getReport(payload: string) {
        try {
            downloading = true;
            const resp = (await doFetch(
                payload,
                "/getShortReport",
                true,
            )) as Response;
            if (typeof resp !== "object") {
                throw new Error("Error");
            }
            const blob = await resp.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = date;
            link.click();
            downloading = false;
            window.URL.revokeObjectURL(url);
        } catch (err) {
            Sentry.captureException(err);
            alert(err);
            downloading = false;
        }
    }
    interface inputField {
        title: string;
        paragraphs: string;
        file: FileList | null;
    }
</script>

<div class="d-flex flex-column">
    <div class="d-flex flex-column">
        <form>
            <div class="from-check form-check-inline mt-3 ms-3">
                <input
                    class="form-check-input"
                    type="radio"
                    id="worldMarket"
                    value="Мировой рынок металлургического сырья"
                    bind:group={type}
                />
                <label class="form-check-label" for="worldMarket"
                    >Мировой рынок металлургического сырья</label
                >
            </div>
            <div class="from-check form-check-inline mt-3 ms-3">
                <input
                    class="form-check-input"
                    type="radio"
                    id="worldAndRussianMarket"
                    value="Мировой и российский рынок стали"
                    bind:group={type}
                />
                <label class="form-check-label" for="worldAndRussianMarket"
                    >Мировой и российский рынок стали</label
                >
            </div>
        </form>
    </div>
    <form on:submit|preventDefault={handleSubmit}>
        {#each fields as field, index (index)}
            <div class="d-flex flex-column align-items-start">
                <div class="ms-3 mt-3">
                    <input
                        type="text"
                        class="form-control {!field.title && formSubmitted
                            ? 'is-invalid'
                            : ''}"
                        placeholder="Заголовок"
                        style="width: 40vw"
                        bind:value={field.title}
                    />
                    {#if !field.title && formSubmitted}
                        <div class="invalid-feedback">
                            Загаловок не заполнен!
                        </div>
                    {/if}
                </div>
                <div class="ms-3 mt-3">
                    <textarea
                        rows="5"
                        class="form-control {!field.paragraphs && formSubmitted
                            ? 'is-invalid'
                            : ''}"
                        placeholder="Параграфы"
                        bind:value={field.paragraphs}
                        style="width: 40vw"
                    />
                    {#if !field.paragraphs && formSubmitted}
                        <div class="invalid-feedback">
                            Параграфы не заполнены!
                        </div>
                    {/if}
                </div>
                <div class="ms-3 mt-3">
                    <!---->
                    <input
                        class="form-control"
                        type="file"
                        bind:files={field.file}
                        style="width: 20vw;"
                    />
                </div>
                {#if index !== 0}
                    <div class="mt-3 ms-3">
                        <button
                            class="btn btn-danger"
                            on:click={() => {
                                removeField(index);
                            }}>Удалить раздел</button
                        >
                    </div>
                {/if}
            </div>
        {/each}
        <div class="ms-3 mt-3">
            <Flatpickr
                style="width:20vw"
                options={{ enableTime: false, defaultDate: new Date() }}
                bind:formattedValue={date}
                class="form-control"
                on:change={(dateStr) => {
                    date = dateStr;
                }}
                placeholder="Дата"
            />
        </div>
        <button
            class="btn btn-secondary ms-3 mt-3"
            on:click|preventDefault={addField}>Добавить раздел</button
        >
        <button
            type="submit"
            class="btn btn-primary ms-3 mt-3"
            disabled={downloading}>Отправить</button
        >
    </form>
</div>
