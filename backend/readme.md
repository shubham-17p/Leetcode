config
 isme hamne database se link kiya

models
 me hamne user ka schema create kiya

routes
 isme create kiya phle-->userAuth.js 

controller 
create kiya jisme -->userAuthent.js create kiya jo ki check karega ki req.body me jo information ayi hain vo shi hain kki nhi 

but ise phle hame validate (npm i validate)
 karana padega ki jo req.body me jo information ayi hain vo shi format me hain kki nhi sare field present hai ki nhi jaise email me special character ho, numeric ho ,digit ho like    that --validator.js 

ab hame password ko hsh karna padega uske liye bcrypt library ka use karenge -->npm i bcrypt


ab jab user ne register kara liya hain to use ham token bhej sakte hain--->npm i jsonwebtoken

kya key ko randomly generte karne ka koi option hain--->node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"


ab login ka api banayenge
i)--->check karenge req.body me email aur password present hain ki nhi
ii)--->agar present hain to email ke through us user ka sara data nikaal lenge  
iii)-->bcrypt ke through password ko match karenge
iv)---->aur agar match ho gaya to tokens de denge


{
    "title" : "Add two Number",
    "description" : "Write a program that takes two integers as input and return  their sum.",
    "difficulty": "easy",
    "tags" : "array",
    "visibleTestCases" : 
    [
        {
             "input":"2 3",
             "output":"5",
             "explanation":"5"
        },
        {
            "input" : "-1 5",
            "output" : "4",
            "explanation" : "-1 + 5 equals 4"
        },
    ],
     "hiddenTestCases" :
    [
        {
             "input":"20 30",
             "output":"50"
        },
        {
            "input" : "-100 500",
            "output" : "400"
        },
    ],
    "startCode":[
        {
            "language" : "C++",
            "initialCode" :"#include<iostream>\n using namespace std;\n int main() {\n int a,b;\n      \\ Read input here \n cout<<a+b;\n return 0;\n}"       
        },
         {
            "language" : "java",
            "completeCode" : "import java.util.Scanner;\n\n   public class Main{\n    public static void main(String[] args) {\n    // Read input here\n    }\n}"
        },
        {
            "language" : "javascript",
            "completeCode" : "const  redline = require("redline");\n\n  //Complete input handeling here"
        }

    ],
    "referenceSolution" : 
    [
        {
            "language" : C++",
            "completeCode" : "#include<iostream>\n using namespace std;\n int main() {\n int a,b;\n cin>>a>>b;\n cout<<a+b;\n return 0;\n}"       
        },
        {
            "language" : "java",
            "completeCode" : "import java.util.Scanner;\n\n   public class Main{\n    public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n     int a = sc.nextInt();\n    int b = sc.nextInt();\n     System.out.println(a+b);\n  }\n}"
        },
        {
            "language" : "javascript",
            "completeCode" : "const  input = require("fs").readFileSync(0, "utf-8").trim()\n const [a,b] = input.split(" ").map(Number);\n  console.log(a+b);"
        }
    ]
    
}