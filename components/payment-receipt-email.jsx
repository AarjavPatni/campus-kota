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
            <tr>
              <td colSpan="2" style={{ paddingBottom: "16px", fontWeight: "600", fontSize: "18px" }}>
                Payment Details
              </td>
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
            <tr style={{ borderBottom: "1px solid #1f2937" }}>
              <td style={{ padding: "12px 0", fontWeight: "600" }}>Receipt Number</td>
              <td style={{ padding: "12px 0" }}>{paymentDetails.receipt_no}</td>
            </tr>
            <tr style={{ borderBottom: "1px solid #1f2937" }}>
              <td style={{ padding: "12px 0", fontWeight: "600" }}>Invoice Key</td>
              <td style={{ padding: "12px 0" }}>{paymentDetails.invoice_key}</td>
            </tr>
            <tr style={{ borderBottom: "1px solid #1f2937" }}>
              <td style={{ padding: "12px 0", fontWeight: "600" }}>Room Name</td>
              <td style={{ padding: "12px 0" }}>{student.room_name}</td>
            </tr>
            <tr style={{ borderBottom: "1px solid #1f2937" }}>
              <td style={{ padding: "12px 0", fontWeight: "600" }}>Monthly Rent Paid</td>
              <td style={{ padding: "12px 0" }}>
                ₹{paymentDetails.monthly_rent}
              </td>
            </tr>
            <tr style={{ borderBottom: "1px solid #1f2937" }}>
              <td style={{ padding: "12px 0", fontWeight: "600" }}>Security Deposit Paid</td>
              <td style={{ padding: "12px 0" }}>
                ₹{paymentDetails.security_deposit}
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
        <strong>Note:</strong> This is an auto-generated payment receipt. Please
        keep this for your records. For any inquiries, please use the contact
        information below.
      </div>

      {/* Footer */}
      <div
        style={{
          backgroundColor: "#111827",
          padding: "32px 24px",
          textAlign: "center",
          fontSize: "14px",
          color: "#9ca3af",
          borderTop: "1px solid #1f2937",
        }}
      >
        <p style={{ margin: "0 0 12px 0" }}>
          Campus Kota
          <br />
          123 Academic Road, Nayapura
          <br />
          Kota, Rajasthan 324005
        </p>
        <p style={{ margin: "0 0 12px 0" }}>
          +91 94133 44653
          <br />
          +91 86904 61983
          <br />
          contact@campuskota.in
        </p>
      </div>
    </div>
  </div>
);
