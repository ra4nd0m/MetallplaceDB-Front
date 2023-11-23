import { writable } from "svelte/store";

export const token = writable(sessionStorage.getItem("token") || "");
let storedData = sessionStorage.getItem("materials_data");
export const materials_data = writable(storedData && storedData !== "" ? JSON.parse(storedData) : []);
