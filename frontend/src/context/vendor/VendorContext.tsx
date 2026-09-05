'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { VendorApplication, SellerAccount, VendorOffer, ProductCondition, VendorProductSubmission } from '../../types';

export interface VendorContextType {
  vendorApplications: VendorApplication[];
  setVendorApplications: React.Dispatch<React.SetStateAction<VendorApplication[]>>;
  sellerAccounts: SellerAccount[];
  setSellerAccounts: React.Dispatch<React.SetStateAction<SellerAccount[]>>;
  productSubmissions: VendorProductSubmission[];
  setProductSubmissions: React.Dispatch<React.SetStateAction<VendorProductSubmission[]>>;
  handleApplyAsVendor: (data: Omit<VendorApplication, 'id' | 'createdAt' | 'status'>) => Promise<{ success: boolean; applicationId?: string; error?: string }>;
  handleApproveVendorApplication: (applicationId: string) => void;
  handleRejectVendorApplication: (applicationId: string, reason?: string) => void;
  handleToggleSellerStatus: (sellerId: string, status?: 'active' | 'suspended') => void;
  handleUpdateSellerProfile: (sellerId: string, updates: Partial<SellerAccount>) => void;
  handleCreateOrUpdateOffer: (productId: string, offer: Partial<VendorOffer> & { price: number; stockCount: number; condition: ProductCondition }) => void;
  handleDeleteOffer: (productId: string, offerId: string) => void;
  handleSubmitNewProduct: (submissionData: Omit<VendorProductSubmission, 'id' | 'status' | 'createdAt'>) => VendorProductSubmission;
  handleApproveProductSubmission: (submissionId: string) => void;
  handleRejectProductSubmission: (submissionId: string, reason?: string) => void;
  handleDeleteProductSubmission: (submissionId: string) => void;
}

const VendorContext = createContext<VendorContextType | undefined>(undefined);

export function VendorProvider({ children }: { children: ReactNode }) {
  const [vendorApplications, setVendorApplications] = useState<VendorApplication[]>([]);
  const [sellerAccounts, setSellerAccounts] = useState<SellerAccount[]>([]);
  const [productSubmissions, setProductSubmissions] = useState<VendorProductSubmission[]>([]);

  const handleApplyAsVendor = useCallback(async (data: Omit<VendorApplication, 'id' | 'createdAt' | 'status'>) => {
    const application: VendorApplication = {
      ...data,
      id: `vendor-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'pending_approval',
    };
    setVendorApplications((prev) => [...prev, application]);
    return { success: true, applicationId: application.id };
  }, []);

  const handleApproveVendorApplication = useCallback((applicationId: string) => {
    setVendorApplications((prev) =>
      prev.map((app) => (app.id === applicationId ? { ...app, status: 'approved' } : app))
    );
  }, []);

  const handleRejectVendorApplication = useCallback((applicationId: string, _reason?: string) => {
    setVendorApplications((prev) =>
      prev.map((app) => (app.id === applicationId ? { ...app, status: 'rejected' } : app))
    );
  }, []);

  const handleToggleSellerStatus = useCallback((sellerId: string, status?: 'active' | 'suspended') => {
    setSellerAccounts((prev) =>
      prev.map((seller) =>
        seller.id === sellerId ? { ...seller, status: status || (seller.status === 'active' ? 'suspended' : 'active') } : seller
      )
    );
  }, []);

  const handleUpdateSellerProfile = useCallback((sellerId: string, updates: Partial<SellerAccount>) => {
    setSellerAccounts((prev) =>
      prev.map((seller) => (seller.id === sellerId ? { ...seller, ...updates } : seller))
    );
  }, []);

  const handleCreateOrUpdateOffer = useCallback(
    (_productId: string, _offer: Partial<VendorOffer> & { price: number; stockCount: number; condition: ProductCondition }) => {
      // Offers are attached to products in the catalog layer
    },
    []
  );

  const handleDeleteOffer = useCallback((_productId: string, _offerId: string) => {
    // Offers are attached to products in the catalog layer
  }, []);

  const handleSubmitNewProduct = useCallback(
    (submissionData: Omit<VendorProductSubmission, 'id' | 'status' | 'createdAt'>): VendorProductSubmission => {
      const submission: VendorProductSubmission = {
        ...submissionData,
        id: `submission-${Date.now()}`,
        status: 'pending_approval',
        createdAt: new Date().toISOString(),
      };
      setProductSubmissions((prev) => [...prev, submission]);
      return submission;
    },
    []
  );

  const handleApproveProductSubmission = useCallback((submissionId: string) => {
    setProductSubmissions((prev) =>
      prev.map((sub) => (sub.id === submissionId ? { ...sub, status: 'approved' } : sub))
    );
  }, []);

  const handleRejectProductSubmission = useCallback((submissionId: string, _reason?: string) => {
    setProductSubmissions((prev) =>
      prev.map((sub) => (sub.id === submissionId ? { ...sub, status: 'rejected' } : sub))
    );
  }, []);

  const handleDeleteProductSubmission = useCallback((submissionId: string) => {
    setProductSubmissions((prev) => prev.filter((sub) => sub.id !== submissionId));
  }, []);

  return (
    <VendorContext.Provider
      value={{
        vendorApplications,
        setVendorApplications,
        sellerAccounts,
        setSellerAccounts,
        productSubmissions,
        setProductSubmissions,
        handleApplyAsVendor,
        handleApproveVendorApplication,
        handleRejectVendorApplication,
        handleToggleSellerStatus,
        handleUpdateSellerProfile,
        handleCreateOrUpdateOffer,
        handleDeleteOffer,
        handleSubmitNewProduct,
        handleApproveProductSubmission,
        handleRejectProductSubmission,
        handleDeleteProductSubmission,
      }}
    >
      {children}
    </VendorContext.Provider>
  );
}

export function useVendor() {
  const context = useContext(VendorContext);
  if (!context) {
    throw new Error('useVendor must be used within a VendorProvider');
  }
  return context;
}
