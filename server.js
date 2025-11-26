require('dotenv').config(); 
const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const { createClient } = require('@supabase/supabase-js'); 
const data = require('./data/staticData');

// --- SUPABASE CONFIGURATION ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- FIX FOR VERCEL (INTERNAL SERVER ERROR) ---
// You MUST explicitly tell Express where the 'views' folder is
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(expressLayouts);
app.set('layout', 'layout');
app.use(express.static(path.join(__dirname, 'public')));

// --- ROUTES ---

// 1. Home Page
app.get('/', (req, res) => res.render('index', { title: 'Home', user: null }));

// 2. Login Page

app.get('/login', (req, res) => {
    // 1. Calculate the current domain (Localhost or Production)
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers['x-forwarded-host'] || req.get('host');
    const baseUrl = `${protocol}://${host}`;
    
    // 2. Define the return ticket
    const returnUrl = `${baseUrl}/auth/callback`;
    const encodedUrl = encodeURIComponent(returnUrl);
    
    // 3. GO! Redirect immediately to Crowbar
    // We use 'redirect_to' because that is what your Crowbar code looks for
    res.redirect(`https://www.crowbarltd.com/login?redirect_to=${encodedUrl}`);
});

app.get('/auth/callback', (req, res) => {
    
    res.render('callback', { title: 'Syncing Identity...', hideLayout: true });
});

// 3. Auth Route (Note: If you use this, change localhost to your Vercel link)
app.get('/auth/crowbar', async (req, res) => {
    // Determine the base URL (Production vs Local)
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers['x-forwarded-host'] || req.get('host');
    const baseUrl = `${protocol}://${host}`;

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'oidc', 
      options: {
        // Dynamically set redirect URL so it works on Vercel AND Localhost
        redirectTo: `${baseUrl}/login`, 
        scopes: 'openid profile email', 
      },
    });
  
    if (error) return res.send("Error: " + error.message);
    res.redirect(data.url); 
});



// 4. Dashboard
app.get('/dashboard', (req, res) => res.render('dashboard', { title: 'Dashboard', ...data }));

// 5. Post Job Page
app.get('/post-job', (req, res) => res.render('post-job', { title: 'Post a Gig', user: data.user }));

// 6. Apply Job Page
app.get('/apply-job', (req, res) => res.render('apply-job', { title: 'Find Gigs', ...data }));

// 7. Messaging Page
app.get('/messaging', (req, res) => res.render('messaging', { title: 'Messages', ...data }));


// --- VERCEL DEPLOYMENT CONFIG ---
const PORT = process.env.PORT || 3000;

if (require.main === module) {
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

module.exports = app;