import { push } from 'svelte-spa-router';

export async function doFetch(payload: string, address: string, token: string) {
    let ret_value: any;
    await fetch(`${import.meta.env.VITE_API_URL}${address}`, {
        method: 'POST',
        headers: { Authorization: token, "Content-Type": "application/json" },
        body: payload,
    }).then((res) => {
        if (res.status === 401) {
            push('/login');
        }
        if (res.status != 200) {
            throw new Error(`Operation failed!\nStatus: ${res.status}`);
        }
        return res.json();
    })
        .then((data) => {
            ret_value = data;
        })
        .catch((err) => {
            ret_value = '';
            alert(err);
        });
    return ret_value;
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
