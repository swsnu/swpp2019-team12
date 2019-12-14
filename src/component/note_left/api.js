import axios from 'axios';

const url = 'http://127.0.0.1:8000/api/';

export const fetchAgendas = async (n_id, block_id) => {
    return axios.get(`${url}/note/${n_id}/${block_id}/`).then();
};
