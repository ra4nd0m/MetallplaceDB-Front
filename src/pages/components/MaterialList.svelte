<script lang="ts">
    import GetMaterialsList from "./GetMaterialsList.svelte";
    import { token, materials_data } from "../lib/stores";
    import GetMaterialProps from "./GetMaterialProps.svelte";
    import AddMaterial from "./AddMaterial.svelte";
    import AddRecord from "./AddRecord.svelte";
    let tableData;
    let page = 0;
    let itemsPerPage = 10;
    let totalPages = 0;
    let currentPageRows = [];
    let secret: string;
    token.subscribe((val) => (secret = val));
    materials_data.subscribe((val) => {
        if (Object.keys(val).length != 0) {
            tableData = val;
            localStorage.setItem("materials_data", JSON.stringify(val));
            totalPages = Math.ceil(tableData.length / itemsPerPage);
            tableData = tableData.map((item) => ({
                ...item,
                propsExpanded: false,
            }));
            tableData = tableData.map((item) => ({
                ...item,
                recordsExpanded: false,
            }));
            currentPageRows = tableData.slice(
                page * itemsPerPage,
                (page + 1) * itemsPerPage
            );
        }
    });

    const updatePage = () => {
        currentPageRows = tableData.slice(
            page * itemsPerPage,
            (page + 1) * itemsPerPage
        );
    };
    function deleteRow(selectedRow) {
        tableData = tableData.filter((row) => row != selectedRow);
    }
    function toggleProps(id: number) {
        tableData[id].propsExpanded = !tableData[id].propsExpanded;
        console.log(tableData);
    }
    function toggleValues(id: number) {
        tableData[id].recordsExpanded = !tableData[id].recordsExpanded;
    }
</script>

<div>
    {#if typeof tableData == "object"}
        <table class="table table-responsive">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Наименование</th>
                    <th>Источник данных</th>
                    <th>Группа</th>
                    <th>Рынок</th>
                    <th>Тип поставки</th>
                    <th>Еденица</th>
                    <th />
                    <th />
                </tr>
            </thead>
            <tbody>
                {#each tableData as row, i}
                    <tr>
                        <td>{row.Id}</td>
                        <td>{row.Name}</td>
                        <td>{row.Source}</td>
                        <td>{row.Group}</td>
                        <td>{row.Market}</td>
                        <td>{row.DeliveryType}</td>
                        <td>{row.Unit}</td>
                        <td
                            ><button
                                class="btn btn-primary"
                                on:click={() => toggleValues(i)}>Записи</button
                            ></td
                        >
                        <td
                            ><button
                                class="btn btn-secondary"
                                on:click={() => toggleProps(i)}>Свойства</button
                            ></td
                        >
                    </tr>
                    {#if row.propsExpanded}
                        <tr>
                            <td colspan="9">
                                <GetMaterialProps {secret} mat_id={row.Id} />
                            </td>
                        </tr>
                    {/if}
                    {#if row.recordsExpanded}
                        <tr>
                            <td colspan="9">
                                <AddRecord {secret} mat_id={row.Id} />
                            </td>
                        </tr>
                    {/if}
                {/each}
                <AddMaterial {secret} />
            </tbody>
        </table>
    {/if}
    <GetMaterialsList {secret} />
    <div class="pagination">
        {#if totalPages != 0}
            <button
                on:click={() => {
                    if (page > 0) page--;
                    updatePage();
                }}
                class="btn btn-primary btn-page-back">Back</button
            >
            <button
                on:click={() => {
                    if (page < totalPages - 1) page++;
                    updatePage();
                }}
                class="btn btn-primary btn-page-next">Вперед</button
            >
        {/if}
    </div>
</div>

<style>
    .pagination {
        padding-top: 2rem;
    }
    .btn-page-back {
        margin-right: 1rem;
    }
</style>
