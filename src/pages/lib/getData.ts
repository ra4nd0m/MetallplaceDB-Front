export async function getMaterials(token: string) {
    let ret_value: any;
    let payload = '';
    ret_value = await doFetch(payload, '/getMaterialList', token)
    return ret_value;
}

export async function getMatProps(token: string, material_id: number) {
    let ret_value: any;
    let payload = JSON.stringify({ material_source_id: material_id });
    ret_value = await doFetch(payload,'/getPropertyList',token);
    return ret_value;
}

async function doFetch(payload: string, address: string, token: string) {
    let ret_value: matProps[] | materials[] | string;
    await fetch(`http://localhost:3030${address}`, {
        method: 'POST',
        headers: { Authorization: token, "Content-Type": "application/json" },
        body: payload,
    }).then((res) => {
        if (res.status != 200) {
            throw new Error(`Fetch failed!\nStatus: ${res.status}`);
        }
        return res.json();
    })
        .then((data) => {
            ret_value = data.list;
        })
        .catch((err) => {
            ret_value = '';
            alert(err);
        });
    return ret_value;
}
export interface materials {
    Id: number;
    Name: string;
    Source: string;
    Group: string;
    Market: string;
    DeliveryType: string;
    Unit: string;
}

export interface matProps {
    Id: number;
    Name: string;
    Kind: string;
}