<script>
    import { push } from "svelte-spa-router";
    import { token, user_login } from "./lib/stores";
    let login;
    let pass;
    function getToken() {
        let payload = {
            username: login,
            password: pass,
        };
        fetch("http://localhost:3030/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        })
            .then((res) => {
                if(res.status!=200){
                    throw new Error("Login Failed!");
                }
                return res.json()})
            .then((data) => {
                token.set(data.token);
                user_login.set(login);
                push("/");
            })
            .catch((err) => alert(err));
    }
</script>

<form on:submit|preventDefault={getToken}>
    <h1>Login</h1>
    <input type="text" name="login" bind:value={login} />
    <input type="password" name="password" bind:value={pass} />
    <button type="submit">Login</button>
</form>
