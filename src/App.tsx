import React, { useState, useEffect } from "react";
import { Sparkles, Crown, Download, Lock, CheckCircle2, ChevronRight, Layout, AlertCircle, HelpCircle, Eye, ArrowLeft, RefreshCw } from "lucide-react";
import { GeneratorInput, LandingPage, PricingTier, PremiumState } from "./types";
import EditorPanel from "./components/EditorPanel";
import PreviewPanel from "./components/PreviewPanel";
import SimulatedCheckout from "./components/SimulatedCheckout";
import ExportModal from "./components/ExportModal";
import TemplatesModal from "./components/TemplatesModal";
import { templates } from "./data/templates";
import { auth, db, googleProvider, handleFirestoreError, OperationType } from "./firebase";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { doc, getDoc, setDoc, collection, query, where, getDocs, serverTimestamp } from "firebase/firestore";

// Local storage keys
const LOCAL_STORAGE_PAGE_KEY = "lander_ai_generated_page";
const LOCAL_STORAGE_PREMIUM_KEY = "lander_ai_premium_state";

export default function App() {
  // Navigation Routing States (Simulates real pathways in an iframe-friendly manner)
  const [currentPath, setCurrentPath] = useState("/");
  const [queryParams, setQueryParams] = useState<URLSearchParams>(new URLSearchParams());

  // Workspace States
  const [input, setInput] = useState<GeneratorInput>({
    businessName: "",
    category: "SaaS / Software Product",
    description: "",
    audience: "",
    tone: "bold, high-converting copywriter style",
    themePreference: "modern-indigo"
  });

  const [landingPage, setLandingPage] = useState<LandingPage | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [savedPages, setSavedPages] = useState<LandingPage[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  const fetchSavedPages = async (uid: string) => {
    try {
      const q = query(collection(db, "landingPages"), where("ownerId", "==", uid));
      const querySnapshot = await getDocs(q);
      const pages: LandingPage[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        pages.push({
          ...data,
        } as LandingPage);
      });
      setSavedPages(pages);
    } catch (err) {
      console.error("Error fetching saved pages:", err);
    }
  };

  // Listen to Auth State Changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
      if (currentUser) {
        try {
          const userRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userRef);
          let currentPremium = false;

          // Hydrate initially from local storage or cloud
          const localPremium = localStorage.getItem(LOCAL_STORAGE_PREMIUM_KEY) === "true";

          if (!userSnap.exists()) {
            currentPremium = localPremium;
            await setDoc(userRef, {
              userId: currentUser.uid,
              email: currentUser.email || "",
              isPremium: currentPremium,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            });
            setIsPremium(currentPremium);
          } else {
            const data = userSnap.data();
            currentPremium = !!data.isPremium;
            setIsPremium(currentPremium);
            localStorage.setItem(LOCAL_STORAGE_PREMIUM_KEY, JSON.stringify(currentPremium));
          }

          // Fetch saved pages
          await fetchSavedPages(currentUser.uid);

          // Auto-sync local unsynced landing page
          const localPageStr = localStorage.getItem(LOCAL_STORAGE_PAGE_KEY);
          if (localPageStr) {
            try {
              const localPage = JSON.parse(localPageStr) as LandingPage;
              if (localPage && localPage.id && !localPage.ownerId) {
                const pageRef = doc(db, "landingPages", localPage.id);
                const pageSnap = await getDoc(pageRef);
                if (!pageSnap.exists()) {
                  await setDoc(pageRef, {
                    ...localPage,
                    ownerId: currentUser.uid,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                  });
                }
                await fetchSavedPages(currentUser.uid);
              }
            } catch (err) {
              console.error("Error auto-syncing local page to cloud:", err);
            }
          }
        } catch (error) {
          console.error("Error syncing profile with Firestore:", error);
        }
      } else {
        setSavedPages([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setNotification({ type: "success", message: "Signed in with Google successfully!" });
    } catch (e: any) {
      setNotification({ type: "error", message: e.message || "Failed to sign in with Google." });
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setNotification({ type: "success", message: "Successfully signed out." });
    } catch (e: any) {
      setNotification({ type: "error", message: e.message || "Failed to sign out." });
    }
  };

  const saveLandingPageToCloud = async (page: LandingPage) => {
    if (!auth.currentUser) {
      setNotification({ type: "error", message: "Please sign in to save your pages to the cloud." });
      return;
    }
    setIsSyncing(true);
    try {
      const pageRef = doc(db, "landingPages", page.id);
      const pageSnap = await getDoc(pageRef);
      const exists = pageSnap.exists();

      const payload: any = {
        ...page,
        ownerId: auth.currentUser.uid,
        updatedAt: serverTimestamp(),
      };

      if (exists) {
        payload.createdAt = pageSnap.data().createdAt;
      } else {
        payload.createdAt = serverTimestamp();
      }

      await setDoc(pageRef, payload);
      await fetchSavedPages(auth.currentUser.uid);
      setNotification({ type: "success", message: "Progress synced to secure cloud database!" });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `landingPages/${page.id}`);
    } finally {
      setIsSyncing(false);
    }
  };

  // Monitor location changes
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
      setQueryParams(new URLSearchParams(window.location.search));
    };

    handleLocationChange();
    window.addEventListener("popstate", handleLocationChange);
    return () => window.removeEventListener("popstate", handleLocationChange);
  }, []);

  // Hydrate states from localStorage on initial load
  useEffect(() => {
    try {
      const savedPage = localStorage.getItem(LOCAL_STORAGE_PAGE_KEY);
      if (savedPage) {
        setLandingPage(JSON.parse(savedPage));
      }

      const savedPremium = localStorage.getItem(LOCAL_STORAGE_PREMIUM_KEY);
      if (savedPremium) {
        setIsPremium(JSON.parse(savedPremium));
      }
    } catch (e) {
      console.error("Failed to hydrate state:", e);
    }
  }, []);

  // Auto-clear notification after delay
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Handle premium upgrade via Stripe Checkout
  const handleUpgradeStripe = async () => {
    setUpgradeLoading(true);
    try {
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemType: "upgrade",
          itemName: "Premium Platform License",
          priceAmount: 19.00,
          successUrl: `${window.location.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}&type=upgrade`,
          cancelUrl: `${window.location.origin}/?payment_cancelled=true`
        })
      });

      const data = await response.json();
      if (data.url) {
        // Real Stripe redirect, or fallback local sandbox route
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Failed to trigger checkout session.");
      }
    } catch (e: any) {
      setNotification({ type: "error", message: e.message || "Stripe Connection Error." });
    } finally {
      setUpgradeLoading(false);
    }
  };

  // Handle pricing tier checkout on the generated page
  const handleClientCheckout = async (tier: PricingTier) => {
    try {
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemType: "client_checkout",
          itemName: `${landingPage?.businessName} - ${tier.name} Plan`,
          priceAmount: parseFloat(tier.price.replace(/[^0-9.]/g, "")) || 9.99,
          successUrl: `${window.location.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}&type=client_checkout&tierName=${encodeURIComponent(tier.name)}&bizName=${encodeURIComponent(landingPage?.businessName || "")}`,
          cancelUrl: `${window.location.origin}/?payment_cancelled=true`
        })
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Failed to start checkout.");
      }
    } catch (e: any) {
      setNotification({ type: "error", message: e.message || "Checkout creation error." });
    }
  };

  // Generate full landing page with Gemini
  const handleGenerateLandingPage = async () => {
    setIsGenerating(true);
    setNotification(null);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input)
      });

      const data = await response.json();
      if (response.ok && data.businessName) {
        // Resolve a premium-themed high quality Unsplash keyword based on industry category
        let unsplashPhoto = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop";
        const cat = input.category.toLowerCase();
        if (cat.includes("saas") || cat.includes("app")) {
          unsplashPhoto = "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=800&auto=format&fit=crop";
        } else if (cat.includes("store") || cat.includes("commerce")) {
          unsplashPhoto = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop";
        } else if (cat.includes("agency") || cat.includes("consult")) {
          unsplashPhoto = "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop";
        } else if (cat.includes("health") || cat.includes("well")) {
          unsplashPhoto = "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop";
        } else if (cat.includes("learn") || cat.includes("course")) {
          unsplashPhoto = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop";
        }

        // Apply fallback Unsplash background and save state
        data.hero.imageUrl = unsplashPhoto;
        setLandingPage(data);
        localStorage.setItem(LOCAL_STORAGE_PAGE_KEY, JSON.stringify(data));
        setNotification({ type: "success", message: "Successfully generated your AI landing page!" });
      } else {
        throw new Error(data.error || "Failed to generate page. Check server logs.");
      }
    } catch (e: any) {
      setNotification({ type: "error", message: e.message || "An unexpected error occurred during generation." });
    } finally {
      setIsGenerating(false);
    }
  };

  // Rewrite individual section using Gemini refinement
  const handleRegenerateSection = async (sectionType: string, currentContent: any, prompt: string) => {
    setIsRegenerating(true);
    try {
      const response = await fetch("/api/regenerate-section", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionType,
          currentContent,
          prompt,
          businessName: landingPage?.businessName || "",
          tone: input.tone
        })
      });

      const data = await response.json();
      if (response.ok && landingPage) {
        const updated = { ...landingPage };
        if (sectionType === "hero") {
          updated.hero = { ...updated.hero, ...data };
        } else if (sectionType === "features") {
          updated.features = data;
        } else if (sectionType === "pricing") {
          updated.pricing = data;
        }

        setLandingPage(updated);
        localStorage.setItem(LOCAL_STORAGE_PAGE_KEY, JSON.stringify(updated));
        setNotification({ type: "success", message: `Successfully updated the ${sectionType} section!` });
      } else {
        throw new Error(data.error || "Failed to rewrite section.");
      }
    } catch (e: any) {
      setNotification({ type: "error", message: e.message || "Section update error." });
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleUpdatePage = async (updated: LandingPage) => {
    setLandingPage(updated);
    localStorage.setItem(LOCAL_STORAGE_PAGE_KEY, JSON.stringify(updated));
    if (auth.currentUser) {
      try {
        const pageRef = doc(db, "landingPages", updated.id);
        const pageSnap = await getDoc(pageRef);
        const payload: any = {
          ...updated,
          ownerId: auth.currentUser.uid,
          updatedAt: serverTimestamp(),
        };
        if (pageSnap.exists()) {
          payload.createdAt = pageSnap.data().createdAt;
        } else {
          payload.createdAt = serverTimestamp();
        }
        await setDoc(pageRef, payload);
        // Silently sync the saved list
        fetchSavedPages(auth.currentUser.uid);
      } catch (err) {
        console.error("Auto-sync background error:", err);
      }
    }
  };

  // Local helper to parse parameters manually
  const parseMockUrlParams = () => {
    const params = new URLSearchParams(window.location.search);
    return {
      session_id: params.get("session_id") || "",
      itemType: params.get("itemType") || "",
      itemName: params.get("itemName") || "",
      priceAmount: parseFloat(params.get("priceAmount") || "0") || 0,
      successUrl: params.get("successUrl") || "",
      cancelUrl: params.get("cancelUrl") || ""
    };
  };

  // ROUTE 1: Simulated Stripe checkout panel
  if (currentPath === "/simulated-checkout") {
    const mockParams = parseMockUrlParams();
    return (
      <SimulatedCheckout
        itemName={mockParams.itemName}
        priceAmount={mockParams.priceAmount}
        itemType={mockParams.itemType}
        onSuccess={() => {
          // Redirect with success session_id
          window.location.href = mockParams.successUrl;
        }}
        onCancel={() => {
          window.location.href = mockParams.cancelUrl;
        }}
      />
    );
  }

  // ROUTE 2: Payment success landed route
  if (currentPath === "/payment-success") {
    const type = queryParams.get("type");
    const bizName = queryParams.get("bizName");
    const tierName = queryParams.get("tierName");

    const completeUpgrade = async () => {
      if (type === "upgrade") {
        setIsPremium(true);
        localStorage.setItem(LOCAL_STORAGE_PREMIUM_KEY, JSON.stringify(true));
        if (auth.currentUser) {
          try {
            const userRef = doc(db, "users", auth.currentUser.uid);
            await setDoc(userRef, {
              isPremium: true,
              updatedAt: serverTimestamp()
            }, { merge: true });
          } catch (e) {
            console.error("Failed to sync premium state to cloud:", e);
          }
        }
      }
      window.location.href = "/";
    };

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 animate-bounce" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Stripe Session Verified</h2>
            <p className="text-sm text-gray-500">
              Your transaction has been securely authorized and completed.
            </p>
          </div>

          {type === "upgrade" ? (
            <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-xl text-left space-y-2">
              <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider flex items-center space-x-1">
                <Crown className="w-3 h-3 fill-amber-500" />
                <span>UNLOCKED PREMIUM BENEFITS</span>
              </span>
              <p className="text-xs text-gray-600 font-medium">
                You now have full development access to download static bundles, clean React components, and custom color presets.
              </p>
            </div>
          ) : (
            <div className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-xl text-left space-y-2">
              <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">
                MERCHANT INTEGRATION LOG
              </span>
              <p className="text-xs text-gray-600">
                Test checkout subscription was completed successfully!
              </p>
              <div className="text-[11px] text-indigo-800 font-semibold space-y-0.5 font-mono">
                <div>Merchant: {bizName}</div>
                <div>Subscription: {tierName}</div>
              </div>
            </div>
          )}

          <button
            onClick={completeUpgrade}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm shadow-md cursor-pointer transition-all hover:scale-[1.01]"
          >
            Return to Creator Workspace
          </button>
        </div>
      </div>
    );
  }

  // ROUTE 3: Primary Creator Workspace Dashboard
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans h-screen overflow-hidden" id="creator-workspace-root">
      {/* Sleek Dashboard Top Header Bar */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-100">
            L
          </div>
          <span className="font-semibold text-slate-900 tracking-tight flex items-center gap-1.5 shrink-0">
            LanderAI <span className="text-slate-400 font-normal text-xs">v2.4</span>
          </span>

          {user && savedPages.length > 0 && (
            <div className="hidden lg:flex items-center gap-2 border-l border-slate-200 pl-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Project:</span>
              <select
                value={landingPage?.id || ""}
                onChange={(e) => {
                  const selected = savedPages.find(p => p.id === e.target.value);
                  if (selected) {
                    setLandingPage(selected);
                    localStorage.setItem(LOCAL_STORAGE_PAGE_KEY, JSON.stringify(selected));
                    setNotification({ type: "success", message: `Loaded project "${selected.businessName}"` });
                  }
                }}
                className="bg-slate-50 border border-slate-200/80 text-slate-700 text-xs font-semibold rounded-lg px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="" disabled>Select project...</option>
                {savedPages.map((page) => (
                  <option key={page.id} value={page.id}>
                    {page.businessName || "Untitled Sandbox"}
                  </option>
                ))}
              </select>
            </div>
          )}

          {user && landingPage && (
            <button
              onClick={() => saveLandingPageToCloud(landingPage)}
              disabled={isSyncing}
              className="hidden lg:flex px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-100 rounded-lg text-[10px] font-bold items-center gap-1.5 transition-all cursor-pointer"
              title="Manually trigger database synchronization"
            >
              <RefreshCw className={`w-3 h-3 ${isSyncing ? "animate-spin" : ""}`} />
              <span>{isSyncing ? "Syncing..." : "Save Cloud"}</span>
            </button>
          )}
        </div>
        
        {/* Navigation Items (Sleek Aesthetic placeholders matching mockup) */}
        <div className="hidden md:flex items-center gap-5 text-xs font-bold text-slate-500 uppercase tracking-widest">
          <span className="text-indigo-600 cursor-pointer">Editor</span>
          <button
            onClick={() => setIsTemplatesOpen(true)}
            className="text-slate-500 hover:text-indigo-600 cursor-pointer transition-colors flex items-center gap-1 font-bold uppercase tracking-widest text-xs"
          >
            Templates <span className="text-[9px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded font-mono border border-indigo-100/30">ACTIVE</span>
          </button>
          <span className="text-slate-400/80 cursor-not-allowed flex items-center gap-1 hover:text-slate-400" title="Pro Feature">
            Analytics <span className="text-[9px] bg-slate-100 text-slate-500 px-1 py-0.2 rounded font-mono">PRO</span>
          </span>
        </div>

        {/* Right Action buttons */}
        <div className="flex items-center gap-4">
          {authLoading ? (
            <div className="w-4 h-4 border border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          ) : user ? (
            <div className="flex items-center gap-2 border-r border-slate-200 pr-3 mr-1">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Profile"
                  referrerPolicy="no-referrer"
                  className="w-6 h-6 rounded-full border border-indigo-200"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px]">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="hidden lg:inline text-xs font-bold text-slate-700 max-w-[100px] truncate" title={user.displayName || user.email || ""}>
                {user.displayName?.split(" ")[0] || user.email?.split("@")[0]}
              </span>
              <button
                onClick={handleSignOut}
                className="text-[10px] font-extrabold text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-colors cursor-pointer ml-1"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={handleSignIn}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 hover:border-indigo-500 rounded-lg text-xs font-bold text-slate-600 hover:text-indigo-600 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse" />
              <span>Login with Google</span>
            </button>
          )}

          {isPremium ? (
            <span className="px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold rounded-lg flex items-center space-x-1.5 shadow-sm">
              <Crown className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>Pro Plan Active</span>
            </span>
          ) : (
            <button
              onClick={handleUpgradeStripe}
              disabled={upgradeLoading}
              className="bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-100 px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer"
            >
              {upgradeLoading ? (
                <div className="w-3 h-3 border border-indigo-700 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Crown className="w-3.5 h-3.5" />
                  <span>Go Pro</span>
                </>
              )}
            </button>
          )}
          
          <div className="h-4 w-[1px] bg-slate-200"></div>

          {landingPage ? (
            isPremium ? (
              <button 
                onClick={() => setIsExportOpen(true)}
                className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Publish Site</span>
              </button>
            ) : (
              <button 
                onClick={handleUpgradeStripe}
                className="bg-slate-950 text-white px-4 py-2 rounded-lg hover:bg-slate-800 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Publish Site</span>
              </button>
            )
          ) : (
            <button 
              disabled
              className="bg-slate-200 text-slate-400 px-4 py-2 rounded-lg text-xs font-bold cursor-not-allowed"
            >
              Publish Site
            </button>
          )}
        </div>
      </header>

      {/* Alert Banner / Notification toast */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg flex items-center space-x-2 border transition-all animate-slide-in ${
            notification.type === "success"
              ? "bg-emerald-50 border-emerald-100 text-emerald-800"
              : "bg-rose-50 border-rose-100 text-rose-800"
          }`}
          id="system-notification"
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
          )}
          <span className="text-xs font-semibold">{notification.message}</span>
        </div>
      )}

      {/* Main split-pane container */}
      <div className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-4rem)] overflow-hidden">
        {/* Editor sidebar controls */}
        <EditorPanel
          input={input}
          onChangeInput={setInput}
          onGenerate={handleGenerateLandingPage}
          isGenerating={isGenerating}
          landingPage={landingPage}
          onUpdatePage={handleUpdatePage}
          isPremium={isPremium}
          onUpgradeStripe={handleUpgradeStripe}
          onOpenExport={() => setIsExportOpen(true)}
          upgradeLoading={upgradeLoading}
        />

        {/* Dynamic preview pane */}
        {landingPage ? (
          <PreviewPanel
            landingPage={landingPage}
            onUpdatePage={handleUpdatePage}
            onInitiateCheckout={handleClientCheckout}
            isRegenerating={isRegenerating}
            onRegenerateSection={handleRegenerateSection}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gray-50/50">
            <div className="max-w-md text-center space-y-6">
              <div className="w-16 h-16 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center mx-auto text-indigo-600 shadow-sm animate-pulse">
                <Layout className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-gray-900 tracking-tight">Your Sandbox Canvas awaits</h2>
                <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
                  Fill in the industry category and description details in the editor form on the left, then click generate to craft your high-converting page.
                </p>
              </div>

              {/* Showcase highlights */}
              <div className="grid grid-cols-2 gap-3 text-left">
                {[
                  { title: "Copywriting", text: "Stunning product copy mapped by Gemini." },
                  { title: "Stripe Billing", text: "Fully customized pricing cards and mock checkouts." },
                  { title: "In-line Editing", text: "Double-click text directly to customize." },
                  { title: "Pro Exporting", text: "Compile instantly to HTML and React TSX." }
                ].map((item, idx) => (
                  <div key={idx} className="bg-white p-3 border border-gray-100 rounded-xl space-y-1">
                    <h4 className="text-[11px] font-bold text-gray-800 flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                      <span>{item.title}</span>
                    </h4>
                    <p className="text-[10px] text-gray-400 leading-normal">{item.text}</p>
                  </div>
                ))}
              </div>

              {/* Pre-built Templates Quick Start Panel */}
              <div className="space-y-3 pt-5 border-t border-slate-200/60 shrink-0">
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest text-center">
                  Or load an expert starting blueprint instantly
                </p>
                <div className="flex flex-wrap justify-center gap-1.5">
                  {[
                    { id: "tpl_saas", name: "SaaS", color: "bg-indigo-500" },
                    { id: "tpl_ecommerce", name: "E-Commerce", color: "bg-amber-500" },
                    { id: "tpl_portfolio", name: "Portfolio", color: "bg-slate-700" },
                    { id: "tpl_event", name: "Event", color: "bg-purple-500" },
                    { id: "tpl_app", name: "Mobile App", color: "bg-emerald-500" }
                  ].map((btn) => (
                    <button
                      key={btn.id}
                    onClick={() => {
                      const original = templates.find(t => t.id === btn.id);
                      if (original) {
                        const loaded = {
                          ...original,
                          id: "lp_" + Math.random().toString(36).substring(2, 11)
                        };
                        handleUpdatePage(loaded);
                        setNotification({ type: "success", message: `Successfully loaded ${original.businessName} template!` });
                      }
                    }}
                      className="px-2.5 py-1.5 bg-white border border-slate-200 hover:border-indigo-500 rounded-lg text-[11px] font-bold text-slate-700 hover:text-indigo-600 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs hover:scale-[1.02]"
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${btn.color}`} />
                      <span>{btn.name}</span>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setIsTemplatesOpen(true)}
                  className="text-[10px] font-extrabold text-indigo-600 hover:text-indigo-800 uppercase tracking-wider block mx-auto hover:underline cursor-pointer"
                >
                  View full blueprints gallery →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Export modal container */}
      {landingPage && (
        <ExportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          landingPage={landingPage}
        />
      )}

      {/* Templates Modal container */}
      <TemplatesModal
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
        onSelectTemplate={(tpl) => {
          handleUpdatePage(tpl);
          setNotification({ type: "success", message: `Successfully loaded ${tpl.businessName} blueprint!` });
        }}
      />
    </div>
  );
}
