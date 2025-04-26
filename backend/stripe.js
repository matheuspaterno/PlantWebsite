
//import { addDonation } from "../dao/dao1.mjs";
const Stripe = require('stripe');
//const MainDAO = require("../dao/DAOClass.js");
/*
4242 4242 4242 4242
*/
//const stripe (process.env.STRIPE_PRIVATE_KEY);
const props = {
    id: 1,
    key: "sk_test_51R6dtu2KIZjH6PVUPWNYAqKqDiUTyGWUMbuLiFWy3rjP9CDpo3X8x8cqOycP9xbFRkIUfXIPUIZDCWAjNQkhYLpe003MEsbTnK",
    responseUrl: "http://44.198.80.99:4000/api/payment",
    description: "Purchase",
    amount: 99,
    quantity: 1,
    token: "Test1234"
}
module.exports =
    class Charge {

        charge = async (order) => {
            try {
                props.amount = order.amount;
                props.id = order.orderId
                //const dao = new MainDAO();
                //const key = await dao.getKeyValue("PAYMENT_API_KEY");
                //const reponseUrl = await dao.getKeyValue("PAYMENT_RESPONSE_URL");
                const stripe = new Stripe(props.key);

                console.log("DB.STRIPE_PRIVATE_KEY", props.key, "reponseUrl", props.responseUrl);


                const dt = new Date();
                // const id = dt.getTime();

                const lineItems = [
                    {
                        price_data: { currency: 'usd', product_data: { name: props.description }, unit_amount: props.amount * 100 },
                        quantity: props.quantity
                    }
                ];
                // const url = `${props.clientURL}/success/${id}/2024`;
                //console.log("URL:", url);
                const session = await stripe.checkout.sessions.create({
                    payment_method_types: ["card"],
                    mode: "payment",
                    line_items: lineItems,
                    client_reference_id: props.id,
                    success_url: `${props.responseUrl}/success/${props.id}-${props.token}`,
                    cancel_url: `${props.responseUrl}/cancel/${props.id}-${props.token}`,
                })
                console.log("STRIPE SESSION", session, "URL:", session.url);
                return { status: 200, url: session.url };
            } catch (e) {
                console.log(e);
                return { status: -1, error: "Error" };
            }
        }
    }
