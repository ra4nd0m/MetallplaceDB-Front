<script lang="ts">
    import {getMatProps} from '../lib/getData';
    import { token } from "../lib/stores";
    let material_props_list = {};
    let secret: string;
    token.subscribe((value) => (secret = value));
</script>

<table>
    <thead>
        <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Kind</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td></td>
        </tr>
    </tbody>
</table>