/**
 * Razorpay Checkout SDK Integration Service
 * NodeLib by Lotus & Lithium Technologies
 */

// Dynamically load the Razorpay checkout script if not already present
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

/**
 * Get active Razorpay Key ID
 * Priority: localStorage custom key -> import.meta.env.VITE_RAZORPAY_KEY_ID -> default test key
 */
export const getRazorpayKeyId = () => {
  const localKey = localStorage.getItem('nodelib_razorpay_key_id');
  if (localKey && localKey.trim()) return localKey.trim();
  
  if (import.meta.env.VITE_RAZORPAY_KEY_ID && import.meta.env.VITE_RAZORPAY_KEY_ID.trim()) {
    return import.meta.env.VITE_RAZORPAY_KEY_ID.trim();
  }
  
  // Default sandbox test key (for demonstration and test orders)
  return 'rzp_test_1DP5mmOlF5G5ag';
};

/**
 * Set custom Razorpay Key ID in localStorage (Admin portal)
 */
export const setRazorpayKeyId = (key) => {
  if (key) {
    localStorage.setItem('nodelib_razorpay_key_id', key.trim());
  } else {
    localStorage.removeItem('nodelib_razorpay_key_id');
  }
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
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded) {
    if (onFailure) {
      onFailure(new Error('Razorpay SDK failed to load. Please check your internet connection.'));
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
    name: 'NodeLib',
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
          paymentId: response.razorpay_payment_id,
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
      console.error('Razorpay Payment Failed:', response.error);
      if (onFailure) {
        onFailure(new Error(response.error.description || response.error.reason || 'Payment failed'));
      }
    });

    rzp.open();
  } catch (err) {
    console.error('Razorpay Init Error:', err);
    if (onFailure) onFailure(err);
  }
};
