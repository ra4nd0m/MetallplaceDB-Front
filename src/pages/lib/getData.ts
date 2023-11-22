import { push } from 'svelte-spa-router';

export async function doFetch(payload: string, address: string, token: string, isNew?: boolean) {
    isNew = isNew || false;
    try {
        const resp = await fetch(`${import.meta.env.VITE_API_URL}${address}`, {
            method: 'POST',
            headers: { Authorization: token, "Content-Type": "application/json" },
            body: payload,
        })
        if (resp.status === 401) {
            push('/login');
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
        alert(err);
        return '';
    }
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
