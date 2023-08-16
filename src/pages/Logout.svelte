<script>
    import { push } from "svelte-spa-router";
    import { token } from "./stores";

    if(localStorage.getItem("token")){
        localStorage.setItem("token",'');
        token.set('');
        push("/");
    }
</script>