import { supabase, isSupabaseConfigured } from './supabaseClient';
import { SEED_BOOKS } from '../data/seedBooks';

export const dbService = {
  isConfigured: () => isSupabaseConfigured(),

  // ==========================================
  // AUTHENTICATION
  // ==========================================
  async signUp(email, password, name) {
    if (!isSupabaseConfigured()) {
      return {
        user: { id: 'local-' + Date.now(), email, name, role: 'customer' },
        error: null
      };
    }
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name: name || email.split('@')[0], role: 'customer' }
        }
      });
      if (error) throw error;
      
      // Create profile record
      if (data.user) {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          email: data.user.email,
          name: name || email.split('@')[0],
          role: 'customer'
        });
      }
      return { user: data.user, error: null };
    } catch (err) {
      console.error('Supabase SignUp Error:', err);
      return { user: null, error: err.message };
    }
  },

  async signIn(email, password) {
    if (!isSupabaseConfigured()) {
      return {
        user: { id: 'local-' + Date.now(), email, name: email.split('@')[0], role: 'customer' },
        error: null
      };
    }
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      return { user: data.user, error: null };
    } catch (err) {
      console.error('Supabase SignIn Error:', err);
      return { user: null, error: err.message };
    }
  },

  async signOut() {
    if (isSupabaseConfigured()) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error('Supabase SignOut Error:', err);
      }
    }
  },

  async getCurrentUser() {
    if (!isSupabaseConfigured()) return null;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      return {
        id: user.id,
        email: user.email,
        name: profile?.name || user.user_metadata?.name || user.email.split('@')[0],
        role: profile?.role || 'customer'
      };
    } catch (err) {
      return null;
    }
  },

  // ==========================================
  // BOOKS CATALOG
  // ==========================================
  async fetchBooks() {
    if (!isSupabaseConfigured()) return SEED_BOOKS;
    try {
      const { data, error } = await supabase.from('books').select('*').order('created_at', { ascending: false });
      if (error) {
        console.warn('Could not fetch books from Supabase, falling back to seed books:', error.message);
        return SEED_BOOKS;
      }
      if (data && data.length > 0) {
        return data.map(b => ({
          ...b,
          price: Number(b.price) || 0,
          originalPrice: b.original_price ? Number(b.original_price) : (b.originalPrice ? Number(b.originalPrice) : null),
          stock: Number(b.stock) || 0,
          rating: Number(b.rating) || 4.8,
          tags: Array.isArray(b.tags) ? b.tags : (typeof b.tags === 'string' ? b.tags.replace(/[{}]/g, '').split(',').map(s => s.trim()) : ['programming']),
          desc: b.short_desc || b.desc || '',
          fullDesc: b.full_desc || b.fullDesc || '',
          color: b.color || '#4F46E5',
          colorEnd: b.color_end || b.colorEnd || '#312E81',
          reviewCount: Number(b.review_count || b.reviewCount) || 24,
          pdfUrl: b.pdf_url || b.pdfUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          featured: Boolean(b.featured),
          bestSeller: Boolean(b.bestseller || b.bestSeller)
        }));
      }

      // If Supabase table is empty, auto-populate with seed books
      try {
        const seedPayload = SEED_BOOKS.map(b => ({
          id: b.id,
          no: b.no,
          title: b.title,
          author: b.author,
          price: b.price,
          original_price: b.originalPrice,
          color: b.color,
          color_end: b.colorEnd,
          category: b.category,
          tags: b.tags,
          stock: b.stock,
          rating: b.rating,
          review_count: b.reviewCount,
          featured: b.featured,
          bestseller: b.bestSeller,
          short_desc: b.desc,
          full_desc: b.fullDesc,
          pdf_url: b.pdfUrl
        }));
        await supabase.from('books').upsert(seedPayload, { onConflict: 'id' });
      } catch (seedErr) {
        console.warn('Could not auto-seed Supabase books:', seedErr);
      }

      return SEED_BOOKS;
    } catch (err) {
      console.warn('Could not fetch books from Supabase, falling back to seed books:', err.message);
      return SEED_BOOKS;
    }
  },

  async addBook(book) {
    if (!isSupabaseConfigured()) return book;
    try {
      const { data, error } = await supabase.from('books').insert({
        id: book.id,
        no: book.no,
        title: book.title,
        author: book.author,
        price: Number(book.price) || 0,
        original_price: book.originalPrice ? Number(book.originalPrice) : null,
        color: book.color || '#4F46E5',
        color_end: book.colorEnd || '#312E81',
        category: book.category || 'Software Engineering',
        tags: Array.isArray(book.tags) ? book.tags : ['programming'],
        stock: Number(book.stock) || 25,
        rating: Number(book.rating) || 4.8,
        review_count: Number(book.reviewCount) || 24,
        featured: Boolean(book.featured),
        bestseller: Boolean(book.bestSeller),
        short_desc: book.desc || '',
        full_desc: book.fullDesc || '',
        pdf_url: book.pdfUrl || ''
      }).select().single();
      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Supabase AddBook Error:', err);
      throw err;
    }
  },

  async updateBook(id, book) {
    if (!isSupabaseConfigured()) return book;
    try {
      const { data, error } = await supabase.from('books').update({
        no: book.no,
        title: book.title,
        author: book.author,
        price: Number(book.price) || 0,
        original_price: book.originalPrice ? Number(book.originalPrice) : null,
        color: book.color,
        color_end: book.colorEnd,
        category: book.category,
        tags: Array.isArray(book.tags) ? book.tags : ['programming'],
        stock: Number(book.stock) || 0,
        short_desc: book.desc,
        full_desc: book.fullDesc,
        pdf_url: book.pdfUrl
      }).eq('id', id).select().single();
      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Supabase UpdateBook Error:', err);
      throw err;
    }
  },

  async deleteBook(id) {
    if (!isSupabaseConfigured()) return true;
    try {
      const { error } = await supabase.from('books').delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Supabase DeleteBook Error:', err);
      throw err;
    }
  },

  // ==========================================
  // ORDERS & PAYMENT TRANSACTION LOGGING
  // ==========================================
  async createOrder(orderData, bookItems, paymentDetails = {}, userId = null, userEmail = null) {
    if (!isSupabaseConfigured()) return orderData;
    try {
      // 1. Insert order record
      const { data: order, error: orderErr } = await supabase.from('orders').insert({
        id: orderData.id,
        user_id: userId || 'guest-' + Date.now(),
        user_email: userEmail || 'customer@store.io',
        total: Number(orderData.total) || 0,
        subtotal: Number(orderData.subtotal) || 0,
        discount: Number(orderData.discount) || 0,
        status: 'Delivered',
        payment_method: (orderData.paymentMethod || 'RAZORPAY').toUpperCase()
      }).select().single();

      if (orderErr) {
        console.warn('Orders table insert error:', orderErr);
      }

      // 2. Insert order items
      const itemsPayload = bookItems.map(b => ({
        order_id: orderData.id,
        book_id: b.id,
        title: b.title,
        price: Number(b.price) || 0
      }));
      await supabase.from('order_items').insert(itemsPayload);

      // 3. Insert into Payments Analytics Table
      const gross = Number(orderData.total) || 0;
      const gatewayFee = Math.round(gross * 0.02 * 100) / 100; // 2% gateway processing fee
      const netPayout = Math.max(0, gross - gatewayFee);

      const paymentRecord = {
        id: 'PAY-' + Math.floor(100000 + Math.random() * 900000),
        order_id: orderData.id,
        user_id: userId || 'guest',
        user_email: userEmail || 'customer@store.io',
        amount: gross,
        currency: 'INR',
        payment_gateway: (orderData.paymentMethod || 'RAZORPAY').toUpperCase(),
        transaction_ref: paymentDetails.transactionRef || ('pay_' + Math.random().toString(36).substring(2, 14)),
        status: 'captured',
        payment_method_details: paymentDetails.methodDetails || { mode: orderData.paymentMethod || 'RAZORPAY' },
        gateway_fee: gatewayFee,
        tax: Math.round(gross * 0.05 * 100) / 100, // GST estimated
        net_payout: netPayout
      };

      try {
        await supabase.from('payments').insert(paymentRecord);
      } catch (payErr) {
        console.warn('Payments analytics table insert:', payErr);
      }

      // 4. Unlock in user library
      if (userId) {
        const libraryPayload = bookItems.map(b => ({
          user_id: userId,
          book_id: b.id,
          reading_progress: 0
        }));
        await supabase.from('user_library').upsert(libraryPayload, { onConflict: 'user_id,book_id' });
      }

      return order || orderData;
    } catch (err) {
      console.error('Supabase CreateOrder Error:', err);
      return orderData;
    }
  },

  async fetchUserOrders(userId) {
    if (!isSupabaseConfigured() || !userId) return [];
    try {
      const { data, error } = await supabase.from('orders').select(`
        id, total, subtotal, discount, status, payment_method, created_at,
        order_items ( book_id, title, price )
      `).eq('user_id', userId).order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(o => ({
        id: o.id,
        date: o.created_at,
        total: Number(o.total) || 0,
        subtotal: Number(o.subtotal) || 0,
        discount: Number(o.discount) || 0,
        status: o.status,
        paymentMethod: o.payment_method,
        items: o.order_items ? o.order_items.map(i => i.book_id) : []
      }));
    } catch (err) {
      console.error('Supabase FetchOrders Error:', err);
      return [];
    }
  },

  async fetchAllPaymentsAnalytics() {
    if (!isSupabaseConfigured()) return [];
    try {
      const { data, error } = await supabase.from('payments').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.warn('Could not fetch payments analytics:', err);
      return [];
    }
  },

  // ==========================================
  // USER LIBRARY
  // ==========================================
  async fetchUserLibrary(userId) {
    if (!isSupabaseConfigured() || !userId) return [];
    try {
      const { data, error } = await supabase.from('user_library').select('book_id').eq('user_id', userId);
      if (error) throw error;
      return (data || []).map(item => item.book_id);
    } catch (err) {
      console.error('Supabase FetchLibrary Error:', err);
      return [];
    }
  },

  async unlockBookInLibrary(userId, bookId) {
    if (!isSupabaseConfigured() || !userId) return true;
    try {
      await supabase.from('user_library').upsert({
        user_id: userId,
        book_id: bookId,
        reading_progress: 0
      }, { onConflict: 'user_id,book_id' });
      return true;
    } catch (err) {
      console.error('Supabase UnlockBook Error:', err);
      return false;
    }
  },

  // ==========================================
  // WISHLIST
  // ==========================================
  async fetchWishlist(userId) {
    if (!isSupabaseConfigured() || !userId) return [];
    try {
      const { data, error } = await supabase.from('wishlist').select('book_id').eq('user_id', userId);
      if (error) throw error;
      return (data || []).map(item => item.book_id);
    } catch (err) {
      console.error('Supabase FetchWishlist Error:', err);
      return [];
    }
  },

  async toggleWishlist(userId, bookId, shouldAdd) {
    if (!isSupabaseConfigured() || !userId) return;
    try {
      if (shouldAdd) {
        await supabase.from('wishlist').upsert({ user_id: userId, book_id: bookId }, { onConflict: 'user_id,book_id' });
      } else {
        await supabase.from('wishlist').delete().eq('user_id', userId).eq('book_id', bookId);
      }
    } catch (err) {
      console.error('Supabase ToggleWishlist Error:', err);
    }
  },

  // ==========================================
  // SUBSCRIPTIONS
  // ==========================================
  async fetchSubscription(userId) {
    if (!isSupabaseConfigured() || !userId) return { plan: 'free', status: 'active' };
    try {
      const { data, error } = await supabase.from('subscriptions').select('*').eq('user_id', userId).single();
      if (error || !data) return { plan: 'free', status: 'active' };
      return { plan: data.plan, status: data.status, started: data.started_at };
    } catch (err) {
      return { plan: 'free', status: 'active' };
    }
  },

  async updateSubscription(userId, plan) {
    if (!isSupabaseConfigured() || !userId) return;
    try {
      await supabase.from('subscriptions').upsert({
        user_id: userId,
        plan,
        status: 'active',
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });
    } catch (err) {
      console.error('Supabase UpdateSubscription Error:', err);
    }
  }
};
