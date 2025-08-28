const axios = require('axios');

const getLanguageById = (lang)=>{
    const language = {
        "c++" : 54,
        "java" :62,
        "javascript":63
    }

    return language[lang.toLowerCase()];
}

const submitBatch = async (submissions)=>{

    const options = {
        method: 'POST',
        url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
        params: {base64_encoded: 'false'},
        headers: {
            'x-rapidapi-key': 'f09c34dee1msh491c665d65bfb38p11802bjsn277758ce452c',
            'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
            'Content-Type': 'application/json'
        },
        data: {submissions}
    };

    async function fetchData() {
        try {
            const response = await axios.request(options);
                return response.data;
        }
        catch (error) {
            console.error("Submit Batch Error : " +error);
        }
    }

    return await fetchData();

}

const waiting = async(timer)=>{
    setTimeout(()=>{
        return 1;
    },timer);
}
const submitToken = async(resultToken)=>{

    const options = {
        method: 'GET',
        url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
        params: {
        tokens: resultToken.join(","),
        base64_encoded: 'false',
        fields: '*'
        },
        headers: {
            'x-rapidapi-key': 'f09c34dee1msh491c665d65bfb38p11802bjsn277758ce452c',
            'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
        }
    };

    async function fetchData() {
        try {
            const response = await axios.request(options);
            return response.data;
        } catch (error) {
            console.error("Submit Token Error : " +error);
        }
    }

    while(true){
        const result = await fetchData();

        const IsResultObtained = result.submissions.every((r)=> r.status_id>2);

        if(IsResultObtained)
            return result.submissions//fixed s missing
        
        await waiting(1000)
        
    }

}

module.exports = {getLanguageById, submitBatch, submitToken}