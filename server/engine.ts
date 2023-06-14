import fs from 'fs';
import path from 'path';
import { IncomingMessage, ServerResponse } from 'http';

interface Organizations {
    organization: string;
    createdAt: string;
    updatedAt: string;
    products: string[];
    marketValue: string;
    address: string;
    ceo: string;
    country: string;
    id: number;
    noOfEmployees: number;
    employees: string[];
}

export const createData = (req: IncomingMessage, res: ServerResponse) => {
    let datas = "";

    req.on("data", (chunk) => {
        datas += chunk;
    })
    req.on("end", () => {
        let work = JSON.parse(datas)

        let databaseFolder = path.join(__dirname, "database")
        let databaseFile = path.join(databaseFolder, "database.json")

        if(!fs.existsSync(databaseFolder)){
            fs.mkdirSync(databaseFolder)
        }
        if(!fs.existsSync(databaseFile)){
            fs.writeFileSync(databaseFile, "")
        }

        return fs.readFile(path.join(__dirname, "database/database.json"), "utf-8", (err, info) => {
            if(err){
                res.writeHead(500, {"content-Type": "application/json"});
                res.end(JSON.stringify({
                    success: false,
                    error: err
                }))
            }else {
                let organization: Organizations[] = []

                try{
                    organization = JSON.parse(info)
                }catch(parseError){
                    organization = []
                }

                work.createdAt = new Date();
                work.updatedAt = new Date();
                work.noOfEmployees = work.employees.length;
                if(organization.length === 0){
                    work.id = 1
                }else{
                    let ids = organization.map((a=>a.id))
                    let newId = Math.max(...ids)
                    work.id = newId + 1
                }
                organization.push(work)

                fs.writeFile(path.join(__dirname, "database/database.json"), JSON.stringify(organization, null, 2), (err) =>{
                    if(err){
                        res.writeHead(500, {"Content-Type": "application/json"});
                        res.end(JSON.stringify({
                            success: false,
                            error: err
                        }))
                    }else{
                        res.writeHead(200, {"Content-Type": "application/json"});
                        res.end(
                            JSON.stringify({
                                success: true,
                                message: work
                            })
                        )

                    }
                })
            }
        })
    })
}

// Get All Data
export const fetchAllData = (req: IncomingMessage, res: ServerResponse) => {
    return fs.readFile(path.join( __dirname, "./database/database.json"), "utf-8", (err, info) =>{
        if(err){
            res.writeHead(500, {"Content-Type":"application/json"});
            res.end(JSON.stringify({
                success: false,
                error: err
            }))
        }else{
            res.writeHead(200, {"Content-Type":"application/json"});
            res.end(JSON.stringify({
                success: true,
                data: JSON.parse(info)
            }))
        }
    })
}

// UPDATE DATA
export const addAllData = (req: IncomingMessage, res: ServerResponse) => {
    let data = ""

    req.on("data", (chunk) => {
        data += chunk;
    })

    req.on("end", () => {
        let result = JSON.parse(data)
        let organization: Organizations[]

        return fs.readFile (path.join(__dirname, "./database/database.json"), "utf-8", (err, info) => {
            if(err){
                res.writeHead(500, {"Content-Type": "application/json"})
                res.end(JSON.stringify({
                    success: false,
                    error: err
                }))
            }else{
                organization = JSON.parse(info)
            }

            let addAllData = organization.findIndex((a) => a.id === result.id)
            organization[addAllData] = result

            result.updatedAt = new Date();

            fs.writeFile(path.join(__dirname, "./database/database.json"), JSON.stringify(organization, null, 2), "utf-8", (err) => {
                if (err){
                    res.writeHead(500, {"Content-Type": "application/json"})
                    res.end(JSON. stringify({
                        success: false,
                        error: err
                    }))
                }else{
                    res.writeHead(200, {"Content-Type": "application/json"})
                    res.end(
                        JSON.stringify({
                            success: true,
                            message: "data successfully added"
                        })
                    )
                }
            })
        })
    })
}

// DELETE DATA
export const deleteData = (req: IncomingMessage, res: ServerResponse) => {
    let data = ""

    req.on("data", (chunk) => {
        data += chunk;
    })
    req.on("end", () => {
        //started preparing the data
        let result = JSON.parse(data)
        let organization: Organizations[]

        return fs.readFile (path.join(__dirname, "./database/database.json"), "utf-8",  (err, info) => {
            if (err){
                res.writeHead(500,{"Content-Type": "application/json"})
                res.end(JSON.stringify({
                    success: false,
                    error: err
                }))
            }else{
                organization = JSON.parse(info)
            }

            let deleteData = organization.findIndex((a) => a.id === result.id) //check if you can add Index to addAllData
            organization.splice(deleteData, 1)

            fs.writeFile(path.join(__dirname, "./database/database.json"), JSON.stringify(organization, null, 2), "utf-8", (err) => {
                if (err){
                    res.writeHead(500,{"Content-Type": "application/json"})
                    res.end(JSON.stringify({
                        success: false,
                        error: err
                    }))
                }else{
                    res.writeHead(200, {"Content-Type": "application/json"})
                    res.end(
                        JSON.stringify({
                            success: true,
                            message: "data successfully deleted"
                        })
                    )
                }

            })
        })


    })
}