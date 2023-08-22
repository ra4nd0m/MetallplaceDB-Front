<script>
    import { push } from "svelte-spa-router";
    import { token } from "./lib/stores";

    if(sessionStorage.getItem("token")){
        sessionStorage.removeItem("token");
        token.set('');
    }
    if(sessionStorage.getItem("materials_data")){
        sessionStorage.removeItem("materials_data");
        token.set('');
    };
    push("/");
</script>