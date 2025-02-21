import * as React from "react";

export const PaymentReceiptEmail = ({ paymentDetails, student }) => (
  <div
    style={{
      fontFamily: "'Inter', sans-serif",
      maxWidth: "600px",
      margin: "0 auto",
      backgroundColor: "#0a0a0a",
      borderRadius: "8px",
      overflow: "hidden",
      border: "1px solid #1f2937",
    }}
  >
    <div
      style={{
        backgroundColor: "#111827",
        padding: "32px 24px",
        textAlign: "center",
        borderBottom: "1px solid #1f2937",
      }}
    >
      <h1
        style={{
          color: "#ffffff",
          fontSize: "24px",
          margin: 0,
          fontWeight: "600",
          letterSpacing: "-0.5px",
        }}
      >
        Payment Receipt - Campus Kota
      </h1>
    </div>

    <div style={{ padding: "32px 24px" }}>
      <div
        style={{
          backgroundColor: "#111827",
          borderRadius: "6px",
          padding: "20px",
          marginBottom: "24px",
          border: "1px solid #1f2937",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            color: "#f3f4f6",
          }}
        >
          <tbody>
            <tr style={{ borderBottom: "1px solid #1f2937" }}>
              <td style={{ padding: "12px 0", fontWeight: "600" }}>Receipt Number</td>
              <td style={{ padding: "12px 0" }}>{paymentDetails.receipt_no}</td>
            </tr>
            <tr style={{ borderBottom: "1px solid #1f2937" }}>
              <td style={{ padding: "12px 0", fontWeight: "600" }}>Payment Date</td>
              <td style={{ padding: "12px 0" }}>
                {new Date(paymentDetails.payment_date).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </td>
            </tr>
            <tr style={{ borderBottom: "1px solid #1f2937" }}>
              <td style={{ padding: "12px 0", fontWeight: "600" }}>Payment Method</td>
              <td style={{ padding: "12px 0" }}>{paymentDetails.payment_method}</td>
            </tr>
            <tr>
              <td style={{ padding: "12px 0", fontWeight: "600", fontSize: "18px", color: "#1d4ed8" }}>Total Receipts</td>
              <td style={{ padding: "12px 0", fontSize: "18px", color: "#1d4ed8", fontWeight: "600" }}>
                ₹{paymentDetails.total_amount}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Auto-generated Notice */}
      <div
        style={{
          backgroundColor: "#1f2937",
          borderRadius: "6px",
          padding: "20px",
          margin: "0 0 32px 0",
          border: "1px solid #1f2937",
          fontSize: "14px",
          color: "#9ca3af",
          lineHeight: "1.5",
        }}
      >
        <strong>Note:</strong> UPI or Cheque payments are subject to clearance. This is an auto-generated email. Do NOT reply directly to this message.
      </div>
    </div>
  </div>
);
