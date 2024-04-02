import { push } from 'svelte-spa-router';
import * as Sentry from '@sentry/svelte';

export async function doFetch(payload: string, address: string, token: string, isNew?: boolean): Promise<fetchReturnType> {
    isNew = isNew || false;
    try {
        const resp = await fetch(`${import.meta.env.VITE_API_URL}${address}`, {
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
        alert(err);
        return '';
    }
}

type fetchReturnType = responseId | responseList | priceFeed[] | succsessType | Response | string;


interface succsessType{
    succsess:boolean;
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
}
export interface material {
    Id?: number;
    Name: string;
    Source: string;
    Group: string;
    Market: string;
    DeliveryType: string;
    Unit: string;
}

export interface matProp {
    Id: number;
    Name: string;
    Kind: string;
}
