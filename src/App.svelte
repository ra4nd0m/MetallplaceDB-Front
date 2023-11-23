<script lang="ts">
  import Router, { push } from "svelte-spa-router";
  import Login from "./pages/Login.svelte";
  import { token } from "./pages/lib/stores";
  import Home from "./pages/Home.svelte";
  import Logout from "./pages/Logout.svelte";
  import Navbar from "./pages/components/Navbar.svelte";
  import ReportTypeSelector from "./pages/components/ReportTypeSelector.svelte";

  let secret:string;
  token.subscribe((val) => {
    sessionStorage.setItem("token", val);
    secret = val;
  });
</script>

<Navbar key={secret} />
<main class="p-3">
  <Router
    routes={{
      "/login": Login,
      "/": Home,
      "/logout": Logout,
      "/reports": ReportTypeSelector,
    }}
  />
</main>
