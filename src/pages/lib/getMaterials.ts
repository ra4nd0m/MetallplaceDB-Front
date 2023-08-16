export async function getMaterials(token: string) {
    let ret_value: any;
    await fetch('http://localhost:3030/getMaterialList', {
        method: 'POST',
        headers: { Authorization: token, "Content-Type": "application/json" },
        body: ''
    })
        .then((res) => {
            if (res.status != 200) {
                throw new Error('Error retriving the data!');
            }
            return res.json();
        })
        .then((data) => {
            ret_value = data;
        })
        .catch((err) => alert(err));
    return ret_value;
}
    export let key = "";
    export let material_list = {};