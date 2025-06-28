const mongoose = require("mongoose")
const {Schema} = mongoose;

const problemSchema = new Schema({
    title:{
        required:true,
        type:String
    },
    description:{
        type:String,
        required:true
    },
    difficulty:{
        type:String,
        enum:["easy","medium","hard"],
        required:true
    },
    tags:{
        type:String,
        enum:['array',"LinkedList","graph","dp"],
        required:true
    },
    visibleTestCases:[
        {
            input:{
                required:true,
                type:String
            },
            output:{
                type:String,
                required:true,
            },
            explanation:{
                type:String,
                required:true

            }
        }
    ],

    hiddenTestCases:[
        {
            input:{
                required:true,
                type:String
            },
            output:{
                type:String,
                required:true,
            }
        }
    ],

    startCode:[
        {
            language:{
                type:String,
                required:true
            },
            initialCode:{
                type:String,
                required:true
            }
        }
    ],

    referenceSolution:[
        {
            language:{
                type:String,
                required:true
            },
            completeCode:{
                type:String,
                required:true
            }
        }

    ],

    problemCreator:{
        type:Schema.Types.ObjectId,
        ref:"user",
        required:true
    }
})

const Problem = mongoose.model("problem", problemSchema);
module.exports = Problem