const fs = require("fs");

const PORT = process.env.PORT || 4000;
const bodyParser = require('body-parser');
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const MainDAO = require("./dao/MainDAO");
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

const GC_PUBLIC_DIR = path.join(__dirname + '/public/index.html').split("index.html")[0];

const dao = new MainDAO();
let ssn;
const GC_RELEASE = "2025-01-21";
app.get("/", (req, res) => {
    res.sendFile(GC_PUBLIC_DIR + "index.html");
});
app.get("/release", (req, res) => {
    res.send({ release: GC_RELEASE, dateTime: new Date() });
});
app.get("/contactus", (req, res) => {
    res.sendFile(GC_PUBLIC_DIR + "contactus.html");
});
app.get("/contacts", async (req, res) => {
    try {
        const rows = await dao.query("SELECT * FROM contacts")
        res.send(rows);
    } catch (ex) {
        res.send({ status: 404, message: "Error getting contacts", ex: ex });
    }
})
// call plants.usp_customer_save(0, 'Flintstone', 'Fred', 'fredflintstone@gmail.com', 'rockandroll', '1111111111',
// '12 stone rd', 'bedrock', 'MA', '01234');
app.post('/customer', async (req, res) => {
    try {
        const values = [
            req.body.customerId,
            req.body.lastName,
            req.body.firstName,
            req.body.email,
            req.body.password,
            req.body.phoneNumber,
            req.body.street,
            req.body.city,
            req.body.state,
            req.body.zipCode
        ]
        console.log("post customer", req.body);
        const rows = await dao.call("usp_customer_save", values);
        console.log("sp response", rows);
        res.send(rows); // sends response from db stored procedure to client
    } catch (ex) {
        res.send({ status: 404, message: "Error getting contacts", ex: ex });
    }
})
app.put('/customer/:customerId', async (req, res) => {
    try {
        const values = [
            req.params.customerId,
            req.body.lastName,
            req.body.firstName,
            req.body.email,
            req.body.password,
            req.body.phoneNumber,
            req.body.street,
            req.body.city,
            req.body.state,
            req.body.zipCode
        ]
        console.log("post customer", req.body);
        const rows = await dao.call("usp_customer_save", values);
        console.log("sp response", rows);
        res.send(rows);
    } catch (ex) {
        res.send({ status: 404, message: "Error getting contacts", ex: ex });
    }
})
app.post('/auth', async (req, res) => {
    try {
        const values = [req.body.email, req.body.password];
        console.log("auth", values);
        const rows = await dao.call("usp_user_auth", values);
        console.log("sp response", rows);
        res.send(rows);
    } catch (ex) {
        res.send({ status: 404, message: "Error authenticating user", ex: ex });
    }
});

/*
call plants.usp_product_save(1, 1, 'Tulips', 'The Best Boston Tulips', 50,100 , 'tulips1.jpeg,tulips2.jpeg');
*/
app.post('/product', async (req, res) => {
    try {
        const values = [
            req.body.productId,
            req.body.catId,
            req.body.productName,
            req.body.description,
            req.body.price,
            req.body.qoh,
            req.body.images
        ]
        console.log("post product", req.body);
        const rows = await dao.call("usp_product_save", values);
        console.log("sp response", rows);
        res.send(rows); // sends response from db stored procedure to client
    } catch (ex) {
        res.send({ status: 404, message: "Error getting contacts", ex: ex });
    }
})
app.get("/products", async (req, res) => {
    try {
        const rows = await dao.query("SELECT * FROM products")
        res.send(rows);
    } catch (ex) {
        res.send({ status: 404, message: "Error getting contacts", ex: ex });
    }
})

app.get("/products/cat/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const rows = await dao.query("SELECT * FROM products WHERE cat_id=?", [id])
        res.send(rows);
    } catch (ex) {
        res.send({ status: 404, message: "Error getting contacts", ex: ex });
    }
})
app.get("/contact/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const rows = await dao.query("SELECT * FROM contacts WHERE contact_id=?", [id])
        res.send(rows[0]);
    } catch (ex) {
        res.send({ status: 404, message: "Error getting contacts", ex: ex });
    }
})
app.post("/contactus", async (req, res) => {
    const body = req.body;
    const resp = await dao.saveContact(body);
    console.log("post contact us:", resp)
    res.send(resp);
});
app.post("/login", async (req, res) => {
    const body = req.body;
    const resp = await dao.saveContact(body);
    console.log("post contact us:", resp)
    res.send(resp);
});
app.listen(PORT, () => {
    console.log("listening on port:", PORT);
});
