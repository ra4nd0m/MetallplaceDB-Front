<script lang="ts">
    import { push } from "svelte-spa-router";
    import { token } from "./lib/stores";
    let login: string;
    let pass: string;
    function getToken() {
        let payload = {
            username: login,
            password: pass,
        };
        fetch(`${import.meta.env.VITE_API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        })
            .then((res) => {
                if (res.status != 200) {
                    throw new Error(`Login Failed!\nStatus: ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                token.set(data.token);
                const expiresIn = 7200 * 1000;
                setTimeout(() => {
                    token.set("");
                    alert("Сессия подошла к концу!\nТребуется перезайти!")
                    push("/login");
                }, expiresIn);
                push("/");
            })
            .catch((err) => alert(err));
    }
</script>

<div class="d-flex justify-content-center">
    <form on:submit|preventDefault={getToken}>
        <h1 class="ms-3 mt-3">Вход</h1>
        <div class="ms-3 mt-3">
            <input
                class="form-control"
                type="text"
                name="login"
                bind:value={login}
            />
        </div>
        <div class="ms-3 mt-3">
            <input
                class="form-control"
                type="password"
                name="password"
                bind:value={pass}
            />
        </div>
        <div class="ms-3 mt-3">
            <button class="btn btn-primary" type="submit">Login</button>
        </div>
    </form>
</div>
