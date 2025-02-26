const fs = require("fs");
require("dotenv").config();
const PORT = process.env.PORT || 4000;
const bodyParser = require('body-parser');
const express = require("express");
const session = require("express-session");
const app = express();  // node module to handle requests (get, post, put, delete) with client.
const path = require("path");
const cors = require("cors");
const MainDAO = require("./dao/MainDAO");
app.use(express.json());
app.use(cors());


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
const GC_PUBLIC_DIR = path.join(__dirname + '/public/index.html').split("index.html")[0];

app.use(session({ secret: "XASDASDA" }));

const dao = new MainDAO(JSON.parse(process.env.DB_CONN));
let ssn;
const GC_RELEASE = "2025-02-25";
// don't need
app.get("/", (req, res) => {
    res.sendFile(GC_PUBLIC_DIR + "index.html");
});

app.get("/release", (req, res) => {
    res.send({ release: GC_RELEASE, dateTime: new Date() });
});
// don't need
app.get("/contactus", (req, res) => {
    res.sendFile(GC_PUBLIC_DIR + "contactus.html");
});
// don't need
app.get("/contacts", async (req, res) => {
    try {
        const rows = await dao.query("SELECT * FROM contacts")
        res.send(rows);
    } catch (ex) {
        res.send({ status: 404, message: "Error getting contacts", ex: ex });
    }
})

// test in thunder client
app.post('/cart', async (req, res) => {
    ssn = req.session;
    const item = req.body;
    const cart = (ssn['cart'] === undefined ? [] : ssn['cart']);
    let found = false;
    for (let i in cart) {
        if (cart[i].productId === item.productId) {
            cart[i].quantity = item.quantity;
            cart[i].amount = item.amount;
            found = true;
            break;
        }
    }
    if (!found) {
        cart.push(item);
    }

    ssn.cart = cart;
    console.log("post to cart", cart)
    res.send(cart);
});

// test in thunder client
app.get("/cart", (req, res) => {
    ssn = req.session;
    try {
        if (ssn['cart'] === undefined) {
            res.send({ status: 404, message: "empty cart" })
        }
        res.send(ssn['cart'])
    } catch (ex) {
        console.log("get cart error:", ex);
        res.send({ status: 404, message: "get cart error:", ex: ex })
    }
});
// test in thunder client
app.delete("/cart/:id", (req, res) => {
    try {
        ssn = req.session;
        const cart = ssn.cart;
        const id = req.params.id;
        for (let i in cart) {
            if (cart[i].productId === parseInt(id)) {
                console.log("deleting ", cart[i])
                cart.splice(i, 1);
                break;
            }
        }
        ssn.cart = cart;
        res.send({ status: 200, message: `Item ${id} removed from cart` });
    } catch (ex) {
        res.send({ status: 404, message: "Error removing from cart", ex: ex })
    }
});
// test in thunder client
app.get("/checkout", async (req, res) => {
    try {
        ssn = req.session;
        const user = ssn.user;
        const cart = ssn.cart;

        console.log("checkout:", user, cart)
        const resp = await dao.checkout(cart, user);
        res.send(resp);
    } catch (ex) {
        res.send({ status: 404, message: "Error removing from cart", ex: ex })
    }
});
// call plants.usp_customer_save(0, 'Flintstone', 'Fred', 'fredflintstone@gmail.com', 'rockandroll', '1111111111',
// '12 stone rd', 'bedrock', 'MA', '01234');
// test in thunder client
app.post('/customer', async (req, res) => {
    try {
        /*
        if ((req.body.productName + "").length < 2) {
            res.send({ status: -1, message: "Product Length too short" });
            return;
        }
            */
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
// test in thunder client
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
// test in thunder client
app.post('/auth', async (req, res) => {
    try {
        const values = [req.body.email, req.body.password];
        console.log("auth", values);
        const rows = await dao.call("usp_user_auth", values);
        const user = rows[0];

        console.log("sp response", rows);
        if (user.status === 1) {
            ssn = req.session;
            ssn['user'] = user;
        }
        res.send(user);
    } catch (ex) {
        res.send({ status: 404, message: "Error authenticating user", ex: ex });
    }
});
// test in thunder client
app.get("/user", async (req, res) => {
    const user = ssn.user;
    console.log("get user in session:", user);
    res.send(user);
});
/*
call plants.usp_product_save(1, 1, 'Tulips', 'The Best Boston Tulips', 50,100 , 'tulips1.jpeg,tulips2.jpeg');
{
    "productId":0,
    "catId":1,
    "productName":"Snake Plant",
    "description"Very hardy, tolerates low light and neglect.",
    "price":10,
    "qoh":100,
    "images":"File name on server"
}
*/
// test in thunder client
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
// test in thunder client
app.put('/product/:id', async (req, res) => {
    try {
        const values = [
            req.params.id,
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
// test in thunder client
app.get("/products", async (req, res) => {
    try {
        const rows = await dao.query("SELECT * FROM products")
        res.send(rows);
    } catch (ex) {
        res.send({ status: 404, message: "Error getting contacts", ex: ex });
    }
})
// test in thunder client
app.get("/products/cat/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const rows = await dao.query("SELECT * FROM products WHERE cat_id=?", [id])
        res.send(rows);
    } catch (ex) {
        res.send({ status: 404, message: "Error getting contacts", ex: ex });
    }
})
// test in thunder client
app.get("/contact/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const rows = await dao.query("SELECT * FROM contacts WHERE contact_id=?", [id])
        res.send(rows[0]);
    } catch (ex) {
        res.send({ status: 404, message: "Error getting contacts", ex: ex });
    }
})

// don't need
app.post("/contactus", async (req, res) => {
    const body = req.body;
    const resp = await dao.saveContact(body);
    console.log("post contact us:", resp)
    res.send(resp);
});
// don't need
app.post("/login", async (req, res) => {
    const body = req.body;
    const resp = await dao.saveContact(body);
    console.log("post contact us:", resp)
    res.send(resp);
});
app.listen(PORT, () => {
    console.log("listening on port:", PORT);
});
