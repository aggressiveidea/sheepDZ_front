"use client"

import { useState, useEffect } from "react"
import Sidebar from "../../components/sideBar"
import Header from "../../components/Header"
import "../../styles/Payment.css"

const UserPayment = () => {
  const [payments, setPayments] = useState([])

  useEffect(() => {
    setPayments([
      {
        id: 1,
        date: "2024-06-07",
        method: "VISA CARD",
        amount: "CDF",
        status: "SETTLED",
      },
    ])
  }, [])

  return (
    <div className="dashboard-container">
      <Sidebar userType="user" />
      <div className="main-content">
        <Header title="Payment History" />
        <div className="payment-content">
          <div className="payment-summary">
            <h2>Summary</h2>
            <div className="payment-table">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Method</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id}>
                      <td>{payment.date}</td>
                      <td>{payment.method}</td>
                      <td>{payment.amount}</td>
                      <td>
                        <span className={`status ${payment.status.toLowerCase()}`}>{payment.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserPayment
