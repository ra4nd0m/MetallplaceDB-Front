<script lang="ts">
    import GetMaterialsList from "./GetMaterialsList.svelte";
    import { token, materials_data } from "../lib/stores";
    import GetMaterialProps from "./GetMaterialProps.svelte";
    import AddMaterial from "./AddMaterial.svelte";
    import AddRecord from "./AddRecord.svelte";
    import SubmenuSwitch from "./SubmenuSwitch.svelte";
    import RecordsDisplay from "./RecordsDisplay.svelte";

    let tableData;
    let page = 0;
    let itemsPerPage = 10;
    let totalPages = 0;
    let currentPageRows = [];
    let secret: string;
    let search_item: string = "";
    let filteredData = [];
    let selectedMenu;
    let selectedFilters = {
        source: "",
        group: "",
        market: "",
        deliveryType: "",
        unit: "",
    };
    let filterItems = {
        Source: [],
        Group: [],
        Market: [],
        DeliveryType: [],
        Unit: [],
    };
    token.subscribe((val) => (secret = val));
    materials_data.subscribe((val) => {
        if (Object.keys(val).length != 0) {
            tableData = val;
            sessionStorage.setItem("materials_data", JSON.stringify(val));
            totalPages = Math.ceil(tableData.length / itemsPerPage);
            tableData = tableData.map((item) => ({
                ...item,
                expanded: false,
            }));
            currentPageRows = tableData.slice(
                page * itemsPerPage,
                (page + 1) * itemsPerPage
            );
            getFilters("Source");
            getFilters("Group");
            getFilters("Market");
            getFilters("DeliveryType");
            getFilters("Unit");
        }
    });
    function getFilters(filter: string) {
        filterItems[filter] = Array.from(
            new Set(tableData.map((item) => item[filter]))
        );
    }
    const updatePage = () => {
        currentPageRows = tableData.slice(
            page * itemsPerPage,
            (page + 1) * itemsPerPage
        );
    };
    function deleteRow(selectedRow) {
        tableData = tableData.filter((row) => row != selectedRow);
    }
    function toggleShown(id: number) {
        filteredData[id].expanded = !filteredData[id].expanded;
    }
    $: {
        filteredData = tableData?.filter((item) =>
            item.Name.toLowerCase().includes(search_item.toLowerCase())
        );
        if (selectedFilters.source != "")
            filteredData = filteredData.filter((item) => {
                return item.Source === selectedFilters.source;
            });
        if (selectedFilters.group != "")
            filteredData = filteredData.filter((item) => {
                return item.Group === selectedFilters.group;
            });
        if (selectedFilters.deliveryType != "")
            filteredData = filteredData.filter((item) => {
                return item.DeliveryType === selectedFilters.deliveryType;
            });
        if (selectedFilters.market != "")
            filteredData = filteredData.filter((item) => {
                return item.Market === selectedFilters.market;
            });
        if (selectedFilters.unit != "")
            filteredData = filteredData.filter((item) => {
                return item.Unit === selectedFilters.unit;
            });
    }
</script>

<div>
    {#if typeof filteredData == "object"}
        <!--Search Bar-->
        <input
            type="search"
            placeholder="Поиск.."
            class="form-control"
            bind:value={search_item}
        />
        <div class="row" style="padding-top: 1%;">
            <div class="col">
                <select bind:value={selectedFilters.source} class="form-select">
                    <option value="">Источник данных</option>
                    {#each filterItems.Source as item}
                        <option value={item}>{item}</option>
                    {/each}
                </select>
            </div>
            <div class="col">
                <select bind:value={selectedFilters.group} class="form-select">
                    <option value="">Группа</option>
                    {#each filterItems.Group as item}
                        <option value={item}>{item}</option>
                    {/each}
                </select>
            </div>
            <div class="col">
            <select bind:value={selectedFilters.market} class="form-select">
                <option value="">Рынок</option>
                {#each filterItems.Market as item}
                    <option value={item}>{item}</option>
                {/each}
            </select>
            </div>
            <div class="col">
                <select
                    bind:value={selectedFilters.deliveryType}
                    class="form-select"
                >
                    <option value="">Тип поставки</option>
                    {#each filterItems.DeliveryType as item}
                        <option value={item}>{item}</option>
                    {/each}
                </select>
            </div>
            <div class="col">
                <select bind:value={selectedFilters.unit} class="form-select">
                    <option value="">Еденица</option>
                    {#each filterItems.Unit as item}
                        <option value={item}>{item}</option>
                    {/each}
                </select>
            </div>
        </div>
        <div style="padding-top: 1%;">
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
                    {#each filteredData as row, i}
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
                                    class="btn btn-secondary"
                                    on:click={() => toggleShown(i)}
                                    >Свойства</button
                                ></td
                            >
                        </tr>
                        {#if row.expanded}
                            <tr>
                                <td colspan="9">
                                    <SubmenuSwitch bind:selectedMenu>
                                        {#if selectedMenu == "propsList"}
                                            <GetMaterialProps
                                                {secret}
                                                mat_id={row.Id}
                                            />
                                        {/if}
                                        {#if selectedMenu == "addRecord"}
                                            <AddRecord
                                                {secret}
                                                mat_id={row.Id}
                                            />
                                        {/if}
                                        {#if selectedMenu == "showRecords"}
                                            <RecordsDisplay
                                                {secret}
                                                mat_id={row.Id}
                                            />
                                        {/if}
                                    </SubmenuSwitch>
                                </td>
                            </tr>
                        {/if}
                    {/each}
                    <AddMaterial {secret} />
                </tbody>
            </table>
        </div>
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
