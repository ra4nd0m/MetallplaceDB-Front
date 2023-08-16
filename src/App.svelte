<script lang="ts">
  import Router from "svelte-spa-router";
  import Login from "./pages/Login.svelte";
  import { token } from "./lib/stores";
  import AddMaterial from "./pages/AddMaterial.svelte";
  import Home from "./pages/Home.svelte";
  import Logout from "./pages/Logout.svelte";
  import GetMaterialsList from "./pages/components/GetMaterialsList.svelte";

  let secret;
  token.subscribe((val) => {
    localStorage.setItem("token", val);
    secret = val;
  });

  let list;
</script>

<nav class="navbar navbar-expand-lg navbar-light bg-light p-2">
  <ul class="navbar-nav me-auto">
    <li class="nav-item">
      <a class="nav-link" href="#/">Home</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="/#/addMaterial">Добавить материал</a>
    </li>
  </ul>
  <ul class="navbar-nav ms-auto">
    <li class="nav-item">
      {#if secret == ""}
        <a class="nav-link" href="/#/login">Login</a>
      {:else}
        <a class="nav-link" href="/#/logout">Log Out</a>
      {/if}
    </li>
  </ul>
</nav>

<main class="p-3">
  <Router
    routes={{
      "/login": Login,
      "/": Home,
      "/addMaterial": AddMaterial,
      "/logout": Logout,
    }}
  />

  <p>Your token is: {secret}</p>

  <GetMaterialsList key={secret}/>
</main>
