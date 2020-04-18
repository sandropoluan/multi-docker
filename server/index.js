import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { Pool } from "pg";
import redis from "redis";
import keys from "./keys";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Postgres client setup
const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort
});

pgClient.on("error", () => console.log("Lost PG connection"));

pgClient.query("CREATE TABLE IF NOT EXISTS values (number INT)").catch(error => {
    console.log(error);
});

// Redis client setup
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});

const redisPublisher = redisClient.duplicate();

app.get("/", (req, res) => {
    res.send("Hi");
});

app.get("/values/all", async (req, res) => {
    const values = await pgClient.query("SELECT * FROM values");

    res.send(values.rows);
});

app.get("/values/current", async (req, res) => {
    redisClient.hgetall("values", (error, values) => {
        res.send(values);
    });
});


app.post("/values", async (req, res) => {
    const { index } = req.body;

    if (parseInt(index) > 40) {
        res.status(422).send("Index too high")
    } else {
        redisClient.hset("values", index, 'Nothing Yet!');
        redisPublisher.publish("insert", index);
        pgClient.query("INSERT INTO values(number) VALUES($1)", [index]);

        res.send({
            working: true
        })
    }
}); 


app.listen(5000, error=>{
    console.log("Listening 5000")
})