import http, { IncomingMessage, Server, ServerResponse } from "http";
import { createData, fetchAllData, addAllData, deleteData } from './engine'
/*
implement your server code here
*/

const server: Server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
    if (req.method === "POST" && req.url=="/data/add") {
      return createData(req, res)
    }else if(req.method === "GET" && req.url == "/data") {
      return fetchAllData(req, res)
    }else if(req.method === "PUT" && req.url == "/data/update"){
       return addAllData(req, res);
    }else if(req.method === "DELETE" && req.url == "/data/delete"){
      return deleteData(req, res);
   }
  }
);

server.listen(3005, () => console.log(`server is paying attention at port ${3005}`));