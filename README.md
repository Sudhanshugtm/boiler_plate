# Wikipedia UX Prototyping System

**Rapid prototyping framework for Wikipedia UX design work.**

Build, test, and share design variations in minutes.

---

## ⚡ Quick Start

```bash
# 1. Fetch any Wikipedia page
python3 fetch_page.py --url "https://hi.wikipedia.org/wiki/विशेष:Contribute"

# 2. Open and test
open pages/contribute.html

# 3. Test with variants
open pages/contribute.html?variant=1
```

**See [WORKFLOW.md](WORKFLOW.md) for complete guide.**

**See [DEPLOYMENT.md](DEPLOYMENT.md) for GitHub Pages deployment instructions.**

---

## 🎯 What This Does

This is a **complete prototyping system** for Wikipedia UX design:

✅ **Fetch any page** from any language Wikipedia
✅ **Full interactivity** - dropdowns, tabs, search all work
✅ **Design variants** - test multiple UX approaches via URL params
✅ **Quick iteration** - change code, refresh browser
✅ **Easy sharing** - deploy to GitHub Pages, share links with team
✅ **Multi-language** - test UX across Hindi, English, French, etc.

---

## 🏗️ Core Features

### 1. Universal Page Fetcher

```bash
# Fetch any Wikipedia page in any language
python3 fetch_page.py --lang hi --page "विशेष:Contribute"
python3 fetch_page.py --url "https://en.wikipedia.org/wiki/Special:RecentChanges"
```

All pages work immediately with full styling and functionality.

### 2. Design Variant System

Test multiple UX approaches on the same page:

```
?variant=1  → Test approach A
?variant=2  → Test approach B
?variant=3  → Test approach C
?debug=true → Enable debug mode
```

Click the **⚙️ button** to switch variants without reloading.

### 3. Example Variants Included

For the **Contributions Menu** issue:
- **Variant 1**: Always show "Contribute" tab first
- **Variant 2**: Merge both tabs into one view
- **Variant 3**: Add explanatory help text

*(Edit `assets/js/variants.js` to add your own)*

---

## 📁 What's Inside

```
boiler_plate/
├── fetch_page.py       # ★ Fetch any Wikipedia page
├── index.html          # Demo: Albert Einstein article
├── pages/              # Your fetched pages go here
├── assets/
│   ├── css/           # Wikipedia CSS (vendored locally)
│   └── js/
│       ├── variants.js  # ★ Design variants system
│       ├── dropdowns.js # Menu interactions
│       ├── tabs.js      # Tab navigation
│       ├── search.js    # Search with autocomplete
│       └── main.js      # Utilities (dark mode, etc.)
├── WORKFLOW.md         # ★ Complete workflow guide
└── README.md           # This file
```

---

## 🚀 Real-World Workflow

**Scenario: UX engineer asks you to prototype improvements to the Contributions menu**

### Current Problem
Users with past contributions land on "Past contributions" tab, but new users land on "Contribute" tab. This creates confusion about what the page is for.

### Your Solution (5 minutes)

```bash
# 1. Fetch the pages (30 seconds)
python3 fetch_page.py --lang hi --page "विशेष:Contribute"
python3 fetch_page.py --lang hi --page "विशेष:योगदान/Username"

# 2. Create 3 variants (2 minutes)
# Edit assets/js/variants.js with your UX ideas

# 3. Test locally (1 minute)
open pages/contribute.html?variant=1
open pages/contribute.html?variant=2
open pages/contribute.html?variant=3

# 4. Deploy and share (1 minute)
git add .
git commit -m "Contributions menu UX variants"
git push

# Share links:
# https://you.github.io/boiler_plate/pages/contribute.html?variant=1
# https://you.github.io/boiler_plate/pages/contribute.html?variant=2
```

**Result:** Team can click through all variants and give feedback immediately.

---

## 💡 Use Cases

### ✅ Prototype UI Changes
Fetch a page, modify the HTML/CSS, deploy → instant visual prototype

### ✅ Test Multi-Language UX
Fetch the same feature in Hindi, English, French → see how it works across languages

### ✅ A/B Test Design Approaches
Create variants → share with team → collect preferences

### ✅ Build Design Documentation
Capture current state → modify → show before/after

### ✅ Present to Stakeholders
Real Wikipedia interface → your changes → interactive demo

---

## 🎨 How Variants Work

The variant system lets you test different UX without duplicating code:

```javascript
// In assets/js/variants.js
case '1':
  // Your custom UX change
  forceContributeTabFirst();
  break;

case '2':
  combineContributionTabs();
  break;
```

Access via URL: `page.html?variant=1`

The system automatically:
- Adds `variant-1` class to `<body>` for CSS targeting
- Shows a variant indicator in bottom-right corner
- Provides a variant switcher menu (click ⚙️)
- Logs variant ID in console for debugging

---

## 🌐 Multi-Language Support

Works with **any language Wikipedia**:

```bash
# Hindi
python3 fetch_page.py --lang hi --page "मुखपृष्ठ"

# French
python3 fetch_page.py --lang fr --page "Accueil"

# German
python3 fetch_page.py --lang de --page "Hauptseite"

# Japanese
python3 fetch_page.py --lang ja --page "メインページ"
```

All styling and interactivity work automatically.

---

## 🔧 Advanced Features

### Debug Mode
```
?debug=true
```
- Red outlines on all elements
- Click logging to console
- Hover element inspection

### Custom Variants
Add your own in `assets/js/variants.js`:
```javascript
case '10':
  // My custom variant
  document.querySelector('.my-element').remove();
  break;
```

### CSS-Only Variants
```css
body.variant-5 .contribution-tabs {
  flex-direction: column;
}
```

---

## 📤 Deployment

### GitHub Pages (Automated)

This repository includes a GitHub Actions workflow that automatically deploys to GitHub Pages when you push to the main branch.

**One-time setup:**

1. Go to your repository Settings → Pages
2. Under "Build and deployment", set Source to **GitHub Actions**
3. That's it! The workflow will deploy automatically on every push to main

**Deploy your changes:**

```bash
# Commit and push your changes
git add .
git commit -m "Add UX prototypes"
git push origin main

# GitHub Actions will automatically deploy
# Access your site at: https://username.github.io/boiler_plate/
```

**Manual deployment option:**

You can also trigger deployment manually from the Actions tab → "Deploy to GitHub Pages" → "Run workflow"

### Multiple Branches

Create a branch for each major design direction:

```bash
git checkout -b design-option-a
git checkout -b design-option-b
```

Deploy each to GitHub Pages for side-by-side comparison.

---

## 🎯 Best Practices

1. **Fetch before modifying** - Always start with real Wikipedia HTML
2. **Test in multiple languages** - UX that works in English may not work in Hindi
3. **Create 2-3 variants max** - Too many choices slow down feedback
4. **Document your variants** - Add comments explaining the UX rationale
5. **Iterate fast** - Go from idea → prototype → feedback in <30 minutes

---

## 🤝 Working with Engineers

### Share Prototypes

Send links with variant params:
```
Option A: ...?variant=1
Option B: ...?variant=2
```

### Get Feedback

Create a simple comparison page:
```html
<h2>Which design do you prefer?</h2>
<a href="?variant=1">Option A</a>
<a href="?variant=2">Option B</a>
```

### Export Code

Engineers can inspect element → copy HTML/CSS directly from your prototype.

---

## 📚 Documentation

- **[WORKFLOW.md](WORKFLOW.md)** - Complete workflow guide with examples
- **[fetch_page.py](fetch_page.py)** - Page fetcher documentation
- **[assets/js/variants.js](assets/js/variants.js)** - Variant system code

---

## ⚠️ Limitations

- No backend - all features are simulated
- Search doesn't connect to real Wikipedia search
- Edit/save buttons don't actually save
- Page navigation requires fetching each page individually

**This is intentional** - it's for UX prototyping, not production.

---

## 🆘 Troubleshooting

**Page looks broken:** Check that `assets/css/` has the CSS files
**Variant not working:** Open console, check for errors
**Can't fetch page:** Try the URL in a browser first
**JavaScript not loading:** Check file paths in HTML

---

## 📝 License

- Wikipedia content: CC BY-SA 4.0
- MediaWiki software: GPL-2.0-or-later
- This prototyping system: GPL-2.0-or-later

---

## 🚀 Next Steps

1. Read [WORKFLOW.md](WORKFLOW.md)
2. Fetch your first page
3. Create your first variant
4. Share with your team

**Go from idea to deployed prototype in 5 minutes.**

---

Built for rapid Wikipedia UX prototyping by Wikimedia UX designers.
