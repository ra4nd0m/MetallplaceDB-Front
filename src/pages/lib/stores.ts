import { writable } from "svelte/store";

export const token = writable(localStorage.getItem("token") || "");
export const materials_data = writable(JSON.parse(localStorage.getItem("materials_data"))||{});