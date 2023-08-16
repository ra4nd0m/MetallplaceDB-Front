<script lang="ts">
  import Router, { push } from "svelte-spa-router";
  import Login from "./pages/Login.svelte";
  import { token } from "./pages/lib/stores";
  import AddMaterial from "./pages/AddMaterial.svelte";
  import Home from "./pages/Home.svelte";
  import Logout from "./pages/Logout.svelte";
  import Navbar from "./pages/components/Navbar.svelte";
  import AddProperties from "./pages/components/AddProperties.svelte";
 
  let secret;
  token.subscribe((val) => {
    localStorage.setItem("token", val);
    secret = val;
  });
</script>

<Navbar key={secret} />
<main class="p-3">
  <Router
    routes={{
      "/login": Login,
      "/": Home,
      "/addMaterial": AddMaterial,
      "/logout": Logout,
      "/props/:mat_id": AddProperties,
    }}
  />

</main>
<footer>
  <p>Your token is: {secret}</p>
</footer>
