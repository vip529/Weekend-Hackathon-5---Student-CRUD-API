const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const port = 8080
app.use(express.urlencoded());
let studentArray = require("./InitialData");

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// your code goes here


app.get('/api/student',(req,res)=>{
    res.json(studentArray);
})

app.get('/api/student/:id',(req,res)=>{
    const id = req.params.id;
    const student = studentArray.filter((student)=>student.id === Number(id));
    if(student.length !== 0){
        res.json(student);
    }else{
        res.sendStatus(404);
        return;
    }

    ;
})

app.post('/api/student',(req,res)=>{
    const data = req.body;
    const {name,currentClass,division} = req.body;
    if(data && name && currentClass && division){
        const lastId = studentArray.length !== 0 ? studentArray[studentArray.length -1].id : -1;
        const newStudent = {
            id:lastId+1,
            name:name,
            currentClass:currentClass,
            division:division,

        }
        studentArray.push(newStudent);
        res.set('content-type','application/x-www-form-urlencoded');
        res.json(lastId+1);
    }else{
        res.sendStatus(400);
        return;
    }
})

app.put('/api/student/:id',(req,res)=>{
    const id = req.params.id;
    const data = req.body;
    
    if(data){

        if(Object.is(parseInt(id),NaN)){
            res.sendStatus(400);
        }else{
            let found = false;
            let validKey = ["name","currentClass","division"];
            for(let i =0; i<Object.keys(data).length; i++){
                found = validKey.includes(Object.keys(data)[i]);
            }
            if(!found){
                res.sendStatus(400);
                return;
            }else{
                let newStudents = [...studentArray];
                let idFound = false;
                newStudents = newStudents.map((student)=>{
                    if(student.id === Number(id)){
                        idFound = true;
                        let newS = {...student}
                        for(let i =0; i<Object.keys(data).length; i++){
                            newS[Object.keys(data)[i]] = data[Object.keys(data)[i]];
                        }
                        return newS;
                    }else{
                        return student
                    }
                })
                console.log(newStudents)
                if(!idFound){
                    if(Object.keys(data).length === 3){
                        const lastId = studentArray.length !== 0 ? studentArray[studentArray.length -1].id : -1;
                        const {name,currentClass,division} = data;
                        const newStudent = {
                            id:lastId+1,
                            name:name,
                            currentClass:currentClass,
                            division:division

                        }

                        studentArray.push(newStudent);
                        res.set('content-type','application/x-www-form-urlencoded')
                        res.send(studentArray)
                    }else{
                        res.sendStatus(400)
                    }
                }else{
                    studentArray = []
                    studentArray = [...newStudents]
                    res.set('content-type','application/x-www-form-urlencoded')
                    res.json(studentArray);
                }
                
            }
        }
    }else{
        res.sendStatus(400);
        return;
    }
})

app.delete('/api/student/:id',(req,res)=>{
    const id = req.params.id;
    const initialLength = studentArray.length;
    const filteredStudent = studentArray.filter((student)=> student.id !== Number(id));
    const finalLength = filteredStudent.length;

    if(initialLength > finalLength){
        studentArray = []
        studentArray = [...filteredStudent]
        console.log(studentArray);
    
        res.json('deleted');
    }else{
        res.sendStatus(400)
    }

})


app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;   