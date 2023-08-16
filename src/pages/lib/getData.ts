export async function getMaterials(token: string) {
    let ret_value: materials | string;
    await fetch('http://localhost:3030/getMaterialList', {
        method: 'POST',
        headers: { Authorization: token, "Content-Type": "application/json" },
        body: ''
    })
        .then((res) => {
            if (res.status != 200) {
                throw new Error(`Error retriving the data!\nStatus:${res.status}`);
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

export async function getMatProps(token: string, material_id: number) {
    let ret_value: matProps | string;
    let payload = { material_source_id: material_id }
    await fetch('http://localhost:3030/getPropertyList', {
        method: 'POST',
        headers: { Authorization: token, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    })
        .then((res) => {
            if (res.status != 200) {
                throw new Error(`Fetch failed!\nStatus: ${res.status}`);
            }
            return res.json();
        })
        .then((data)=>{
            ret_value=data;
        })
        .catch((err)=>{
            ret_value='';
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