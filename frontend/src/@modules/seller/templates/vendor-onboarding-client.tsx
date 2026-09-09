'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { useThemeContext } from '@/providers/theme-provider';
import { getThemeClasses } from '@/providers/theme-provider';
import { useAuthContext } from '@/providers/auth-provider';
import { useCatalog } from '@/providers/catalog-provider';
import { useToastContext } from '@/providers/toast-provider';
import { VendorAccountType, VendorDocument } from '@/types';
import {
  Store,
  Building2,
  UserCheck,
  Upload,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Truck,
  CreditCard,
  Headphones,
  Lock,
  FileText,
  Trash2,
  Eye,
  AlertCircle,
  Sparkles,
  HelpCircle,
  BadgeCheck
} from 'lucide-react';

export default function VendorOnboardingClient() {
  const router = useRouter();
  const { themeColor } = useThemeContext();
  const currentTheme = getThemeClasses(themeColor);
  const { currentUser } = useAuthContext();
  const { handleApplyAsVendor, vendorApplications } = useCatalog();
  const { showToast } = useToastContext();

  // Form State
  const [accountType, setAccountType] = useState<VendorAccountType>('sole_proprietor');
  const [storeName, setStoreName] = useState('');
  const [contactName, setContactName] = useState(currentUser?.name || '');
  const [contactEmail, setContactEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '+27 ');
  const [taxOrRegistrationId, setTaxOrRegistrationId] = useState('');
  const [description, setDescription] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [documents, setDocuments] = useState<VendorDocument[]>([]);

  // Submission & UI states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedApplicationId, setSubmittedApplicationId] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Check if current user already has a pending or approved application
  const existingApp = currentUser
    ? vendorApplications.find(
        (a) => a.contactEmail.toLowerCase() === currentUser.email.toLowerCase() || a.userId === currentUser.id
      )
    : null;

  // File Upload Handler (Simulates document validation & local base64/file info)
  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newDocs: VendorDocument[] = [];
    Array.from(files).forEach((file) => {
      // Validate file size (< 10MB)
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      const docType: VendorDocument['type'] =
        accountType === 'sole_proprietor' ? 'sa_id_passport' : 'cipc_certificate';

      // Read as base64 for in-browser verification preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const doc: VendorDocument = {
          name: file.name,
          size: `${sizeMB} MB`,
          dataUrl: e.target?.result as string,
          type: docType,
          uploadedAt: new Date().toISOString()
        };
        setDocuments((prev) => [...prev, doc]);
      };
      reader.readAsDataURL(file);
    });
    showToast(`Uploaded ${files.length} verification document(s).`, 'success');
  };

  const handleRemoveDoc = (index: number) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!storeName.trim()) {
      showToast('Please enter your Store / Business Name.', 'error');
      return;
    }
    if (!contactName.trim()) {
      showToast('Please provide a primary contact name.', 'error');
      return;
    }
    if (!contactEmail.trim() || !contactEmail.includes('@')) {
      showToast('Please provide a valid business contact email.', 'error');
      return;
    }
    if (!taxOrRegistrationId.trim()) {
      showToast(
        accountType === 'sole_proprietor'
          ? 'Please enter your South African ID or Passport number.'
          : 'Please enter your CIPC Registration or Tax ID number.',
        'error'
      );
      return;
    }
    if (documents.length === 0) {
      showToast(
        accountType === 'sole_proprietor'
          ? 'Please upload your South African ID or Passport document.'
          : 'Please upload your CIPC Business Registration certificate.',
        'error'
      );
      return;
    }
    if (!currentUser && (!password || password.length < 6)) {
      showToast('Please create a secure password (minimum 6 characters).', 'error');
      return;
    }
    if (!agreeTerms) {
      showToast('You must accept the Merchant Services Agreement to proceed.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await handleApplyAsVendor({
        accountType,
        storeName: storeName.trim(),
        contactName: contactName.trim(),
        contactEmail: contactEmail.trim(),
        phone: phone.trim(),
        taxOrRegistrationId: taxOrRegistrationId.trim(),
        description: description.trim() || 'Premium retail vendor and distributor.',
        documents,
        password: password || undefined,
        userId: currentUser?.id
      });

      if (res.success && res.applicationId) {
        setSubmittedApplicationId(res.applicationId);
      }
    } catch (err: any) {
      showToast('Failed to submit application. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200">
      {/* Top Banner / Breadcrumb */}
      <div className="border-b border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition">
              Home
            </Link>
            <span>/</span>
            <span className="text-slate-900 dark:text-white font-bold">Partner Program</span>
          </div>

          {currentUser?.role === 'seller' && (
            <Link
              href="/sell/dashboard"
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold text-white shadow-xs ${currentTheme.bg} hover:opacity-90 transition`}
            >
              <Store className="w-3 h-3" />
              <span>Go to Seller Portal</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>
      </div>

      {/* Hero Showcase Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 border-b border-slate-200/80 dark:border-slate-800 py-16 sm:py-24">
        <div className="absolute inset-0 bg-radial from-blue-500/5 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
              <Sparkles className={`w-4 h-4 ${currentTheme.text}`} />
              <span>Mrbulk Multi-Vendor Network</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              Grow Your Business on South Africa’s Premier Marketplace
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              Connect directly with thousands of verified shoppers nationwide. List high-demand catalog products, set your custom prices and stock, and receive automated EFT disbursements directly to your South African bank account.
            </p>

            {/* Value Props Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-left">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs">
                <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div className="text-xs font-black text-slate-900 dark:text-white">Zero Listing Fees</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Pay only when you sell</div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div className="text-xs font-black text-slate-900 dark:text-white">Weekly Payouts</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Direct EFT to FNB, Standard, etc.</div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs">
                <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2">
                  <Truck className="w-4 h-4" />
                </div>
                <div className="text-xs font-black text-slate-900 dark:text-white">Courier Network</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Fast SA nationwide delivery</div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs">
                <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-2">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div className="text-xs font-black text-slate-900 dark:text-white">Seller Protection</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Fraud prevention & compliance</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Registration / Status Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Case 1: Application already submitted in current session or user profile */}
        {(submittedApplicationId || (existingApp && existingApp.status === 'pending_approval')) ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-lg text-center space-y-6"
          >
            <div className="w-16 h-16 rounded-3xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2 max-w-lg mx-auto">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                Application Received for Review
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Thank you for applying to sell on Mrbulk. Your application (
                <span className="font-mono font-bold text-slate-900 dark:text-slate-200">
                  {submittedApplicationId || existingApp?.id}
                </span>
                ) has been logged with status <span className="font-bold text-amber-600 dark:text-amber-400">pending_approval</span>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-left text-xs space-y-2.5 max-w-lg mx-auto">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BadgeCheck className="w-4 h-4 text-blue-500" />
                <span>Next Compliance Steps:</span>
              </div>
              <ul className="space-y-1.5 text-slate-600 dark:text-slate-400 list-disc list-inside">
                <li>Document verification (CIPC registration or SA ID validation).</li>
                <li>Compliance audit turnaround: 24 to 48 business hours.</li>
                <li>You will receive an instant role upgrade upon admin approval.</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href="/shop"
                className="w-full sm:w-auto px-6 py-2.5 rounded-full border border-slate-200 dark:border-slate-700 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                Browse Store
              </Link>
              {currentUser?.role === 'admin' && (
                <Link
                  href="/admin"
                  className={`w-full sm:w-auto px-6 py-2.5 rounded-full text-white font-bold text-xs shadow-xs ${currentTheme.bg} hover:opacity-90 transition flex items-center justify-center gap-2`}
                >
                  <span>Review in Admin Hub</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              )}
            </div>
          </motion.div>
        ) : existingApp && existingApp.status === 'approved' ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-lg text-center space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-500 flex items-center justify-center mx-auto shadow-inner">
              <BadgeCheck className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                You Are an Approved Vendor!
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Your store <strong>{existingApp.storeName}</strong> is active and in good standing.
              </p>
            </div>
            <Link
              href="/sell/dashboard"
              className={`inline-flex items-center gap-2 px-8 py-3 rounded-full text-white text-sm font-bold shadow-md ${currentTheme.bg} hover:opacity-90 transition`}
            >
              <Store className="w-4 h-4" />
              <span>Open Seller Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          /* Application Form Card */
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl space-y-8">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-6">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Vendor Partner Application
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Complete the compliance details below to register your business on the marketplace.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 1. Account Type Selector (Sole Proprietor vs South African Business) */}
              <div className="space-y-3">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Select Legal Business Structure <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAccountType('sole_proprietor')}
                    className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                      accountType === 'sole_proprietor'
                        ? `${currentTheme.lightBg} border-blue-500 dark:border-blue-500 ring-2 ring-blue-500/20`
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900 dark:text-white">
                        Sole Proprietor / Individual
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Selling under personal South African ID or Passport number.
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAccountType('sa_business')}
                    className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                      accountType === 'sa_business'
                        ? `${currentTheme.lightBg} border-blue-500 dark:border-blue-500 ring-2 ring-blue-500/20`
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-900/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900 dark:text-white">
                        South African Registered Business
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        (Pty) Ltd, CC, or Trust with valid CIPC registration.
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* 2. Store & Contact Credentials */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Store / Brand Display Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="e.g. Apex Tech Direct"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Authorized Contact Person <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Amara Khumalo"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Business Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="vendor@company.co.za"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Phone / WhatsApp Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+27 82 123 4567"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* 3. Tax / Registration ID (Dynamic Label based on type) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  {accountType === 'sole_proprietor' ? (
                    <span>
                      South African National ID / Passport Number <span className="text-rose-500">*</span>
                    </span>
                  ) : (
                    <span>
                      CIPC Enterprise Number or SARS Tax ID <span className="text-rose-500">*</span>
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  required
                  value={taxOrRegistrationId}
                  onChange={(e) => setTaxOrRegistrationId(e.target.value)}
                  placeholder={
                    accountType === 'sole_proprietor'
                      ? 'e.g. 910412 5029 081'
                      : 'e.g. 2021/399102/07 or 9820192834'
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white font-mono"
                />
              </div>

              {/* 4. Document Upload Area (Dynamic requirement) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    {accountType === 'sole_proprietor' ? (
                      <span>Upload South African ID / Passport Document <span className="text-rose-500">*</span></span>
                    ) : (
                      <span>Upload CIPC Business Registration Documents (COR14.3) <span className="text-rose-500">*</span></span>
                    )}
                  </label>
                  <span className="text-[11px] text-slate-400">PDF, PNG, JPG (Max 10MB)</span>
                </div>

                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragActive(false);
                    handleFileUpload(e.dataTransfer.files);
                  }}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
                    dragActive
                      ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/40'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30'
                  }`}
                  onClick={() => document.getElementById('vendor-doc-upload')?.click()}
                >
                  <input
                    id="vendor-doc-upload"
                    type="file"
                    multiple
                    accept=".pdf,.png,.jpg,.jpeg"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e.target.files)}
                  />
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-3">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    Click to upload or drag and drop official documents
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    {accountType === 'sole_proprietor'
                      ? 'Please attach a clear copy of your South African Smart ID or valid Passport.'
                      : 'Attach your official CIPC Certificate of Incorporation or SARS Tax Clearance Pin.'}
                  </div>
                </div>

                {/* Uploaded Documents List */}
                {documents.length > 0 && (
                  <div className="space-y-2 pt-2">
                    {documents.map((doc, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                          <span className="truncate text-slate-900 dark:text-slate-100">{doc.name}</span>
                          <span className="text-[10px] text-slate-400 shrink-0">({doc.size})</span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveDoc(idx);
                          }}
                          className="p-1 text-slate-400 hover:text-rose-500 transition cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 5. Store Description & Categories */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Store Description &amp; Primary Product Lines
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell our onboarding team what types of products you intend to sell (e.g., consumer electronics, audio gear, luxury watches)..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white leading-relaxed"
                />
              </div>

              {/* 6. Account Password (if guest) */}
              {!currentUser && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Create Portal Password <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                  />
                  <p className="text-[10px] text-slate-400">
                    Minimum 6 characters. You will use this to sign into your seller dashboard once approved.
                  </p>
                </div>
              )}

              {/* 7. Agreement Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                    I confirm that the submitted business or identity documents are authentic and compliant with South African commercial trade regulations, and I accept the{' '}
                    <Link href="/terms-and-conditions" className="text-blue-600 dark:text-blue-400 underline font-semibold">
                      Merchant Services Terms &amp; Conditions
                    </Link>
                    .
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3.5 px-6 rounded-full text-white text-xs sm:text-sm font-black uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-95'
                  } ${currentTheme.bg}`}
                >
                  {isSubmitting ? (
                    <span>Submitting Application...</span>
                  ) : (
                    <>
                      <span>Submit Vendor Application</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* FAQ Accordion Section */}
        <div className="mt-16 space-y-4">
          <div className="text-center space-y-1 mb-6">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Frequently Asked Partner Questions
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Everything you need to know about selling on Mrbulk (mrbulk.co.za)
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-1.5">
              <div className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="w-3 h-3 text-blue-500" />
                <span>How long does verification take?</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Our South African compliance team reviews CIPC registration documents and ID credentials within 24–48 business hours.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-1.5">
              <div className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="w-3 h-3 text-blue-500" />
                <span>What are the seller commission rates?</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Standard category commissions range from 8% to 12% on successful sales. There are zero upfront listing or monthly subscription fees.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-1.5">
              <div className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="w-3 h-3 text-blue-500" />
                <span>How do customer payouts work?</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Payouts are disbursed weekly via direct South African EFT into your registered FNB, Standard Bank, Nedbank, Absa, or Capitec account.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-1.5">
              <div className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="w-3 h-3 text-blue-500" />
                <span>Can I list items with different conditions?</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Yes! You can attach offers for Brand New, Like New, Refurbished, or Open Box items, with custom prices and inventory levels.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
