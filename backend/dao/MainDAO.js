const { Sequelize, DataTypes } = require('sequelize');
//const { iniParams } = require('request-promise');

let sequelize;
let conn;

let connection;

//module.exports =
class MainDAO {
    constructor(connObj) {
        connection = connObj === undefined ? conn : connObj;
        this.init();
    }
    init = () => {
        console.log("connecting to db: ", JSON.stringify(connection));
        try {
            sequelize = new Sequelize(
                connection.database,
                connection.user,
                connection.password,
                {
                    host: connection.host,
                    port: connection.port,
                    dialect: connection.dialect
                }
            );
            sequelize.authenticate().then(() => {
                console.log("database connected");
            }).catch((error) => {
                console.error("Unable to connect: ", error);
            })
        } catch (e) {
            console.log("connect error:");
            console.log(e);
        }
    }
    query = async (qry, values) => {
        try {
            console.log("query:", qry);
            const results = await sequelize.query(qry, {
                replacements: values, type: sequelize.QueryTypes.SELECT
            });
            //  console.log(results);
            return results;
        } catch (ex) {
            console.log("query error:", ex);
            return { status: -1, message: "error", ex: ex };
        }
    }
    execute = async (query, values) => {
        const results = await sequelize.query(query, {
            replacements: values
        });
        return results;
    }

    call = async (sp, values) => {
        try {
            if (sp.indexOf("?") < 1 && values.length > 0) {
                let params = "(";
                for (const v of values) {
                    if (params.length > 1) {
                        params += ",?";
                    } else {
                        params += "?";
                    }
                }
                sp += params += ")";
            }
            console.log("call:", sp, values);

            return await sequelize.query("call " + sp, {
                replacements: values
            });
        } catch (ex) {
            console.log("dao.call.ex:", ex);
            return { status: -1, message: "error" }
        }
    }
    auth = async (user) => { // This is a good example of what to do.  
        const resp = await this.call("usp_user_auth", [user.username, user.password]);
        console.log("resp from database:", resp);

        return resp;
    }
    checkout = async (cart, user) => {
        try {
            let total = 0;
            console.log("dao.checkout:", user, cart, new Date());

            let values = [user.customer_id]
            let sp = "usp_order_save(?, null, 0, 0, null);";
            let resp = await this.call(sp, values);
            console.log(sp, "resp:", resp);
            if (resp[0].status !== 1) {
                return resp;
            }
            const orderId = resp[0].orderId;
            //call plants.usp_order_detail_save(0, 1, 3, 2, 100);
            console.log("checkout order id:", orderId);
            sp = "usp_order_detail_save(0,?,?,?,?);";
            for (let item of cart) {
                total += item.amount;
                values = [orderId, item.productId, item.quantity, item.amount];
                resp = await this.call(sp, values);
                console.log("add detail resp:", resp)
            }
            resp[0]['orderId'] = orderId;
            resp[0]['amount'] = total;
            return resp;
        } catch (ex) {
            console.log("checkout error", ex)
            return ex;
        }
    }
    payment = async (id, status) => { // This is a good example of what to do.
        try {
            console.log("resp usp_payment:", id, status);

            const resp = await this.call("usp_payment", [id, status]);
            console.log("resp usp_payment: resp:", resp);

            return resp;
        } catch (ex) {
            console.log(ex);
            return { status: -1, message: "Payment update failed" }
        }
    }
    saveContact = async (contact) => {
        try {
            console.log("(MyDAO.postContact.contact:", contact)
            const values = [
                contact.contactId | 0,
                contact.fullName,
                contact.email,
                contact.message,
                contact.joinMailList ? 1 : 0]
            console.log("values:", values.length, values);
            const resp = await this.call("usp_contact_save", values);

            console.log("(MyDAO.postContact.resp:", resp);

            return resp[0];
        } catch (ex) {
            return { status: -1, message: ex.message }
        }
    }
}
module.exports = MainDAO
