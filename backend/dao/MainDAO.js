const { Sequelize, DataTypes } = require('sequelize');
//const { iniParams } = require('request-promise');
/*
CREATE USER 'devuser'@'%' IDENTIFIED BY 'Dev12345';
GRANT ALL PRIVILEGES ON *.* TO 'devuser'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
*/
let sequelize;
let conn;
const connLocal = {
    database: "plants",
    user: "devuser",
    password: "Dev2025",
    host: "127.0.0.1",
    port: 3306,
    dialect: "mysql"
}
conn = connLocal;
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
