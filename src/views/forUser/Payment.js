

import { useEffect, useState } from "react"
import { useAuth } from "../../context/AuthContext"

const Payment = () => {
  const { user } = useAuth()
  const [paymentHistory, setPaymentHistory] = useState([])

  useEffect(() => {
    
    setPaymentHistory([
      {
        id: 1,
        date: "2024-03-07",
        amount: "4000DH",
        method: "CCP",
        status: "Completed",
        sheepId: "SH-1001",
      },
    ])
  }, [])

  return (
    <div className="payment-page">
      <div className="payment-header">
        <h2 className="page-title">Payment History</h2>
      </div>

      <div className="payment-summary">
        <h3 className="summary-title">Summary</h3>
        <div className="summary-table">
          <div className="summary-header">
            <div className="summary-cell">Date</div>
            <div className="summary-cell">Amount</div>
            <div className="summary-cell">Method</div>
            <div className="summary-cell">Sheep ID</div>
            <div className="summary-cell">Status</div>
          </div>

          {paymentHistory.map((payment) => (
            <div key={payment.id} className="summary-row">
              <div className="summary-cell">{payment.date}</div>
              <div className="summary-cell">{payment.amount}</div>
              <div className="summary-cell">{payment.method}</div>
              <div className="summary-cell">{payment.sheepId}</div>
              <div className="summary-cell">
                <span className={`status-badge ${payment.status.toLowerCase()}`}>{payment.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {paymentHistory.length === 0 && (
        <div className="empty-state">
          <p>No payment history found.</p>
        </div>
      )}
    </div>
  )
}

export default Payment
