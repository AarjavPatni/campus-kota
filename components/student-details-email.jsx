import * as React from "react";

export const EmailTemplate = ({ first_name, ...formDetails }) => {
  return (
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
      {/* Header */}
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
          Campus Kota Accommodation Confirmation
        </h1>
      </div>

      {/* Main Content */}
      <div style={{ padding: "32px 24px" }}>
        <p
          style={{
            fontSize: "16px",
            lineHeight: "1.6",
            marginBottom: "24px",
            color: "#e5e7eb",
          }}
        >
          Dear {first_name},<br />
          Welcome to Campus Kota! Here are your complete accommodation details:
        </p>

        {/* Details Table */}
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
              {/* Table rows showing all form fields */}
              <tr style={{ borderBottom: "1px solid #1f2937" }}>
                <td
                  style={{ padding: "12px 0", fontWeight: "600", width: "40%" }}
                >
                  Room Number
                </td>
                <td style={{ padding: "12px 0" }}>{formDetails.room_number}</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #1f2937" }}>
                <td style={{ padding: "12px 0", fontWeight: "600" }}>
                  Full Name
                </td>
                <td style={{ padding: "12px 0" }}>
                  {first_name} {formDetails.last_name}
                </td>
              </tr>
              <tr style={{ borderBottom: "1px solid #1f2937" }}>
                <td style={{ padding: "12px 0", fontWeight: "600" }}>
                  Father's Name
                </td>
                <td style={{ padding: "12px 0" }}>{formDetails.father_name}</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #1f2937" }}>
                <td style={{ padding: "12px 0", fontWeight: "600" }}>Course</td>
                <td style={{ padding: "12px 0" }}>{formDetails.course}</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #1f2937" }}>
                <td style={{ padding: "12px 0", fontWeight: "600" }}>
                  Institute
                </td>
                <td style={{ padding: "12px 0" }}>{formDetails.institute}</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #1f2937" }}>
                <td style={{ padding: "12px 0", fontWeight: "600" }}>
                  Student Mobile
                </td>
                <td style={{ padding: "12px 0" }}>
                  {formDetails.student_mobile}
                </td>
              </tr>
              <tr style={{ borderBottom: "1f2937" }}>
                <td style={{ padding: "12px 0", fontWeight: "600" }}>
                  Parent Mobile
                </td>
                <td style={{ padding: "12px 0" }}>{formDetails.parent_mobile}</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #1f2937" }}>
                <td style={{ padding: "12px 0", fontWeight: "600" }}>
                  Guardian Mobile
                </td>
                <td style={{ padding: "12px 0" }}>
                  {formDetails.guardian_mobile}
                </td>
              </tr>
              <tr style={{ borderBottom: "1px solid #1f2937" }}>
                <td style={{ padding: "12px 0", fontWeight: "600" }}>Address</td>
                <td style={{ padding: "12px 0" }}>{formDetails.address}</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #1f2937" }}>
                <td style={{ padding: "12px 0", fontWeight: "600" }}>
                  Security Deposit
                </td>
                <td style={{ padding: "12px 0" }}>
                  ₹{formDetails.security_deposit}
                </td>
              </tr>
              <tr style={{ borderBottom: "1px solid #1f2937" }}>
                <td style={{ padding: "12px 0", fontWeight: "600" }}>
                  Monthly Rent
                </td>
                <td style={{ padding: "12px 0" }}>₹{formDetails.monthly_rent}</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #1f2937" }}>
                <td style={{ padding: "12px 0", fontWeight: "600" }}>
                  Move-in Date
                </td>
                <td style={{ padding: "12px 0" }}>
                  {new Date(formDetails.start_date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
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
          <strong>Please note:</strong> Accommodation is confirmed subject to required payment of security deposit. This is an auto-generated email. Do NOT reply directly to this message.
        </div>
      </div>
    </div>
  );
};
