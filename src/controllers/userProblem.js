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


module.exports = createProblem;