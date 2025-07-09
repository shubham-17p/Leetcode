const Problem = require("../models/problem")
const Submission = require("../models/submission")
const {getLanguageById, submitBatch, submitToken} = require("../utils/ProblemUtility")
const User = require("../models/user");

const submitCode = async (req , res)=>{
    try
    {
        // user id chayihe
        const userId = req.result._id;

        // problem id chayihe
        const problemId = req.params.id;

        // code aur language req.body ke andar present hoga
        const {code, language}= req.body;
        

        if(!userId||!code||!problemId||!language){
            return res.status(400).send("some field missing")
        }

        // fetch the problem from the database
        const problem = await Problem.findById(problemId)
    
        // hidden tast cases

        // kya apne submission sture kar du phle
        const submittedResult = await Submission.create({
            userId,
            problemId,
            code,
            language,
            status:"pending",
            testCasesTotal : problem.hiddenTestCases.length

        })

        //judge0 ko code submit karna hain
        const languageId = getLanguageById(language);
        const submissions = problem.hiddenTestCases.map((testcase)=>({
                source_code:code,
                language_id:languageId,
                stdin : testcase.input,
                expected_output:testcase.output

            }))
        const submitResult = await submitBatch(submissions);
        const resultToken = submitResult.map((value)=> value.token);
        const testResult = await submitToken(resultToken);

        // submittedResult ko update karna hain
        let testCasesPassed = 0;
        let runtime = 0;
        let memory = 0;
        let status = "accepted"
        let errorMessage = null

        for (const test of testResult){
            if(test.status_id==3){
                testCasesPassed++;
                runtime = runtime+parseFloat(test.time)
                memory = Math.max(memory, test.memory)
            }
            else{
                if(test.status_id==4){
                    status = "error"
                    errorMessage = test.stderr
                }
                else{
                    status = "wrong"
                    errorMessage = test.stderr

                }
            }
        }

        // store the result in database in submission
        submittedResult.status = status;
        submittedResult.testCasesPassed = testCasesPassed;
        submittedResult.errorMessage = errorMessage;
        submittedResult.runtime = runtime;
        submittedResult.memory = memory;

        await submittedResult.save();
        
        //ham problem id ko insert karenge user schema ke problem solved me if it is not present there
        if(!req.result.problemSolved.includes(problemId)){
            req.result.problemSolved.push(problemId)
            await req.result.save()
        }

        res.status(201).send(submittedResult);

    }
    catch(err)
    {
        res.status(500).send("internal server error:"+err)

    }

}

const runCode = async(req,res)=>{
    try
    {
        // user id chayihe
        const userId = req.result._id;

        // problem id chayihe
        const problemId = req.params.id;

        // code aur language req.body ke andar present hoga
        const {code, language}= req.body;
        

        if(!userId||!code||!problemId||!language){
            return res.status(400).send("some field missing")
        }

        // fetch the problem from the database
        const problem = await Problem.findById(problemId)
    
        // visible tast cases

        //judge0 ko code submit karna hain
        const languageId = getLanguageById(language);
        const submissions = problem.visibleTestCases.map((testcase)=>({
                source_code:code,
                language_id:languageId,
                stdin : testcase.input,
                expected_output:testcase.output

            }))
        const submitResult = await submitBatch(submissions);
        const resultToken = submitResult.map((value)=> value.token);
        const testResult = await submitToken(resultToken);

    

        res.status(201).send(testResult);

    }
    catch(err)
    {
        res.status(500).send("internal server error:"+err)

    }

}

module.exports = {submitCode, runCode};


