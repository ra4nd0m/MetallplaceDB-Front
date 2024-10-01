import { push } from 'svelte-spa-router';
import * as Sentry from '@sentry/svelte';

export async function doFetch(payload: string, address: string, token: string, isNew?: boolean, newApi?: boolean): Promise<fetchReturnType> {
    isNew = isNew || false;
    try {
        let url = "";
        if (newApi !== null && newApi !== false) {
            url = `${import.meta.env.VITE_API_URL}${address}`;
        } else {
            url = `${import.meta.env.VITE_NEW_API_URL}${address}`;
        }
        const resp = await fetch(url, {
            method: 'POST',
            headers: { Authorization: token, "Content-Type": "application/json" },
            body: payload,
        })
        if (resp.status === 401) {
            push('/login');
            return '';
        }
        if (resp.status != 200) {
            throw new Error(`HTTP Error!\nStatus: ${resp.status}`);
        }
        if (isNew) {
            return resp;
        }
        let ret_value: any;
        ret_value = await resp.json();
        return ret_value;
    } catch (err) {
        Sentry.captureException(err);
        alert(`Ошибка:${err}\nВозможно, данные за месяц еще не внесены и база выдает ошибку при запросе средних значений за месяц\nПопробуйте запросить данные за прошлый месяц`);
        return '';
    }
}

type fetchReturnType = responseId | responseList | priceFeed[] | succsessType | Response | string;


interface succsessType {
    succsess: boolean;
}

interface responseId {
    id: number;
}

interface responseList {
    list: matProp[] | material[];
}
export interface priceFeed {
    date: string;
    value: number;
    propUsed?: number;
}
export interface material {
    Id?: number;
    name: string;
    source: string;
    group: string;
    market: string;
    delivery_type: string;
    unit: string;
    update_date?: string;
}

export interface matProp {
    Id: number;
    Name: string;
    Kind: string;
    isSelected?: boolean;
}
