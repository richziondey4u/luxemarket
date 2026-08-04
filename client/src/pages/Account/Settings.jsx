import { useState } from "react";
import { Edit3, Save } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Settings() {
  const { user, updateProfile } = useAuth();
  const [saving, setSaving] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
  });

  const saveProfile = async () => {
    setSaving(true);
    await updateProfile(profileForm);
    setEditProfile(false);
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold text-white">
        Profile Settings
      </h2>
      <div className="card-dark rounded-2xl p-6 border border-white/8">
        {editProfile ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Full Name
              </label>
              <input
                value={profileForm.name}
                onChange={(e) =>
                  setProfileForm((f) => ({ ...f, name: e.target.value }))
                }
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Phone
              </label>
              <input
                value={profileForm.phone}
                onChange={(e) =>
                  setProfileForm((f) => ({ ...f, phone: e.target.value }))
                }
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Email (read-only)
              </label>
              <input
                value={user?.email}
                readOnly
                className="input-field opacity-50 cursor-not-allowed"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={saveProfile}
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
                onClick={() => setEditProfile(false)}
                className="btn-secondary py-2.5"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {[
              ["Full Name", user?.name],
              ["Email", user?.email],
              ["Phone", user?.phone || "—"],
            ].map(([l, v]) => (
              <div key={l}>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                  {l}
                </p>
                <p className="text-white">{v}</p>
              </div>
            ))}
            <button
              onClick={() => setEditProfile(true)}
              className="btn-outline text-sm py-2 gap-2"
            >
              <Edit3 className="w-4 h-4" /> Edit Profile
            </button>
          </div>
        )}
      </div>

      <div className="card-dark rounded-2xl p-6 border border-red-500/20">
        <h3 className="font-semibold text-red-400 mb-2">Danger Zone</h3>
        <p className="text-sm text-slate-500 mb-4">
          Once you delete your account, there is no going back.
        </p>
        <button className="text-sm text-red-400 border border-red-500/30 px-4 py-2 rounded-xl hover:bg-red-500/10 transition-colors">
          Delete Account
        </button>
      </div>
    </div>
  );
}
