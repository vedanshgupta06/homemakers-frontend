import { useEffect, useState } from "react";
import api from "../../api/axios";

function PaymentHistory() {

  const [history, setHistory] = useState([]);

  useEffect(() => {
    api.get("/api/payments/history")
      .then(res => setHistory(res.data));
  }, []);

  return (
    <div>
      <h2>Payment History</h2>

      {history.length === 0 && <p>No transactions</p>}

      {history.map(txn => (
        <div key={txn.id} style={{border:"1px solid gray", margin:10, padding:10}}>

          <p><b>Amount:</b> ₹{txn.amount}</p>
          <p><b>Method:</b> {txn.method}</p>
          <p><b>Status:</b> {txn.status}</p>
          <p><b>Description:</b> {txn.description}</p>
          <p><b>Date:</b> {txn.createdAt}</p>

        </div>
      ))}

    </div>
  );
}

export default PaymentHistory;