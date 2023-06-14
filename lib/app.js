"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
/*
implement your server code here
*/
const server = http_1.default.createServer((req, res) => {
    if (req.method === "GET") {
        res.end(JSON.stringify({ name: "hello" }));
    }
});
server.listen(3005);
