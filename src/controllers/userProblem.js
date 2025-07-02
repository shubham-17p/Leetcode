const {getLanguageById, submitBatch,submitToken} = require("../utils/ProblemUtility")
const Problem = require("../models/problem")


const createProblem = async (req, res)=>{

        console.log("Request body received:", req.body); 

    if (!req.body) {
        return res.status(400).send("Request body is missing");
    }
    const {title, description, difficulty, tags, visibleTestCases, hiddenTestCases,
        startCode,referenceSolution,problemCreator} = req.body;


    
        try{
            
            for(const {language, completeCode} of referenceSolution){

                //source_code
                //language_id
                //stdin
                //expected_output
                const languageId = getLanguageById(language);

                //submission vala array create kiya hain maine
                const submission = visibleTestCases.map((testcase)=>({
                    source_code:completeCode,
                    language_id:languageId,
                    stdin : testcase.input,
                    expected_output:testcase.output

                }))

                const submitResult = await submitBatch(submission);

                const resultToken = submitResult.map((value)=> value.token);

                const testResult = await submitToken(resultToken);

                for (const test of testResult)
                {
                    if(test.status_id!=3)
                    {
                        return res.status(400).send("Error Occured");
                    }
                }
                
            }

            //we can store it in our data base

            const userProblem = await Problem.create({
                ...req.body,
                problemCreator : req.result._id

            })
            res.status(201).send("Problem saved successfully")


        }
        catch(err){
            res.status(400).send("Error:"+ err)
        }

}

const updateProblem = async (req, res)=>{
    const {id} = req.params;
    const {title, description, difficulty, tags, visibleTestCases, hiddenTestCases,
        startCode,referenceSolution,problemCreator} = req.body;

    try{

        if(!id){
            return res.status(400).send('Missing Id Field')
        }

        const DsaProblem = await Problem.findById(id)
        if(!DsaProblem){
            return res.status(404).send("Id is not present in server")
        }
        for(const {language, completeCode} of referenceSolution){

                //source_code
                //language_id
                //stdin
                //expected_output
                const languageId = getLanguageById(language);

                //submission vala array create kiya hain maine
                const submission = visibleTestCases.map((testcase)=>({
                    source_code:completeCode,
                    language_id:languageId,
                    stdin : testcase.input,
                    expected_output:testcase.output

                }))

                const submitResult = await submitBatch(submission);

                const resultToken = submitResult.map((value)=> value.token);

                const testResult = await submitToken(resultToken);

                for (const test of testResult)
                {
                    if(test.status_id!=3)
                    {
                        return res.status(400).send("Error Occured");
                    }
                }
                
            }

        const newProblem = await Problem.findByIdAndUpdate(id, {...req.body}, {runValidators:true, new:true})
        res.status(200).send(newProblem);
        

    }
    catch(err){
        res.status(500).send('Error: '+err)

    }
}

const deleteProblem = async (req,res)=>{
    const {id} = req.params;
    try{
        
        if(!id){
            return res.status(400).send('Missing Id Field')
        }
        const deleteProblem = await Problem.findByIdAndDelete(id);

        if(!deleteProblem){
            return res.status(404).send('Problem is Missing')
        }
        res.status(200).send("DELETED SUCCESSFULLY.....")


    }
    catch(err){
        res.status(500).send("Error: "+err)

    }
}

const getProblemById = async (req,res)=>{
    const {id} = req.params;
    try{
        
        if(!id){
            return res.status(400).send('Missing Id Field')
        }
        const getProblem = await Problem.findById(id);

        if(!getProblem){
            return res.status(404).send('Problem is Missing')
        }
        res.status(200).send(getProblem)


    }
    catch(err){
        res.status(500).send("Error: "+err)

    }
}
const getAllProblem = async (req,res)=>{
    try{
        const getProblem = await Problem.find({});

        if(getProblem.length==0){
            return res.status(404).send('Problem is Missing')
        }
        res.status(200).send(getProblem)


    }
    catch(err){
        res.status(500).send("Error: "+err)

    }
}






module.exports = {createProblem,updateProblem, deleteProblem, getProblemById, getAllProblem};