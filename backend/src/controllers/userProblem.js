const {getLanguageById, submitBatch,submitToken} = require("../utils/ProblemUtility")
const Problem = require("../models/problem")
const User = require("../models/user");



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
                const submissions = visibleTestCases.map((testcase)=>({
                    source_code:completeCode,
                    language_id:languageId,
                    stdin : testcase.input,
                    expected_output:testcase.output

                }))
                console.log("first paas")
                const submitResult = await submitBatch(submissions);
                console.log("second paas")
                const resultToken = submitResult.map((value)=> value.token);
                console.log("third paas")
                const testResult = await submitToken(resultToken);
                console.log(testResult)

                for (const test of testResult)
                {
                    if(test.status_id!=3)
                    {
                        return res.status(400).send("Error Occured");
                    }
                }
                
            }

            //we can store it in our data base
            console.log("fourth paas")

            const userProblem = await Problem.create({
                ...req.body,
                problemCreator : req.result._id

            })
            console.log("fifth paas")
            res.status(201).send("Problem saved successfully")


        }
        catch(err){
            res.status(400).send("Error:"+ err)
            console.log(err.message)
            console.log("sixth paas")
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
        const getProblem = await Problem.findById(id).select("_id title description tags visibleTestCases startCode referenceSolution");

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
        const getProblem = await Problem.find({}).select("_id title difficulty tags");

        if(getProblem.length==0){
            return res.status(404).send('Problem is Missing')
        }
        res.status(200).send(getProblem)


    }
    catch(err){
        res.status(500).send("Error: "+err)

    }
}

const solvedAllProblembyUser = async(req, res)=>{
    try{
        const userId = req.result._id;
        const user = await User.findById(userId).populate({
            path:"problemSolved",
            select:"_id title difficulty tags"
        });
        res.status(200).send(user.problemSolved)

    }
    catch(err){
        res.status(500).send("Server Error"+err)
    }
}

const submittedProblem = async(req,res)=>{
    try{
    const userId = req.res._id;
    const problemId = req.params.pid;

    const ans = await Submission.find({userId, problemId});

    if(ans.length==0){
        res.status(200).send("no submission till now")
    }
    res.status(200).send(ans)
}
catch(err){
    res.status(500).send("Internal server error"+err)
}

}





module.exports = {createProblem,updateProblem, deleteProblem, getProblemById, getAllProblem,solvedAllProblembyUser,submittedProblem};