

export async function getMaterials(token: string) {
    let ret_value: any;
    let payload = '';
    ret_value = await doFetch(payload, '/getMaterialList', token)
    return ret_value.list;
}

export async function getMatProps(token: string, material_id: number) {
    let ret_value: any;
    let payload = JSON.stringify({ material_source_id: material_id });
    ret_value = await doFetch(payload,'/getPropertyList',token);
    return ret_value.list;
}

export async function postMaterial(token:string, material:material) {
    let ret_value:any;
    let payload=JSON.stringify(material);
    ret_value=await doFetch(payload,'/addMaterial',token);
    return ret_value;
}


async function doFetch(payload: string, address: string, token: string) {
    let ret_value: matProp[] | material[] | string;
    await fetch(`${import.meta.env.VITE_API_URL}${address}`, {
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
