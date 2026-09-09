'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useThemeContext } from '@/providers/theme-provider';
import { useCatalog } from '@/providers/catalog-provider';
import { useToastContext } from '@/providers/toast-provider';
import { getThemeClasses } from '@/providers/theme-provider';
import { VendorApplication, SellerAccount, VendorDocument, VendorProductSubmission } from '../../types';
import {
  Store,
  Building2,
  UserCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  AlertTriangle,
  FileText,
  Search,
  Filter,
  Download,
  ShieldCheck,
  Percent,
  Sliders,
  DollarSign,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  X,
  Mail,
  Phone,
  Calendar,
  Layers,
  ArrowUpRight,
  Package,
  Send,
  Tag,
  Truck,
  Trash2,
  Sparkles
} from 'lucide-react';
import { formatCurrency } from '../../utils/pricing';

export function VendorComplianceAdmin() {
  const { themeColor } = useThemeContext();
  const currentTheme = getThemeClasses(themeColor);
  const { vendorApplications, sellerAccounts, productSubmissions, handleApproveVendorApplication, handleRejectVendorApplication, handleToggleSellerStatus, handleUpdateSellerProfile, handleApproveProductSubmission, handleRejectProductSubmission, handleDeleteProductSubmission } = useCatalog();
  const { showToast } = useToastContext();

  const [subTab, setSubTab] = useState<'applications' | 'sellers' | 'products'>('applications');
  const [appStatusFilter, setAppStatusFilter] = useState<'all' | 'pending_approval' | 'approved' | 'rejected'>('pending_approval');
  const [prodStatusFilter, setProdStatusFilter] = useState<'all' | 'pending_approval' | 'approved' | 'rejected'>('pending_approval');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Document Inspection Modal State
  const [selectedAppForInspection, setSelectedAppForInspection] = useState<VendorApplication | null>(null);
  const [previewDocument, setPreviewDocument] = useState<VendorDocument | null>(null);

  // Application Rejection Dialog State
  const [rejectingAppId, setRejectingAppId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Product Submission Rejection & Detail State
  const [rejectingProdId, setRejectingProdId] = useState<string | null>(null);
  const [prodRejectionReason, setProdRejectionReason] = useState('');
  const [selectedSubmissionForDetail, setSelectedSubmissionForDetail] = useState<VendorProductSubmission | null>(null);

  // Seller Commission Editing State
  const [editingSellerId, setEditingSellerId] = useState<string | null>(null);
  const [editingCommissionRate, setEditingCommissionRate] = useState<number>(10);

  // Filtered Applications
  const filteredApplications = vendorApplications.filter((app) => {
    const matchesStatus = appStatusFilter === 'all' || app.status === appStatusFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      app.storeName.toLowerCase().includes(q) ||
      app.contactName.toLowerCase().includes(q) ||
      app.contactEmail.toLowerCase().includes(q) ||
      app.taxOrRegistrationId.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  // Filtered Sellers
  const filteredSellers = sellerAccounts.filter((seller) => {
    const q = searchQuery.toLowerCase();
    return (
      !searchQuery ||
      seller.storeName.toLowerCase().includes(q) ||
      seller.contactName.toLowerCase().includes(q) ||
      seller.contactEmail.toLowerCase().includes(q) ||
      seller.taxOrRegistrationId.toLowerCase().includes(q)
    );
  });

  // Filtered Product Submissions
  const filteredSubmissions = productSubmissions.filter((sub) => {
    const matchesStatus = prodStatusFilter === 'all' || sub.status === prodStatusFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      sub.name.toLowerCase().includes(q) ||
      sub.brand.toLowerCase().includes(q) ||
      sub.sellerName.toLowerCase().includes(q) ||
      sub.categoryName.toLowerCase().includes(q) ||
      (sub.sku && sub.sku.toLowerCase().includes(q));
    return matchesStatus && matchesSearch;
  });

  const pendingCount = vendorApplications.filter((a) => a.status === 'pending_approval').length;
  const approvedCount = vendorApplications.filter((a) => a.status === 'approved').length;
  const activeSellersCount = sellerAccounts.filter((s) => s.status === 'active').length;
  const pendingProductsCount = productSubmissions.filter((p) => p.status === 'pending_approval').length;

  const handleConfirmReject = () => {
    if (!rejectingAppId) return;
    handleRejectVendorApplication(rejectingAppId, rejectionReason.trim() || undefined);
    setRejectingAppId(null);
    setRejectionReason('');
  };

  const handleConfirmRejectProduct = () => {
    if (!rejectingProdId) return;
    handleRejectProductSubmission(rejectingProdId, prodRejectionReason.trim() || undefined);
    setRejectingProdId(null);
    setProdRejectionReason('');
  };

  const handleSaveCommission = (sellerId: string) => {
    handleUpdateSellerProfile(sellerId, { commissionRate: Number(editingCommissionRate) || 10 });
    setEditingSellerId(null);
    showToast('Updated seller commission rate.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Metrics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-black text-amber-700 dark:text-amber-400 uppercase tracking-wider">
              Pending Applications
            </div>
            <div className="text-2xl font-black text-amber-900 dark:text-amber-100 mt-0.5">
              {pendingCount}
            </div>
            <div className="text-[11px] text-amber-600 dark:text-amber-400/80 mt-0.5">
              Compliance verification
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/50 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-black text-blue-700 dark:text-blue-400 uppercase tracking-wider">
              Pending Products
            </div>
            <div className="text-2xl font-black text-blue-900 dark:text-blue-100 mt-0.5">
              {pendingProductsCount}
            </div>
            <div className="text-[11px] text-blue-600 dark:text-blue-400/80 mt-0.5">
              Awaiting catalog approval
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Package className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/50 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
              Active Sellers
            </div>
            <div className="text-2xl font-black text-emerald-900 dark:text-emerald-100 mt-0.5">
              {activeSellersCount}
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400/80 mt-0.5">
              Approved merchants
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-black text-slate-700 dark:text-slate-400 uppercase tracking-wider">
              Marketplace GMV
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              {formatCurrency(sellerAccounts.reduce((acc, s) => acc + s.totalSales, 0))}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              All merchant sales
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Sub-Tabs Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setSubTab('applications')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              subTab === 'applications'
                ? `${currentTheme.bg} text-white shadow-xs`
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <FileText className="w-3 h-3" />
            <span>Applications Queue</span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-900 text-[10px] font-black">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setSubTab('products')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              subTab === 'products'
                ? `${currentTheme.bg} text-white shadow-xs`
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Package className="w-3 h-3" />
            <span>Product Submissions</span>
            {pendingProductsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-blue-500 text-white text-[10px] font-black animate-pulse">
                {pendingProductsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setSubTab('sellers')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              subTab === 'sellers'
                ? `${currentTheme.bg} text-white shadow-xs`
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Store className="w-3 h-3" />
            <span>Active Merchants</span>
            <span className="text-[10px] opacity-80">({sellerAccounts.length})</span>
          </button>
        </div>

        {/* Search & Status Filter */}
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="w-3 h-3 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                subTab === 'applications'
                  ? 'Search store, email, CIPC...'
                  : subTab === 'products'
                  ? 'Search product, brand, seller...'
                  : 'Search merchant directory...'
              }
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {subTab === 'applications' && (
            <select
              value={appStatusFilter}
              onChange={(e: any) => setAppStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="pending_approval">Pending ({pendingCount})</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          )}

          {subTab === 'products' && (
            <select
              value={prodStatusFilter}
              onChange={(e: any) => setProdStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="pending_approval">Pending ({pendingProductsCount})</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          )}
        </div>
      </div>

      {/* VIEW A: Applications Queue */}
      {subTab === 'applications' && (
        <div className="space-y-4">
          {filteredApplications.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <Building2 className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
                No vendor applications matching filter.
              </div>
              <div className="text-xs text-slate-400 mt-1">
                New vendor submissions will appear here for compliance audit.
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredApplications.map((app) => (
                <div
                  key={app.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-2xs space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                        {app.accountType === 'sa_business' ? (
                          <Building2 className="w-5 h-5" />
                        ) : (
                          <UserCheck className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-black text-slate-900 dark:text-white">
                            {app.storeName}
                          </h4>
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                              app.status === 'pending_approval'
                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300'
                                : app.status === 'approved'
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300'
                                : 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300'
                            }`}
                          >
                            {app.status.replace('_', ' ')}
                          </span>
                          <span className="text-[11px] font-bold text-slate-400">
                            ID: {app.id}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-3 mt-1">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3 text-slate-400" />
                            {app.contactEmail}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {app.phone}
                          </span>
                          <span>•</span>
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {app.accountType === 'sa_business' ? 'South African (Pty) Ltd / CC' : 'Sole Proprietor'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => setSelectedAppForInspection(app)}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <Eye className="w-3 h-3 text-blue-500" />
                        <span>Inspect ({app.documents.length} Docs)</span>
                      </button>

                      {app.status === 'pending_approval' && (
                        <>
                          <button
                            onClick={() => handleApproveVendorApplication(app.id)}
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Approve Partner</span>
                          </button>
                          <button
                            onClick={() => setRejectingAppId(app.id)}
                            className="px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 text-xs font-bold hover:bg-rose-50 dark:hover:bg-rose-950/40 transition flex items-center gap-1.5 cursor-pointer"
                          >
                            <XCircle className="w-3 h-3" />
                            <span>Reject</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Summary Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs">
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase">
                        {app.accountType === 'sa_business' ? 'CIPC Reg / SARS Tax' : 'South African ID'}
                      </div>
                      <div className="font-mono font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                        {app.taxOrRegistrationId}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase">
                        Submitted On
                      </div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                        {new Date(app.createdAt).toLocaleDateString('en-ZA', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase">
                        Description &amp; Lines
                      </div>
                      <div className="text-slate-600 dark:text-slate-400 truncate mt-0.5">
                        {app.description || 'General consumer & luxury goods.'}
                      </div>
                    </div>
                  </div>

                  {app.rejectionReason && (
                    <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-xs text-rose-800 dark:text-rose-300">
                      <strong>Rejection Feedback:</strong> {app.rejectionReason}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW B: Product Submissions Queue */}
      {subTab === 'products' && (
        <div className="space-y-4">
          {filteredSubmissions.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <Package className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
                No product submissions matching filter.
              </div>
              <div className="text-xs text-slate-400 mt-1">
                When verified merchants submit new luxury items for the catalog, they appear here for verification.
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredSubmissions.map((sub) => (
                <div
                  key={sub.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-2xs space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-4 min-w-0">
                      <img
                        src={sub.imageUrl}
                        alt={sub.name}
                        className="w-20 h-20 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shrink-0 bg-slate-50 shadow-xs"
                      />
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-black uppercase text-emerald-600 dark:text-emerald-400">
                            {sub.brand}
                          </span>
                          <span className="text-slate-300 dark:text-slate-700">•</span>
                          <span className="text-xs font-semibold text-slate-500">
                            Category: {sub.categoryName}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                              sub.status === 'pending_approval'
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 animate-pulse'
                                : sub.status === 'approved'
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300'
                                : 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300'
                            }`}
                          >
                            {sub.status.replace('_', ' ')}
                          </span>
                        </div>

                        <h4 className="text-base font-black text-slate-900 dark:text-white">
                          {sub.name}
                        </h4>

                        <div className="text-xs text-slate-500 flex flex-wrap items-center gap-2.5">
                          <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                            <Store className="w-3 h-3 text-emerald-600" />
                            Merchant: {sub.sellerName} (ID: {sub.sellerId})
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {new Date(sub.createdAt).toLocaleDateString('en-ZA', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                          {sub.sku && (
                            <>
                              <span>•</span>
                              <span className="font-mono text-slate-400">SKU: {sub.sku}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        onClick={() => setSelectedSubmissionForDetail(sub)}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <Eye className="w-3 h-3 text-blue-500" />
                        <span>Inspect Specs</span>
                      </button>

                      {sub.status === 'pending_approval' && (
                        <>
                          <button
                            onClick={() => handleApproveProductSubmission(sub.id)}
                            className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Approve &amp; Publish</span>
                          </button>
                          <button
                            onClick={() => setRejectingProdId(sub.id)}
                            className="px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 text-xs font-bold hover:bg-rose-50 dark:hover:bg-rose-950/40 transition flex items-center gap-1.5 cursor-pointer"
                          >
                            <XCircle className="w-3 h-3" />
                            <span>Reject</span>
                          </button>
                        </>
                      )}

                      {sub.status !== 'pending_approval' && (
                        <button
                          onClick={() => handleDeleteProductSubmission(sub.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition cursor-pointer rounded-lg"
                          title="Archive Submission Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Submission Details Bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs">
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase">
                        Proposed Price
                      </div>
                      <div className="font-black text-slate-900 dark:text-white mt-0.5">
                        {formatCurrency(sub.price)}
                      </div>
                      {sub.originalPrice && (
                        <div className="text-[10px] text-slate-400 line-through">
                          MSRP: {formatCurrency(sub.originalPrice)}
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase">
                        Stock &amp; Condition
                      </div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                        {sub.stockCount} units • {sub.condition}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Dispatch SLA: {sub.shippingDays} Days
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase">
                        Tags / Search
                      </div>
                      <div className="font-medium text-slate-700 dark:text-slate-300 truncate mt-0.5">
                        {sub.tags && sub.tags.length > 0 ? sub.tags.join(', ') : 'None specified'}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase">
                        Platform Commission
                      </div>
                      <div className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                        {formatCurrency(sub.price * 0.1)} (10%)
                      </div>
                    </div>
                  </div>

                  {/* Description Excerpt */}
                  {sub.description && (
                    <div className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 bg-white dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                      <span className="font-bold text-slate-700 dark:text-slate-300">Description: </span>
                      {sub.description}
                    </div>
                  )}

                  {sub.rejectionReason && (
                    <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-xs text-rose-800 dark:text-rose-300 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <div>
                        <strong>Compliance Note:</strong> {sub.rejectionReason}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW C: Active Merchants Directory */}
      {subTab === 'sellers' && (
        <div className="space-y-4">
          {filteredSellers.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <Store className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
                No active sellers found.
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredSellers.map((seller) => (
                <div
                  key={seller.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-2xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                        <Store className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-black text-slate-900 dark:text-white">
                            {seller.storeName}
                          </h4>
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                              seller.status === 'active'
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300'
                                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                            }`}
                          >
                            {seller.status}
                          </span>
                          {seller.status === 'active' && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300">
                              Verified Merchant
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-3 mt-1">
                          <span>Primary Contact: {seller.contactName}</span>
                          <span>•</span>
                          <span>{seller.contactEmail}</span>
                          <span>•</span>
                          <span className="font-mono text-slate-400">ID: {seller.id}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => {
                          setEditingSellerId(seller.id);
                          setEditingCommissionRate(seller.commissionRate || 10);
                        }}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <Percent className="w-3 h-3 text-blue-500" />
                        <span>Commission ({seller.commissionRate || 10}%)</span>
                      </button>

                      <button
                        onClick={() => handleToggleSellerStatus(seller.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                          seller.status === 'active'
                            ? 'border border-amber-200 dark:border-amber-900/60 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                        }`}
                      >
                        {seller.status === 'active' ? 'Suspend Merchant' : 'Reactivate'}
                      </button>
                    </div>
                  </div>

                  {/* Financial & Listings Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs">
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase">
                        Lifetime Sales
                      </div>
                      <div className="font-black text-slate-900 dark:text-white mt-0.5">
                        {formatCurrency(seller.totalSales)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase">
                        Active Listings
                      </div>
                      <div className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                        {seller.activeListingsCount} Offers
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase">
                        Bank Details
                      </div>
                      <div className="font-medium text-slate-800 dark:text-slate-200 truncate mt-0.5">
                        {seller.bankDetails?.bankName || 'Standard Bank'} (***{seller.bankDetails?.accountNumber?.slice(-4) || '7890'})
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase">
                        Seller Rating
                      </div>
                      <div className="font-bold text-amber-500 mt-0.5">
                        ★ {seller.rating?.toFixed(1) || '5.0'} ({seller.ordersCount || 12} orders)
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PRODUCT SUBMISSION DETAIL INSPECTION MODAL */}
      <AnimatePresence>
        {selectedSubmissionForDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full my-8 space-y-5 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-600" />
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Product Specification Review
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedSubmissionForDetail(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-5 items-start">
                <img
                  src={selectedSubmissionForDetail.imageUrl}
                  alt={selectedSubmissionForDetail.name}
                  className="w-full sm:w-48 h-48 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shrink-0 bg-white"
                />
                <div className="space-y-3 flex-1">
                  <div>
                    <span className="text-xs font-black uppercase text-emerald-600">
                      {selectedSubmissionForDetail.brand}
                    </span>
                    <h4 className="text-lg font-black text-slate-900 dark:text-white">
                      {selectedSubmissionForDetail.name}
                    </h4>
                    <p className="text-xs text-slate-500">
                      Category: {selectedSubmissionForDetail.categoryName} • Status: {selectedSubmissionForDetail.status}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Proposed Price</span>
                      <span className="font-black text-slate-900 dark:text-white">
                        {formatCurrency(selectedSubmissionForDetail.price)}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Stock Qty</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {selectedSubmissionForDetail.stockCount} Available
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Condition</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {selectedSubmissionForDetail.condition}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Dispatch SLA</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {selectedSubmissionForDetail.shippingDays} Working Days
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300">Description</h5>
                <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 leading-relaxed">
                  {selectedSubmissionForDetail.description || 'No description provided.'}
                </p>
              </div>

              {selectedSubmissionForDetail.tags && selectedSubmissionForDetail.tags.length > 0 && (
                <div className="space-y-1">
                  <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300">Keywords &amp; Tags</h5>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedSubmissionForDetail.tags.map((t, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedSubmissionForDetail.status === 'pending_approval' && (
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => {
                      setRejectingProdId(selectedSubmissionForDetail.id);
                      setSelectedSubmissionForDetail(null);
                    }}
                    className="px-4 py-2 rounded-full border border-rose-200 dark:border-rose-800 text-rose-600 text-xs font-bold hover:bg-rose-50 cursor-pointer"
                  >
                    Reject Submission
                  </button>
                  <button
                    onClick={() => {
                      handleApproveProductSubmission(selectedSubmissionForDetail.id);
                      setSelectedSubmissionForDetail(null);
                    }}
                    className="px-6 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve &amp; Publish Product</span>
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DOCUMENT INSPECTION MODAL */}
      <AnimatePresence>
        {selectedAppForInspection && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full my-8 space-y-5 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Vendor Compliance Dossier: {selectedAppForInspection.storeName}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedAppForInspection(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Applicant Metadata */}
              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 font-bold block">Contact Officer</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {selectedAppForInspection.contactName}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block">Tax / Identity ID</span>
                  <span className="font-mono font-semibold text-slate-900 dark:text-white">
                    {selectedAppForInspection.taxOrRegistrationId}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block">Email</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {selectedAppForInspection.contactEmail}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block">Structure</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {selectedAppForInspection.accountType === 'sa_business'
                      ? 'CIPC Registered Entity'
                      : 'Sole Proprietor / Individual'}
                  </span>
                </div>
              </div>

              {/* Uploaded Documents */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Uploaded Verification Documents ({selectedAppForInspection.documents.length})
                </h4>

                <div className="space-y-2">
                  {selectedAppForInspection.documents.map((doc, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-600 flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white">
                            {doc.name}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            Type: {doc.type.replace('_', ' ')} • Size: {doc.size}
                          </div>
                        </div>
                      </div>

                      {doc.dataUrl && (
                        <button
                          onClick={() => setPreviewDocument(doc)}
                          className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-xs font-bold hover:bg-slate-300 dark:hover:bg-slate-600 transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View Preview</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Decision from inside modal */}
              {selectedAppForInspection.status === 'pending_approval' && (
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => {
                      setRejectingAppId(selectedAppForInspection.id);
                      setSelectedAppForInspection(null);
                    }}
                    className="px-4 py-2 rounded-full border border-rose-200 dark:border-rose-800 text-rose-600 text-xs font-bold hover:bg-rose-50 cursor-pointer"
                  >
                    Reject Application
                  </button>
                  <button
                    onClick={() => {
                      handleApproveVendorApplication(selectedAppForInspection.id);
                      setSelectedAppForInspection(null);
                    }}
                    className="px-5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve &amp; Activate</span>
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DOCUMENT PREVIEW LIGHTBOX */}
      <AnimatePresence>
        {previewDocument && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-3xl w-full max-h-[85vh] flex flex-col space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="font-bold text-sm text-slate-900 dark:text-white">
                  Document Preview: {previewDocument.name}
                </div>
                <button
                  onClick={() => setPreviewDocument(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-auto bg-slate-100 dark:bg-slate-950 rounded-2xl p-4 flex items-center justify-center min-h-[300px]">
                {previewDocument.dataUrl?.startsWith('data:image') ? (
                  <img
                    src={previewDocument.dataUrl}
                    alt={previewDocument.name}
                    className="max-h-[60vh] max-w-full object-contain rounded-xl shadow-md"
                  />
                ) : (
                  <div className="text-center space-y-3 p-8">
                    <FileText className="w-16 h-16 text-blue-500 mx-auto" />
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      PDF Document: {previewDocument.name}
                    </div>
                    <div className="text-xs text-slate-400">
                      Official document uploaded and secured.
                    </div>
                    <a
                      href={previewDocument.dataUrl}
                      download={previewDocument.name}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-xs hover:bg-blue-700 transition"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Document</span>
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* APPLICATION REJECTION REASON DIALOG */}
      <AnimatePresence>
        {rejectingAppId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl"
            >
              <div className="flex items-center gap-3 text-rose-600">
                <AlertTriangle className="w-6 h-6 shrink-0" />
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Reject Vendor Application
                </h3>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400">
                Please enter the compliance reason for rejecting this vendor application. The applicant will be notified with this feedback.
              </p>

              <textarea
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. CIPC registration certificate expired or company registration number not found on SARS database..."
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs font-medium focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectingAppId(null)}
                  className="px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReject}
                  className="px-4 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer"
                >
                  Confirm Rejection
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PRODUCT SUBMISSION REJECTION DIALOG */}
      <AnimatePresence>
        {rejectingProdId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl"
            >
              <div className="flex items-center gap-3 text-rose-600">
                <AlertTriangle className="w-6 h-6 shrink-0" />
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Reject Product Submission
                </h3>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400">
                Provide feedback to the seller explaining why this product cannot be listed (e.g. counterfeit risk, missing safety certifications, inadequate image quality).
              </p>

              <textarea
                rows={3}
                value={prodRejectionReason}
                onChange={(e) => setProdRejectionReason(e.target.value)}
                placeholder="e.g. Higher resolution imagery required or proof of authorized distributorship needed..."
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs font-medium focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectingProdId(null)}
                  className="px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmRejectProduct}
                  className="px-4 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer"
                >
                  Reject Submission
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

