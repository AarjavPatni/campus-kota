import * as React from 'react';

export const UpdateEmailTemplate = ({ changes, student }) => (
  <div style={{ 
    fontFamily: "'Inter', sans-serif",
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: '#0a0a0a',
    borderRadius: '8px',
    overflow: 'hidden',
    border: '1px solid #1f2937'
  }}>
    {/* Header */}
    <div style={{ 
      backgroundColor: '#111827',
      padding: '32px 24px',
      textAlign: 'center',
      borderBottom: '1px solid #1f2937'
    }}>
      <h1 style={{ 
        color: '#ffffff',
        fontSize: '24px',
        margin: 0,
        fontWeight: '600',
        letterSpacing: '-0.5px'
      }}>
        Campus Kota Record Update
      </h1>
    </div>

    {/* Main Content */}
    <div style={{ padding: '32px 24px' }}>
      <p style={{ 
        fontSize: '16px',
        lineHeight: '1.6',
        marginBottom: '24px',
        color: '#e5e7eb'
      }}>
        The following changes were made to {student.first_name}'s record:
      </p>

      {/* Changes Table */}
      <div style={{ 
        backgroundColor: '#111827',
        borderRadius: '6px',
        padding: '20px',
        marginBottom: '24px',
        border: '1px solid #1f2937'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', color: '#f3f4f6' }}>
          <tbody>
            {Object.entries(changes).map(([field, values]) => (
              <tr key={field} style={{ borderBottom: '1px solid #1f2937' }}>
                <td style={{ padding: '12px 0', fontWeight: '600', width: '40%' }}>
                  {field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </td>
                <td style={{ padding: '12px 0' }}>
                  <div style={{ color: '#ef4444', textDecoration: 'line-through' }}>
                    {formatValue(field, values.old)}
                  </div>
                  <div style={{ color: '#10b981', marginTop: '4px' }}>
                    {formatValue(field, values.new)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Student Info */}
      <div style={{ 
        backgroundColor: '#1f2937',
        borderRadius: '6px',
        padding: '20px',
        marginBottom: '32px',
        border: '1px solid #1f2937'
      }}>
        <h3 style={{ 
          color: '#ffffff',
          fontSize: '16px',
          marginBottom: '12px',
          fontWeight: '600'
        }}>
          Current Student Details
        </h3>
        <div style={{ color: '#9ca3af', lineHeight: '1.5' }}>
          <div>Room: {student.room_number}</div>
          <div>Name: {student.first_name} {student.last_name}</div>
          <div>Contact: {student.student_mobile}</div>
        </div>
      </div>

      {/* Auto-generated Notice */}
      <div style={{ 
        backgroundColor: '#1f2937',
        borderRadius: '6px',
        padding: '20px',
        margin: '0 0 32px 0',
        border: '1px solid #1f2937',
        fontSize: '14px',
        color: '#9ca3af',
        lineHeight: '1.5'
      }}>
        <strong>Note:</strong> This is an auto-generated update notification.
      </div>
    </div>
  </div>
);

// Helper function to format values based on field type
const formatValue = (field, value) => {
  if (!value) return 'N/A';
  
  // Format dates
  if (field.includes('_date')) {
    return new Date(value).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }
  
  // Format currency fields
  if (['security_deposit', 'monthly_rent', 'laundry_charge', 'other_charge'].includes(field)) {
    return `₹${Number(value).toLocaleString('en-IN')}`;
  }
  
  // Format boolean values
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  
  return value.toString();
}; 