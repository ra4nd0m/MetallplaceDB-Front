<script>
    import { push } from "svelte-spa-router";
    import { token } from "../lib/stores";

    if(localStorage.getItem("token")){
        localStorage.setItem("token",'');
        token.set('');
        push("/");
    }
</script>