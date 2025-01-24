import paypal from 'paypal-rest-sdk';

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AaqYbfxdD4SVMj7TlcTLBDu-RAKh5dt2vMLET0DlJufG4XKHVpn_Km6wT5ADWN3EsNHX-gIjh_jceqHo',
    'client_secret': 'EMeeRt1-R43pZZ2lLRHaNmz50su-TjCIwCcX1o9yWYxLSn7NNm3oMRsoRrTIK77ueylbW35vreQETY73'
});

const createPayment = async (req, res) => {
    const { } = req.body;
    try {
        const paymentData = {
            intent: 'sale',
            payer: {
                payment_method: 'paypal'
            },
            redirect_urls: {
                return_url: 'http://localhost:3000/home',
                cancel_url: 'http://localhost:3000/cancel'
            },
            transactions: [{
                amount: {
                    total: '10.00',
                    currency: 'USD'
                },
                description: 'Sample payment description'
            }]
        }
        paypal.payment.create(paymentData, (error, payment) => {
            if (error) {
                res.status(500).json({ error: error.message });
            } else {
                const approvalUrl = payment.links.find(link => link.rel === 'approval_url').href;
                res.json({ approvalUrl });
            }
        });
    } catch ( error ) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
};

const executePayment = async (req, res) => {
    const paymentId = req.query.paymentId;
    const payerId = req.query.PayerID;
    paypal.payment.execute(paymentId, { payer_id: payerId }, (error, payment) => {
    if (error) {
        res.status(500).json({ error: error.message });
    } else {
        res.json({ success: true });
    }
  });
}

export {
    createPayment,
    executePayment
}