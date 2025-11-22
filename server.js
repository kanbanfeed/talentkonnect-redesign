require('dotenv').config(); 
const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const { createClient } = require('@supabase/supabase-js'); 
const data = require('./data/staticData');

// --- SUPABASE CONFIG ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- VIEW ENGINE ---
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(expressLayouts);
app.set('layout', 'layout');
app.use(express.static(path.join(__dirname, 'public')));

// --- GLOBAL MIDDLEWARE (Default Settings) ---
app.use((req, res, next) => {
    // By default, show the Header/Footer on every page
    res.locals.hideLayout = false; 
    next();
});

// --- ROUTES ---

// 1. Home Page
app.get('/', (req, res) => res.render('index', { title: 'Home', user: null }));

// 2. Login Page (The Fix: Hide Layout)
// We add 'hideLayout: true' to tell layout.ejs to remove the header
app.get('/login', (req, res) => res.render('login', { title: 'Login', hideLayout: true }));
// 3. Auth Redirect Route
app.get('/auth/crowbar', async (req, res) => {
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers['x-forwarded-host'] || req.get('host');
    const baseUrl = `${protocol}://${host}`;

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'oidc', 
      options: {
        redirectTo: `${baseUrl}/login`, 
        scopes: 'openid profile email', 
      },
    });
  
    if (error) return res.send("Error: " + error.message);
    res.redirect(data.url); 
});

// 4. Dashboard
app.get('/dashboard', (req, res) => res.render('dashboard', { title: 'Dashboard', ...data }));

// 5. Post Job
app.get('/post-job', (req, res) => res.render('post-job', { title: 'Post a Gig', user: data.user }));

// 6. Find Gigs
app.get('/apply-job', (req, res) => res.render('apply-job', { title: 'Find Gigs', ...data }));

// 7. Messages
app.get('/messaging', (req, res) => res.render('messaging', { title: 'Messages', ...data }));


// --- SERVER STARTUP ---
const PORT = process.env.PORT || 3000;

if (require.main === module) {
    app.listen(PORT, () => console.log(`TalentKonnect running on http://localhost:${PORT}`));
}

module.exports = app;