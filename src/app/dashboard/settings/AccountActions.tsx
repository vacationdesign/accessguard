"use client";

import { useState } from "react";

export function BrandNameForm({ initialValue }: { initialValue: string }) {
  const [brandName, setBrandName] = useState(initialValue);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/account/brand", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brandName }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      alert(err.message || "Failed to save brand name.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <label
          htmlFor="brandName"
          className="block text-sm font-medium text-muted mb-1"
        >
          Brand Name
        </label>
        <p className="text-xs text-muted mb-2">
          Your brand name will appear on PDF reports instead of
          &quot;A11yScope&quot;. Leave empty to use the default.
        </p>
        <div className="flex gap-2">
          <input
            id="brandName"
            type="text"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            maxLength={100}
            placeholder="e.g. Your Agency Name"
            className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-primary text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-primary-dark transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : saved ? "Saved!" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ExportDataButton() {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/account/export");
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `a11yscope-data-export-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Failed to export data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="bg-white border border-gray-200 text-foreground text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? "Exporting..." : "Download My Data"}
    </button>
  );
}

export function DeleteAccountButton() {
  const [step, setStep] = useState<"idle" | "confirm" | "deleting">("idle");

  const handleDelete = async () => {
    setStep("deleting");
    try {
      const res = await fetch("/api/account/delete", { method: "POST" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Deletion failed");
      }
      window.location.href = "/?deleted=1";
    } catch (err: any) {
      alert(err.message || "Failed to delete account. Please contact support.");
      setStep("idle");
    }
  };

  if (step === "idle") {
    return (
      <button
        onClick={() => setStep("confirm")}
        className="text-danger text-sm font-semibold px-5 py-2.5 rounded-lg border border-red-200 hover:bg-red-50 transition-colors cursor-pointer"
      >
        Delete My Account
      </button>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-danger font-medium">
        This will permanently delete your account, scan history, registered
        sites, and cancel any active subscriptions. This action cannot be undone.
      </p>
      <div className="flex gap-3">
        <button
          onClick={handleDelete}
          disabled={step === "deleting"}
          className="bg-red-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {step === "deleting" ? "Deleting..." : "Yes, Delete Everything"}
        </button>
        <button
          onClick={() => setStep("idle")}
          disabled={step === "deleting"}
          className="bg-white border border-gray-200 text-foreground text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
