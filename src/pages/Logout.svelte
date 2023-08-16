<script>
    import { push } from "svelte-spa-router";
    import { token,materials_data } from "./lib/stores";

    if(localStorage.getItem("token")){
        localStorage.removeItem("token");
        token.set('');
    }
    if(localStorage.getItem("materials_data")){
        localStorage.removeItem("materials_data");
        token.set('');
    };
    push("/");
</script>