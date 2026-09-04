/**
 * Razorpay Checkout SDK Integration Service
 * NodeLib by Lotus & Lithium Technologies
 */

// Dynamically load the Razorpay checkout script with timeout and error handling
export const loadRazorpayScript = (timeoutMs = 8000) => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve({ success: true });
      return;
    }

    // Check if script element is already injected
    let existingScript = document.querySelector('script[src*="checkout.razorpay.com"]');
    if (existingScript) {
      if (window.Razorpay) {
        resolve({ success: true });
        return;
      }
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;

    let timeoutHandle = null;

    const cleanup = () => {
      if (timeoutHandle) clearTimeout(timeoutHandle);
    };

    script.onload = () => {
      cleanup();
      if (window.Razorpay) {
        resolve({ success: true });
      } else {
        resolve({ success: false, error: 'Razorpay object not found on window after script load.' });
      }
    };

    script.onerror = () => {
      cleanup();
      resolve({ 
        success: false, 
        error: 'Failed to load Razorpay checkout script. Please check your internet connection or ad-blocker settings.' 
      });
    };

    timeoutHandle = setTimeout(() => {
      cleanup();
      resolve({ 
        success: false, 
        error: 'Razorpay checkout script load timed out. This often happens if an ad-blocker or firewall is blocking third-party scripts.' 
      });
    }, timeoutMs);

    document.body.appendChild(script);
  });
};

/**
 * Validate Razorpay Key format (e.g. rzp_test_... or rzp_live_...)
 */
export const isValidRazorpayKey = (key) => {
  if (!key || typeof key !== 'string') return false;
  const trimmed = key.trim();
  return (trimmed.startsWith('rzp_test_') || trimmed.startsWith('rzp_live_')) && trimmed.length >= 14;
};

/**
 * Check if a custom key has been entered by the merchant
 */
export const isCustomRazorpayKeySet = () => {
  const localKey = localStorage.getItem('nodelib_razorpay_key_id');
  if (localKey && isValidRazorpayKey(localKey)) return true;

  if (import.meta.env.VITE_RAZORPAY_KEY_ID && isValidRazorpayKey(import.meta.env.VITE_RAZORPAY_KEY_ID)) {
    return true;
  }

  return false;
};

/**
 * Get active Razorpay Key ID
 * Priority: localStorage custom key -> import.meta.env.VITE_RAZORPAY_KEY_ID -> fallback sample test key
 */
export const getRazorpayKeyId = () => {
  const localKey = localStorage.getItem('nodelib_razorpay_key_id');
  const envKey = import.meta.env.VITE_RAZORPAY_KEY_ID?.trim();
  
  // If envKey is configured with a real key (starts with rzp_live_ or rzp_test_), and localKey is empty or an old default, use envKey
  if (envKey && isValidRazorpayKey(envKey)) {
    if (!localKey || localKey === 'rzp_test_1DP5mmOlF5G5ag') {
      return envKey;
    }
  }

  if (localKey && localKey.trim()) return localKey.trim();
  if (envKey) return envKey;
  
  // Default sample key for sandbox demo initialization
  return 'rzp_test_1DP5mmOlF5G5ag';
};

/**
 * Set custom Razorpay Key ID in localStorage (Admin portal or Checkout modal)
 */
export const setRazorpayKeyId = (key) => {
  if (key && key.trim()) {
    localStorage.setItem('nodelib_razorpay_key_id', key.trim());
  } else {
    localStorage.removeItem('nodelib_razorpay_key_id');
  }
};

/**
 * Clear custom Razorpay Key ID
 */
export const clearRazorpayKeyId = () => {
  localStorage.removeItem('nodelib_razorpay_key_id');
};

/**
 * Open standard Razorpay Checkout Window
 */
export const openRazorpayCheckout = async ({
  amount, // in INR (e.g. 499)
  books = [],
  user = null,
  onSuccess,
  onFailure,
  onDismiss
}) => {
  // 1. Load Script
  const loadResult = await loadRazorpayScript();
  if (!loadResult.success) {
    if (onFailure) {
      onFailure(new Error(loadResult.error || 'Razorpay SDK failed to load.'));
    }
    return;
  }

  const keyId = getRazorpayKeyId();
  const bookTitles = books.map(b => b.title).join(', ');
  const description = books.length === 1 
    ? `Purchase: ${books[0].title}`
    : `Purchase: ${books.length} engineering eBooks (${bookTitles.substring(0, 45)}...)`;

  const options = {
    key: keyId,
    amount: Math.round(Number(amount) * 100), // Razorpay expects amount in paise
    currency: 'INR',
    name: 'NodeLib · Lotus & Lithium',
    description: description,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=128&auto=format&fit=crop&q=80',
    prefill: {
      name: user?.name || '',
      email: user?.email || '',
      contact: user?.phone || ''
    },
    notes: {
      store: 'NodeLib by Lotus & Lithium',
      bookIds: books.map(b => b.id).join(','),
      platform: 'Web E-Commerce'
    },
    theme: {
      color: '#4F46E5', // NodeLib Primary Indigo
      backdrop_color: 'rgba(15, 23, 42, 0.75)'
    },
    modal: {
      ondismiss: () => {
        if (onDismiss) onDismiss();
      },
      confirm_close: true,
      animation: true
    },
    handler: function (response) {
      // response contains: razorpay_payment_id, razorpay_order_id, razorpay_signature
      if (onSuccess) {
        onSuccess({
          paymentId: response.razorpay_payment_id || `pay_${Math.random().toString(36).substring(2, 12)}`,
          orderId: response.razorpay_order_id || 'order_' + Math.random().toString(36).substring(2, 10),
          signature: response.razorpay_signature || '',
          amount: amount,
          gateway: 'RAZORPAY_STANDARD',
          keyUsed: keyId
        });
      }
    }
  };

  try {
    const rzp = new window.Razorpay(options);
    
    rzp.on('payment.failed', function (response) {
      console.error('Razorpay Payment Failed Event:', response?.error);
      const desc = response?.error?.description || response?.error?.reason || 'Payment was declined or cancelled by bank.';
      if (onFailure) {
        onFailure(new Error(desc));
      }
    });

    rzp.open();
  } catch (err) {
    console.error('Razorpay Init Error:', err);
    if (onFailure) {
      onFailure(new Error(err?.message || 'Could not launch Razorpay Checkout. Please check your API Key.'));
    }
  }
};
