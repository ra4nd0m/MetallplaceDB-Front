<script lang="ts">
    import GetMaterialsList from "./GetMaterialsList.svelte";
    import { materials_data } from "../lib/stores";
    import GetMaterialProps from "./GetMaterialProps.svelte";
    let tableData;
    
    materials_data.subscribe((val) => {
        if (Object.keys(val).length != 0) {
            tableData = val;
            localStorage.setItem("materials_data", JSON.stringify(val));
        }
    });
    function deleteRow(selectedRow) {
        tableData = tableData.filter((row) => row != selectedRow);
    }
    tableData = tableData.map((item) => ({ ...item, expanded: false }));
    function toggleRow(id) {
        tableData[id].expanded=!tableData[id].expanded;
    }
</script>

<div>
    {#if typeof tableData == "object"}
        <table class="table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Наименование</th>
                    <th>Источник данных</th>
                    <th>Группа</th>
                    <th>Рынок</th>
                    <th>Тип поставки</th>
                    <th>Еденица</th>
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
                            ><button on:click={() => deleteRow(row)}>X</button
                            ></td
                        >
                        <td
                            ><button on:click={() => toggleRow(i)}
                                >Свойства</button
                            ></td
                        >
                    </tr>
                    {#if row.expanded}
                        <tr>
                            <GetMaterialProps mat_id={row.Id} />
                        </tr>
                    {/if}
                {/each}
            </tbody>
        </table>
    {/if}
    <GetMaterialsList />
</div>
