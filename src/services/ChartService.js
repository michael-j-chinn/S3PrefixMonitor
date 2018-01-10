import axios from 'axios';

module.exports = {
    getChartData: (chartUuid, timerange) => {
        return new Promise((resolve, reject) =>{
            axios.get(`/api/v1/charts/${chartUuid}/${timerange}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(reason => {
                    reject(reason);
                });
        });
    },
    getChartSettings: () => {
        axios.get('/api/v1/charts')
            .then(response => {
                return response.data;
            });
    },
    forceRefresh: () => {
        axios.post('/api/v1/charts/getcounts')
            .then(response => {

            })
            .catch(reason => {
                console.log(reason);
            });
    },
    clearAllData: (e) => {
        e.preventDefault();

        axios.delete('/api/v1/charts');
    }
}