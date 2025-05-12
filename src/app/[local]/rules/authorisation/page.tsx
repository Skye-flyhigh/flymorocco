"use client";

import { useState } from "react";

export default function Page() {
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);
  const [agreedMoroccanLaw, setAgreedMoroccanLaw] = useState(false);
  
  if (!agreedPrivacy || !agreedMoroccanLaw) {
    return (
      <div className="flex flex-col space-y-4 max-w-xl m-auto p-6">
        <label className="flex items-start space-x-2">
          <input type="checkbox" onChange={(e) => setAgreedPrivacy(e.target.checked)} />
          <span>
            I have read and understood the <Link href="/privacy" className="link">FlyMorocco Privacy Notice</Link>.
          </span>
        </label>
        <label className="flex items-start space-x-2">
          <input type="checkbox" onChange={(e) => setAgreedMoroccanLaw(e.target.checked)} />
          <span>
            I acknowledge and agree to the <Link href="/rules/authorisation" className="link">Moroccan flying legal requirements</Link>.
          </span>
        </label>
      </div>
    );
  }}
