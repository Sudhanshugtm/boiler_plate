# Wikipedia UX Prototyping Workflow

Quick-start guide for rapid Wikipedia UX prototyping and design variations.

---

## 🚀 Quick Start

### 1. Fetch Any Wikipedia Page

```bash
# Fetch a specific page
python3 fetch_page.py --url "https://hi.wikipedia.org/wiki/विशेष:Contribute"

# Or specify language and page name
python3 fetch_page.py --lang hi --page "विशेष:योगदान/GautamSudhanshu"

# Custom output name
python3 fetch_page.py --url "URL" --output my_page.html
```

The page will be saved in the `pages/` directory, ready for prototyping.

### 2. Test Design Variants

Open any page with variant parameters:

```
# Test variant 1
index.html?variant=1

# Test variant 2
pages/contribute.html?variant=2

# Enable debug mode
index.html?variant=1&debug=true
```

Click the **⚙️ button** (bottom-right) to switch variants on the fly.

### 3. Create Your Own Variants

Edit `assets/js/variants.js` and add your variant logic:

```javascript
case '4':
  // Variant 4: Your custom UX change
  myCustomFunction();
  break;
```

---

## 📁 Project Structure

```
boiler_plate/
├── index.html              # Main demo page (Albert Einstein)
├── pages/                  # Additional fetched pages
│   ├── contribute.html
│   └── user_contributions.html
├── assets/
│   ├── css/               # Wikipedia CSS (vendored)
│   ├── js/
│   │   ├── dropdowns.js   # Menu interactions
│   │   ├── tabs.js        # Tab navigation
│   │   ├── search.js      # Search autocomplete
│   │   ├── variants.js    # ★ Design variants system
│   │   └── main.js        # Utilities
│   └── images/            # Logos and icons
├── fetch_page.py          # ★ Page fetcher tool
└── WORKFLOW.md            # This file
```

---

## 💡 Common Workflows

### Prototype a New Feature

**Example: Improving the Contributions Menu**

1. **Fetch the pages you need:**
   ```bash
   python3 fetch_page.py --lang hi --page "विशेष:Contribute"
   python3 fetch_page.py --lang hi --page "विशेष:योगदान/YourUsername"
   ```

2. **Create variants in `assets/js/variants.js`:**
   - Variant 1: Always show "Contribute" first
   - Variant 2: Merge both tabs
   - Variant 3: Add explanatory text

3. **Test locally:**
   ```
   open pages/contribute.html?variant=1
   open pages/contribute.html?variant=2
   open pages/contribute.html?variant=3
   ```

4. **Share with team:**
   ```bash
   git checkout -b feature-contributions-ux
   git add .
   git commit -m "Add contributions menu variants"
   git push origin feature-contributions-ux
   ```

5. **Deploy to GitHub Pages for each variant:**
   ```
   https://yourname.github.io/boiler_plate/pages/contribute.html?variant=1
   https://yourname.github.io/boiler_plate/pages/contribute.html?variant=2
   ```

---

### Test Multi-Language UX

```bash
# Fetch same feature in different languages
python3 fetch_page.py --lang en --page "Special:Contribute" --output pages/contribute-en.html
python3 fetch_page.py --lang hi --page "विशेष:Contribute" --output pages/contribute-hi.html
python3 fetch_page.py --lang fr --page "Spécial:Contribute" --output pages/contribute-fr.html
```

Open all three side-by-side to compare UX across languages.

---

### A/B Test Different Approaches

**Scenario: Testing two different tab behaviors**

```javascript
// In assets/js/variants.js

case '1':
  // Approach A: Always show Contribute first
  forceContributeTabFirst();
  break;

case '2':
  // Approach B: Smart default based on history
  showRelevantTabFirst();
  break;
```

**Share with engineers:**
- Variant 1: `...?variant=1`
- Variant 2: `...?variant=2`

Ask: "Which feels more intuitive?"

---

## 🎨 Creating Variants

### Method 1: JavaScript Logic (Recommended)

Edit `assets/js/variants.js`:

```javascript
function applyVariant(variantId) {
  switch(variantId) {
    case '5':
      // Your UX change here
      document.querySelector('.my-element').style.display = 'none';
      break;
  }
}
```

### Method 2: CSS Classes

The variant system adds a class to `<body>`:

```css
/* In a custom CSS file */
body.variant-5 .my-element {
  display: none;
}
```

### Method 3: HTML Modifications

Manually edit the HTML in `pages/` for structural changes.

---

## 📤 Deployment Workflow

### For Quick Feedback

1. **Single branch deployment:**
   ```bash
   git add .
   git commit -m "UX prototype: Contributions menu improvements"
   git push origin main
   ```

   Access at: `https://yourname.github.io/boiler_plate/pages/contribute.html?variant=1`

### For Multiple Variations

1. **Create branches for each major variant:**
   ```bash
   git checkout -b variant-tabs-merged
   # Make changes
   git push origin variant-tabs-merged

   git checkout -b variant-always-contribute-first
   # Make changes
   git push origin variant-always-contribute-first
   ```

2. **Deploy each branch to GitHub Pages**
   (Configure in repo settings or use GitHub Actions)

3. **Share links:**
   - Version A: `https://...github.io/boiler_plate/?branch=variant-tabs-merged`
   - Version B: `https://...github.io/boiler_plate/?branch=variant-always-contribute-first`

---

## 🐛 Debug Mode

Enable with `?debug=true`:

```
index.html?debug=true
```

Features:
- Red outlines on all elements
- Click event logging
- Hover element inspection
- Console warnings for interactions

---

## 🔧 Advanced Tips

### Rapid Iteration

Use browser dev tools + live reload:

```bash
# In one terminal
python3 -m http.server 8000

# Open: http://localhost:8000
# Edit files → refresh browser
```

### Batch Fetch Pages

```bash
# Fetch multiple pages at once
for page in "Special:Contribute" "Special:RecentChanges" "Special:Watchlist"; do
  python3 fetch_page.py --page "$page" --lang en
done
```

### Extract Components

Copy HTML snippets from fetched pages to reuse across prototypes.

---

## 📊 Feedback Collection

### Share Variants with Team

Create a simple comparison page:

```html
<h2>Contributions Menu - Design Options</h2>
<ul>
  <li><a href="pages/contribute.html?variant=1">Option A: Always show Contribute first</a></li>
  <li><a href="pages/contribute.html?variant=2">Option B: Combined view</a></li>
  <li><a href="pages/contribute.html?variant=3">Option C: With explanatory text</a></li>
</ul>
```

### Track Preferences

Use URL parameters to encode user feedback:

```
pages/contribute.html?variant=2&vote=prefer
```

---

## 🚨 Troubleshooting

**Page looks broken after fetching:**
- Make sure CSS files are in `assets/css/`
- Check browser console for errors
- Try fetching the page again

**Variant not applying:**
- Check `assets/js/variants.js` is loaded
- Open browser console, look for errors
- Verify variant ID in URL matches your code

**Can't fetch a page:**
- Check the URL is correct
- Try fetching in browser first
- Some special pages may be restricted

---

##✅ Checklist for New Prototype

- [ ] Fetch all required pages
- [ ] Create 2-3 design variants
- [ ] Test each variant locally
- [ ] Add variant descriptions in code comments
- [ ] Push to branch
- [ ] Share links with team
- [ ] Collect feedback
- [ ] Iterate

---

**Pro tip:** Keep this workflow fast. The goal is to go from idea → prototype → feedback in <30 minutes.
