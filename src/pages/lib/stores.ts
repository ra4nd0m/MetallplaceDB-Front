import { writable } from "svelte/store";

export const token = writable(sessionStorage.getItem("token") || "");
export const materials_data = writable(JSON.parse(sessionStorage.getItem("materials_data") || '') || []);