<script lang="ts">
    import Flatpickr from "svelte-flatpickr";

    let date;
    let type;
    let fields = [{ paragraphs: "", title: "", file: null }];
    function addField() {
        fields = [...fields, { paragraphs: "", title: "", file: null }];
    }
    function removeField(index) {
        if (index !== 0) {
            fields = fields.filter((_, i) => i !== index);
        }
    }
    async function handleSubmit() {
        const processedFields = fields.map(async(field) => {
            let fileBytes=null;
            if(field.file){
                const arrayBuffer = await field.file[0].arrayBuffer();
                fileBytes = new Uint8Array(arrayBuffer);
            }
            return {
                ...field,
                paragraphs: field.paragraphs.split("\n"),
                file:fileBytes
            };
        });
        let payload = {
            blocks: await Promise.all(processedFields),
            date: date,
            report_header: type,
        };
        console.log(payload);
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
                        class="form-control"
                        placeholder="Заголовок"
                        style="width: 40vw"
                        bind:value={field.title}
                    />
                </div>
                <div class="ms-3 mt-3">
                    <textarea
                        rows="5"
                        class="form-control"
                        placeholder="Параграфы"
                        bind:value={field.paragraphs}
                        style="width: 40vw"
                    />
                </div>
                <div class="ms-3 mt-3">
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
                options={{ enableTime: false }}
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
            on:click|preventDefault={addField}>Доабвить раздел</button
        >
        <button type="submit" class="btn btn-primary ms-3 mt-3"
            >Отправить</button
        >
    </form>
</div>
