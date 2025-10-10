# GitHub Pages Deployment Guide

This repository is configured for automatic deployment to GitHub Pages using GitHub Actions.

## 🚀 Quick Setup (One-time)

1. **Enable GitHub Pages in your repository:**
   - Go to your repository on GitHub
   - Navigate to **Settings** → **Pages**
   - Under "Build and deployment", set **Source** to: `GitHub Actions`
   - Click **Save**

2. **That's it!** The site will deploy automatically whenever you push to the `main` branch.

## 📦 What Gets Deployed

The entire repository is deployed as-is, including:
- `index.html` - Demo page (Albert Einstein article)
- `pages/` - Directory for your fetched Wikipedia pages
- `assets/` - All CSS, JavaScript, and images
- `.nojekyll` - Prevents Jekyll processing (already configured)

## 🔄 How to Deploy Changes

### Automatic Deployment (Recommended)

Simply push to the main branch:

```bash
git add .
git commit -m "Your commit message"
git push origin main
```

The GitHub Actions workflow will automatically:
1. Build the deployment
2. Deploy to GitHub Pages
3. Your changes will be live in ~1-2 minutes

### Manual Deployment

You can also trigger deployment manually:
1. Go to the **Actions** tab in your repository
2. Select **"Deploy to GitHub Pages"** workflow
3. Click **"Run workflow"**
4. Select the branch (usually `main`)
5. Click **"Run workflow"**

## 🌐 Accessing Your Deployed Site

Once deployed, your site will be available at:

```
https://[your-username].github.io/boiler_plate/
```

For example:
- Main page: `https://[your-username].github.io/boiler_plate/`
- Demo page: `https://[your-username].github.io/boiler_plate/index.html`
- Fetched pages: `https://[your-username].github.io/boiler_plate/pages/contribute.html?variant=1`

## 📝 Workflow Details

The deployment workflow (`.github/workflows/deploy-pages.yml`) runs automatically on:
- Every push to the `main` branch
- Manual trigger via GitHub Actions UI

### Workflow Permissions

The workflow requires these permissions (already configured):
- `contents: read` - To read repository files
- `pages: write` - To deploy to GitHub Pages
- `id-token: write` - For secure deployment

## 🔍 Checking Deployment Status

1. Go to the **Actions** tab in your repository
2. You'll see a list of workflow runs
3. Click on a run to see detailed logs
4. A green checkmark ✓ means deployment succeeded
5. A red X ✗ means deployment failed (check logs for details)

## 🎨 Deploying Design Variants

### Single Branch Strategy (Recommended)

Keep all variants in one branch and use URL parameters:

```bash
# Commit your variants
git add assets/js/variants.js
git commit -m "Add new design variants"
git push origin main

# Share different variants via URLs:
# https://[username].github.io/boiler_plate/pages/contribute.html?variant=1
# https://[username].github.io/boiler_plate/pages/contribute.html?variant=2
# https://[username].github.io/boiler_plate/pages/contribute.html?variant=3
```

### Multiple Branch Strategy

For major design directions, create separate branches:

```bash
# Create and switch to a new branch
git checkout -b design-option-a

# Make your changes
# ... edit files ...

# Push the branch
git add .
git commit -m "Design option A"
git push origin design-option-a

# Deploy this branch to GitHub Pages
# (You'll need to configure GitHub Pages to deploy from this branch
# or use a different GitHub Pages deployment per branch)
```

**Note:** GitHub Pages free tier only deploys one branch at a time. For multiple simultaneous deployments, consider:
- Using URL variants (recommended)
- Creating separate repositories for each design
- Using GitHub Pages preview deployments (requires paid plan)

## 🐛 Troubleshooting

### Deployment Failed

1. Check the Actions tab for error messages
2. Common issues:
   - GitHub Pages not enabled in Settings
   - Incorrect workflow permissions
   - Build artifacts too large (>100MB)

### Site Not Updating

1. Wait 1-2 minutes for deployment to complete
2. Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)
3. Check the Actions tab to verify deployment succeeded
4. Clear browser cache if needed

### 404 Errors

1. Verify the file exists in your repository
2. Check file paths are relative (not absolute)
3. File names are case-sensitive
4. Make sure `.nojekyll` file exists

### Assets Not Loading

1. Verify paths in HTML use relative URLs (e.g., `assets/css/style.css`)
2. Check that asset files are committed to the repository
3. Ensure `.nojekyll` file is present (prevents Jekyll from processing)

## 📚 Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Configuring a publishing source for GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

## 💡 Tips

1. **Use the variant system**: Instead of creating multiple files, use URL parameters to test different designs
2. **Test locally first**: Open `index.html` in your browser before deploying
3. **Monitor deployments**: Keep an eye on the Actions tab when deploying
4. **Share specific variants**: Use `?variant=N` in URLs to share specific design variations
5. **Debug mode**: Add `?debug=true` to any page URL for debugging information

---

Built for rapid Wikipedia UX prototyping by Wikimedia UX designers.
