# Backend Implementation: Dark/Light Mode Image Variants

## Overview
This document provides instructions for the backend team to implement support for serving different images based on the user's theme preference (dark mode vs light mode).

## Current Frontend Implementation

The frontend has been fully updated to support theme-aware images:

### 1. Dark Mode Integration
- ✅ Theme provider added to root layout (`app/layout.tsx`)
- ✅ Theme toggle button in header
- ✅ All UI components updated for dark mode
- ✅ CSS variables configured for both light and dark themes

### 2. Type System Updates
All TypeScript types have been updated to support optional dark mode image variants:

**Updated Types (`types/strapi.ts`):**

```typescript
// Raw Strapi Types
export type StrapiGalleryItem = {
    // ... existing fields
    image: StrapiImage[];
    darkModeImage?: StrapiImage[];  // NEW
}

export type StrapiPortfolioItem = {
    // ... existing fields
    FullImage: StrapiImage;
    FullImageDarkMode?: StrapiImage;  // NEW
}

export type StrapiBioItem = {
    // ... existing fields
    profileImage: StrapiImage;
    profileImageDarkMode?: StrapiImage;  // NEW
}

export type StrapiStory = {
    // ... existing fields
    images: StrapiImage[];
    darkModeImages?: StrapiImage[];  // NEW
    companyLogo?: StrapiImage;
    companyLogoDarkMode?: StrapiImage;  // NEW
}
```

### 3. API Integration
The frontend is now requesting dark mode images from all endpoints:

```typescript
// Gallery Items
GET /api/gallery-items?populate=image,darkModeImage

// Portfolio Items
GET /api/portfolio-items?populate=FullImage,FullImageDarkMode

// Bio
GET /api/bio?populate=profileImage,profileImageDarkMode

// Stories
GET /api/stories?populate=images,darkModeImages,companyLogo,companyLogoDarkMode
```

### 4. Image Display Logic
- Gallery items, lightbox, and all image components now check the current theme
- When in dark mode AND a dark variant exists, the dark image is displayed
- Falls back to the standard image if no dark variant is provided

## Required Backend Changes

### 1. Strapi Content Type Schema Updates

You need to add optional media fields to the following content types in Strapi:

#### Gallery Items (`gallery-items`)
Add new field:
- **Field Name:** `darkModeImage`
- **Type:** Media (Multiple files)
- **Required:** No
- **Description:** Alternative images to display in dark mode

#### Portfolio Items (`portfolio-items`)
Add new field:
- **Field Name:** `FullImageDarkMode`
- **Type:** Media (Single file)
- **Required:** No
- **Description:** Alternative image to display in dark mode

#### Bio (`bio`)
Add new field:
- **Field Name:** `profileImageDarkMode`
- **Type:** Media (Single file)
- **Required:** No
- **Description:** Alternative profile image to display in dark mode

#### Stories (`stories`)
Add new fields:
- **Field Name:** `darkModeImages`
- **Type:** Media (Multiple files)
- **Required:** No
- **Description:** Alternative images to display in dark mode (should match order of main images)

- **Field Name:** `companyLogoDarkMode`
- **Type:** Media (Single file)
- **Required:** No
- **Description:** Alternative company logo to display in dark mode

### 2. Strapi API Configuration

Ensure the new fields are:
1. ✅ Included in the API response (check API permissions)
2. ✅ Properly populated when requested with the `populate` parameter
3. ✅ Accessible by the API token used by the frontend

### 3. Migration Strategy

Since these fields are **optional**, the implementation is backward compatible:

1. **No breaking changes:** Existing images will continue to work
2. **Gradual rollout:** Dark mode images can be added progressively to content
3. **Automatic fallback:** Frontend will use the standard image if no dark variant exists

### 4. Content Management Workflow

For content creators using Strapi admin panel:

#### When to Add Dark Mode Images

Consider adding dark mode variants when:
- ✨ Images contain white/light backgrounds (may look harsh in dark mode)
- ✨ Images with text overlays (text may need different contrast in dark mode)
- ✨ Brand assets/logos (may have official dark mode variants)
- ✨ UI screenshots (should match the theme for consistency)

#### When NOT to Add Dark Mode Images

Dark mode variants are typically NOT needed for:
- 📸 Photographs of people/nature/landscapes
- 📸 Black and white photography
- 📸 Images that already work well on both light and dark backgrounds

### 5. Testing the Integration

After implementing the backend changes:

1. **Verify API Responses:**
   ```bash
   # Test that populate parameter works
   curl -H "Authorization: Bearer YOUR_TOKEN" \
     "YOUR_STRAPI_URL/api/gallery-items?populate=image,darkModeImage"
   ```

2. **Check Response Structure:**
   Ensure the response includes the new fields:
   ```json
   {
     "data": [
       {
         "id": 1,
         "image": [...],
         "darkModeImage": [...]  // Should be present (can be empty array)
       }
     ]
   }
   ```

3. **Upload Test Images:**
   - Upload a test dark mode image to a gallery item
   - Verify it appears in the API response
   - Check the frontend automatically displays it in dark mode

### 6. Image Guidelines for Content Creators

**Recommended Approach:**

1. **For Light Mode Images:**
   - Use bright, well-lit images
   - White/light backgrounds are fine
   - High contrast with dark text

2. **For Dark Mode Images:**
   - Consider slightly darker/muted versions
   - Adjust brightness/contrast for dark backgrounds
   - Ensure text overlays remain readable

3. **Image Pairing:**
   - Maintain the same subject/composition
   - Keep aspect ratios identical
   - Match the same order for collections (stories/galleries)

## Implementation Checklist

### Backend Tasks
- [ ] Update `gallery-items` content type schema
- [ ] Update `portfolio-items` content type schema
- [ ] Update `bio` content type schema
- [ ] Update `stories` content type schema
- [ ] Verify API permissions for new fields
- [ ] Test API responses with populate parameters
- [ ] Update API documentation

### Content Tasks
- [ ] Review existing images that would benefit from dark mode variants
- [ ] Create/source dark mode versions of priority images
- [ ] Upload dark mode variants to Strapi
- [ ] Test image switching in the frontend

## Example Use Cases

### Use Case 1: Product Screenshots
If showcasing a web application:
- **Light mode image:** Screenshot with light theme
- **Dark mode image:** Screenshot with dark theme
- **Result:** Cohesive experience that matches the user's preference

### Use Case 2: Logos with White Backgrounds
If displaying client logos on white backgrounds:
- **Light mode image:** Logo on white/transparent background
- **Dark mode image:** Logo on dark/transparent background
- **Result:** Logos remain visible and professional in both modes

### Use Case 3: Portrait Photography
For most photography:
- **Light mode image:** Original photograph
- **Dark mode image:** Not needed (leave empty)
- **Result:** Same beautiful image works in both modes

## Questions or Issues?

If you encounter any problems implementing these changes, please check:

1. **Frontend Types:** All types are defined in `types/strapi.ts`
2. **API Integration:** Image fetching logic is in `lib/strapi.ts`
3. **Component Logic:** Image display logic is in `components/gallery-item.tsx` and `components/lightbox-portal.tsx`

## Summary

The frontend is **100% ready** to display theme-aware images. Once you implement the Strapi schema changes:

1. ✅ Images will automatically switch based on theme
2. ✅ No additional frontend work required
3. ✅ Backward compatible (works without dark mode images)
4. ✅ Content creators can gradually add dark mode variants

**The feature will work immediately upon backend deployment!**
