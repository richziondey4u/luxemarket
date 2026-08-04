import { useState, useEffect } from "react";
import { MapPin, Edit3, Save } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

const NG_STATES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
];

export default function Address() {
  const { user, updateAddress } = useAuth();
  const [saving, setSaving] = useState(false);
  const [editAddress, setEditAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "Lagos",
    zip: user?.address?.zip || "",
  });

  useEffect(() => {
    setAddressForm({
      street: user?.address?.street || "",
      city: user?.address?.city || "",
      state: user?.address?.state || "Lagos",
      zip: user?.address?.zip || "",
    });
  }, [user]);
  const saveAddress = async () => {
    setSaving(true);
    await updateAddress(addressForm);
    setEditAddress(false);
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold text-white">
          Shipping Address
        </h2>
        {!editAddress && (
          <button
            onClick={() => setEditAddress(true)}
            className="btn-outline text-sm py-2 gap-1"
          >
            <Edit3 className="w-4 h-4" /> Edit
          </button>
        )}
      </div>

      <div className="card-dark rounded-2xl p-6 border border-white/8">
        {editAddress ? (
          <div className="space-y-4">
            {[
              {
                label: "Street Address",
                field: "street",
                ph: "House number, street",
              },
              { label: "City", field: "city", ph: "City" },
              { label: "ZIP Code", field: "zip", ph: "Postal code" },
            ].map(({ label, field, ph }) => (
              <div key={field}>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  {label}
                </label>
                <input
                  value={addressForm[field]}
                  onChange={(e) =>
                    setAddressForm((f) => ({ ...f, [field]: e.target.value }))
                  }
                  placeholder={ph}
                  className="input-field"
                />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                State
              </label>
              <select
                value={addressForm.state}
                onChange={(e) =>
                  setAddressForm((f) => ({ ...f, state: e.target.value }))
                }
                className="input-field"
              >
                {NG_STATES.map((s) => (
                  <option key={s} value={s} className="bg-slate-900">
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={saveAddress}
                disabled={saving}
                className="btn-primary gap-2 py-2.5"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Save
                  </>
                )}
              </button>
              <button
                onClick={() => setEditAddress(false)}
                className="btn-secondary py-2.5"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : user?.address ? (
          <div className="space-y-1.5">
            <p className="text-white font-medium">{user.name}</p>
            <p className="text-slate-400">{user.address.street}</p>
            <p className="text-slate-400">
              {user.address.city}, {user.address.state} {user.address.zip}
            </p>
            <p className="text-slate-400">Nigeria</p>
            {user.phone && <p className="text-slate-400">{user.phone}</p>}
          </div>
        ) : (
          <div className="text-center py-8">
            <MapPin className="w-12 h-12 text-slate-700 mx-auto mb-3" />
            <p className="text-slate-400 mb-4">No address saved yet.</p>
            <button
              onClick={() => setEditAddress(true)}
              className="btn-primary text-sm"
            >
              Add Address
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
