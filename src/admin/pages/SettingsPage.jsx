import { useState } from "react";
import { Save, Trash2, AlertTriangle } from "lucide-react";
import { useAdminAuth } from "../context/AdminAuthContext.jsx";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const { admin } = useAdminAuth();
  const [store, setStore] = useState({
    name: "LuxeMarket",
    email: "richzion@luxemarket.com",
    phone: "+234 803 983 0412",
    address: "001 Richzion Drive, Victoria Island, Lagos",
    currency: "NGN",
    rate: "1600",
  });
  const setS = (f) => (e) => setStore((v) => ({ ...v, [f]: e.target.value }));
  const save = () => toast.success("Settings saved!");

  const inputStyle = {
    width: "100%",
    backgroundColor: "#f9fafb",
    border: "1.5px solid #e5e7eb",
    color: "#111827",
    borderRadius: "8px",
    padding: "9px 12px",
    fontSize: "0.82rem",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "DM Sans, sans-serif",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };

  const labelStyle = {
    display: "block",
    fontSize: "0.72rem",
    fontWeight: "700",
    color: "#374151",
    marginBottom: "6px",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  };

  const Section = ({ title, children }) => (
    <div
      style={{
        backgroundColor: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      }}
    >
      <h3
        style={{
          fontSize: "0.9rem",
          fontWeight: "700",
          color: "#111827",
          margin: "0 0 16px",
          paddingBottom: "10px",
          borderBottom: "1px solid #f3f4f6",
        }}
      >
        {title}
      </h3>
      {children}
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <h1
          style={{
            fontSize: "1.1rem",
            fontWeight: "800",
            color: "#111827",
            margin: "0 0 2px",
            fontFamily: "DM Sans, sans-serif",
          }}
        >
          Settings
        </h1>
        <p style={{ fontSize: "0.75rem", color: "#6b7280", margin: 0 }}>
          Manage your store configuration
        </p>
      </div>

      {/* Store info */}
      <Section title="🏪 Store Information">
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
            gap: "14px",
          }}
        >
          {[
            { label: "Store Name", field: "name", placeholder: "LuxeMarket" },
            {
              label: "Contact Email",
              field: "email",
              placeholder: "hello@luxemarket.com",
            },
            { label: "Phone Number", field: "phone", placeholder: "+234..." },
            {
              label: "Address",
              field: "address",
              placeholder: "Store address",
            },
          ].map(({ label, field, placeholder }) => (
            <div key={field}>
              <label style={labelStyle}>{label}</label>
              <input
                value={store[field]}
                onChange={setS(field)}
                placeholder={placeholder}
                style={inputStyle}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#4f7d52";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 3px rgba(79,125,82,0.1)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#e5e7eb";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>
          ))}
        </div>
        <button
          onClick={save}
          style={{
            marginTop: "16px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "9px 20px",
            backgroundColor: "#4f7d52",
            border: "none",
            borderRadius: "8px",
            color: "#fff",
            fontSize: "0.8rem",
            fontWeight: "700",
            cursor: "pointer",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#3d6440")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#4f7d52")
          }
        >
          <Save style={{ width: "14px", height: "14px" }} /> Save Store Info
        </button>
      </Section>

      {/* Admin profile */}
      <Section title="👤 Admin Profile">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            padding: "14px",
            backgroundColor: "#f0fdf4",
            border: "1px solid #a3c4a5",
            borderRadius: "10px",
            marginBottom: "14px",
          }}
        >
          <img
            src={admin?.avatar}
            alt={admin?.name}
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              border: "2px solid #a3c4a5",
            }}
          />
          <div>
            <p
              style={{
                fontWeight: "700",
                color: "#111827",
                fontSize: "0.9rem",
                margin: "0 0 2px",
              }}
            >
              {admin?.name}
            </p>
            <p
              style={{
                color: "#6b7280",
                fontSize: "0.78rem",
                margin: "0 0 2px",
              }}
            >
              {admin?.email}
            </p>
            <span
              style={{
                fontSize: "0.68rem",
                backgroundColor: "#4f7d52",
                color: "#fff",
                padding: "2px 8px",
                borderRadius: "99px",
                fontWeight: "700",
                textTransform: "capitalize",
              }}
            >
              {admin?.role}
            </span>
          </div>
        </div>
        <p style={{ fontSize: "0.78rem", color: "#6b7280" }}>
          To update your profile, please re-register with the new details or
          contact the system administrator.
        </p>
      </Section>

      {/* Payment */}
      <Section title="💳 Payment Settings">
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
            gap: "14px",
          }}
        >
          {[
            { label: "Payment Gateway", value: "Paystack", readOnly: true },
            {
              label: "Currency",
              value: "NGN (Nigerian Naira)",
              readOnly: true,
            },
            {
              label: "USD → NGN Rate",
              value: store.rate,
              field: "rate",
              readOnly: false,
            },
            {
              label: "Public Key (set in PaymentPage.jsx)",
              value: "pk_test_xxx...",
              readOnly: true,
            },
          ].map((item) => (
            <div key={item.label}>
              <label style={labelStyle}>{item.label}</label>
              <input
                value={item.value}
                onChange={item.field ? setS(item.field) : undefined}
                readOnly={item.readOnly}
                style={{
                  ...inputStyle,
                  cursor: item.readOnly ? "not-allowed" : "text",
                  color: item.readOnly ? "#9ca3af" : "#111827",
                }}
                onFocus={(e) => {
                  if (!item.readOnly) {
                    e.currentTarget.style.borderColor = "#4f7d52";
                    e.currentTarget.style.boxShadow =
                      "0 0 0 3px rgba(79,125,82,0.1)";
                  }
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#e5e7eb";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>
          ))}
        </div>
        <button
          onClick={save}
          style={{
            marginTop: "16px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "9px 20px",
            backgroundColor: "#4f7d52",
            border: "none",
            borderRadius: "8px",
            color: "#fff",
            fontSize: "0.8rem",
            fontWeight: "700",
            cursor: "pointer",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#3d6440")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#4f7d52")
          }
        >
          <Save style={{ width: "14px", height: "14px" }} /> Save Payment
          Settings
        </button>
      </Section>

      {/* Danger zone */}
      <div
        style={{
          backgroundColor: "#fff",
          border: "1.5px solid #fecaca",
          borderRadius: "12px",
          padding: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "10px",
          }}
        >
          <AlertTriangle
            style={{ width: "16px", height: "16px", color: "#dc2626" }}
          />
          <h3
            style={{
              fontSize: "0.9rem",
              fontWeight: "700",
              color: "#dc2626",
              margin: 0,
            }}
          >
            Danger Zone
          </h3>
        </div>
        <p
          style={{
            fontSize: "0.78rem",
            color: "#6b7280",
            marginBottom: "14px",
          }}
        >
          These actions are permanent and cannot be undone.
        </p>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {[
            {
              label: "Clear All Orders",
              action: () => {
                if (confirm("Delete ALL orders?")) {
                  localStorage.removeItem("lm_orders");
                  toast.success("All orders cleared");
                }
              },
            },
            {
              label: "Clear All Customers",
              action: () => {
                if (confirm("Delete ALL customers?")) {
                  localStorage.removeItem("lm_users");
                  localStorage.removeItem("lm_session");
                  toast.success("All customers cleared");
                }
              },
            },
            {
              label: "Clear Custom Products",
              action: () => {
                if (confirm("Delete all custom products?")) {
                  localStorage.removeItem("lm_custom_products");
                  toast.success("Custom products cleared");
                }
              },
            },
          ].map((item) => (
            <button
              key={item.label}
              onClick={item.action}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "8px 14px",
                backgroundColor: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "7px",
                color: "#dc2626",
                fontSize: "0.78rem",
                fontWeight: "700",
                cursor: "pointer",
                transition: "background-color 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#fee2e2")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#fef2f2")
              }
            >
              <Trash2 style={{ width: "13px", height: "13px" }} /> {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
