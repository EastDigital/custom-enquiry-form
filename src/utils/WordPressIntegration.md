
# WordPress Integration Guide for Quote Form

This guide explains how to integrate this React-based quotation form into your WordPress site using Elementor Pro.

## Prerequisites

1. A WordPress site with Elementor Pro installed and activated
2. Basic understanding of HTML/CSS/JS
3. Admin access to your WordPress site

## Integration Steps

### Step 1: Build the React Application

1. Build the React application to generate static files:
   ```bash
   npm run build
   ```
   
2. The build process will create a `dist` directory with all the necessary files.

### Step 2: Set Up in WordPress

1. **Create a new page** or edit an existing page in WordPress where you want to display the quote form
2. **Edit with Elementor Pro**
3. **Add a new section** to your page where you want the form to appear

### Step 3: Add Required Scripts and Styles

1. Add a **Custom HTML** widget to your section
2. Copy and paste the following code into the widget:

```html
<!-- React Dependencies -->
<script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>

<!-- Your App CSS (from build output) -->
<link rel="stylesheet" href="PATH_TO_YOUR_CSS/index.css">

<!-- App Container -->
<div id="quotation-app-root" class="quotation-app-container"></div>

<!-- Your App JS (from build output) -->
<script src="PATH_TO_YOUR_JS/index.js" type="module"></script>

<!-- Initialization Script -->
<script>
  document.addEventListener('DOMContentLoaded', function() {
    // This will initialize your application once the page loads
    if (window.initializeQuotationForm) {
      window.initializeQuotationForm();
    } else {
      console.error('Quotation form initialization function not found');
    }
  });
</script>
```

4. Replace `PATH_TO_YOUR_CSS` and `PATH_TO_YOUR_JS` with the actual paths to your CSS and JS files:
   - If hosting on your WordPress server, upload the files to your media library or theme folder and reference them
   - If hosting elsewhere (recommended), use the complete URLs

### Step 4: Tailwind CSS Integration

Since your app uses Tailwind CSS, you need to make sure your WordPress page doesn't have conflicts:

1. Add the following CSS to your page using Elementor's Custom CSS feature:

```css
/* Reset Elementor styles in our app container */
.quotation-app-container * {
  font-family: inherit;
  box-sizing: border-box;
}

/* Make sure form looks good */
#quotation-form-container {
  max-width: 100%;
  margin: 0 auto;
}
```

### Step 5: Test and Troubleshoot

1. Preview your page to make sure the form loads correctly
2. Check the browser console for any errors
3. Test the form functionality thoroughly
4. Verify that emails are sent (check spam folders)

### Common Issues and Solutions

1. **Form not loading**: Make sure all paths to scripts and styles are correct
2. **Styling issues**: May occur due to conflicts between WordPress theme and React app styles
3. **Email not sending**: This might be due to Cross-Origin Resource Sharing (CORS) issues

#### Email CORS Issues

If you're experiencing issues with emails not being sent, it might be due to CORS restrictions. To solve this:

1. Update your Supabase configuration to allow requests from your WordPress domain
2. Consider creating a WordPress proxy endpoint using a simple plugin or custom code to forward requests to Supabase

### Advanced: Creating a Custom WordPress Plugin

For a more professional integration, consider creating a simple WordPress plugin that:

1. Registers a shortcode to embed your form
2. Enqueues all necessary scripts and styles properly
3. Handles CORS issues for API calls

This would make your integration more maintainable and easier to update in the future.
