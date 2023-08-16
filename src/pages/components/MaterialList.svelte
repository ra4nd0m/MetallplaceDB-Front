<script lang="ts">
    import GetMaterialsList from "./GetMaterialsList.svelte";
    import {materials_data} from "../lib/stores";
    let tableData=[];
   // materials_data.subscribe((val)=>tableData=val);

  function deleteRow(selectedRow){
    tableData = tableData.filter(row => row != selectedRow);
  }
</script>
<div>

    <table>
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
            {#each tableData as row}
                <tr>
                    <td>{row.Id}</td>
                    <td>{row.Name}</td>
                    <td>{row.Source}</td>
                    <td>{row.Group}</td>
                    <td>{row.Market}</td>
                    <td>{row.DeliveryType}</td>
                    <td>{row.Unit}</td>
                    <td><button on:click={()=>deleteRow(row)}>X</button></td>
                    <td><button>Подробнее</button></td>
                </tr>
            {/each}

        </tbody>
    </table>

<GetMaterialsList bind:material_list={tableData}/>
</div>