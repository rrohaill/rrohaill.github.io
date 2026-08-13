# Building PixelSanitizer: A Privacy-First Android App for Photo Metadata Removal

Every time you share a photo taken on a smartphone, you might be unintentionally sharing sensitive personal data — exact GPS coordinates, camera serial numbers, creation timestamps, and device details embedded in the photo's **EXIF metadata**.

To give users full control over their visual privacy, I built and published **PixelSanitizer** — a modern, privacy-first Android app built with **Kotlin and Jetpack Compose**.

![PixelSanitizer Feature Graphic](assets/pixelsanitizer/feature-graphic.png)

---

## ⚡ The 30-Second Pitch

> **Inspect EXIF metadata, assess privacy risks, and strip sensitive data — 100% on-device.**
>
> PixelSanitizer allows you to upload any photo, view a categorized breakdown of its metadata, highlight high-risk privacy fields (like exact GPS location), and sanitize the image before sharing. Zero data leaves your device.

---

## 🛡️ Why Privacy-First Architecture Matters

Many web-based metadata strippers require uploading your photos to a server. For an application designed to protect privacy, sending un-sanitized photos over the network completely defeats the purpose.

In **PixelSanitizer**, the entire pipeline runs locally on Android:

```
[ Photo Selection ] → [ AndroidX ExifInterface Parsing ] → [ Risk Analysis ] → [ Bitmap Re-encoding & Stripping ] → [ Clean Photo Export ]
         │                                                                                                              │
         └──────────────────────────────── 100% Local On-Device ────────────────────────────────────────────────────────┘
```

---

## 🔍 Core Features & UX Design

PixelSanitizer was built with a clean, Material 3 Jetpack Compose user interface that makes technical metadata easy to understand for any user.

| Upload & Analyze | Metadata Explorer | Action Center |
|---|---|---|
| ![Upload](assets/pixelsanitizer/upload.png) | ![Metadata](assets/pixelsanitizer/metadata.png) | ![Actions](assets/pixelsanitizer/actions.png) |

### Key Capabilities:
1. **EXIF Metadata Inspector**: View detailed camera parameters (aperture, ISO, focal length, exposure time, device model).
2. **Privacy Risk Summary**: Automatically flags sensitive fields such as exact latitude/longitude coordinates and device identifiers.
3. **One-Tap Metadata Sanitization**: Strips all EXIF headers while preserving image quality and correcting orientation.
4. **Authenticity Insights**: Heuristic analysis that checks for editing software tags or AI generation markers.
5. **Flexible Export Options**: Save the clean image to gallery, share directly to messaging apps, or export raw metadata as JSON/Text.

---

## 🧠 Under the Hood: EXIF Parsing & Stripping in Kotlin

### 1. Extracting EXIF Tags with `ExifInterface`

Android provides `androidx.exifinterface.media.ExifInterface` to read metadata streams directly from content URIs:

```kotlin
fun extractMetadata(context: Context, uri: Uri): PhotoMetadata {
    val inputStream = context.contentResolver.openInputStream(uri) ?: return PhotoMetadata.empty()
    val exif = ExifInterface(inputStream)

    val latLong = FloatArray(2)
    val hasGps = exif.getLatLong(latLong)

    return PhotoMetadata(
        make = exif.getAttribute(ExifInterface.TAG_MAKE),
        model = exif.getAttribute(ExifInterface.TAG_MODEL),
        dateTime = exif.getAttribute(ExifInterface.TAG_DATETIME),
        gpsLatitude = if (hasGps) latLong[0] else null,
        gpsLongitude = if (hasGps) latLong[1] else null,
        software = exif.getAttribute(ExifInterface.TAG_SOFTWARE),
        iso = exif.getAttribute(ExifInterface.TAG_PHOTOGRAPHIC_SENSITIVITY),
        focalLength = exif.getAttribute(ExifInterface.TAG_FOCAL_LENGTH)
    )
}
```

### 2. Sanitizing Photos (Stripping Metadata)

To completely sanitize a photo without relying on external native binaries, PixelSanitizer decodes the image bitmap, preserves its original orientation, and re-encodes it into a pristine JPEG stream without any EXIF tags attached:

```kotlin
fun sanitizeImage(context: Context, inputUri: Uri): Bitmap {
    val inputStream = context.contentResolver.openInputStream(inputUri)
    val originalBitmap = BitmapFactory.decodeStream(inputStream)
    
    // Read orientation to ensure sanitized photo remains correctly oriented
    val exif = ExifInterface(context.contentResolver.openInputStream(inputUri)!!)
    val orientation = exif.getAttributeInt(
        ExifInterface.TAG_ORIENTATION,
        ExifInterface.ORIENTATION_NORMAL
    )

    // Rotate bitmap if necessary before stripping headers
    return rotateBitmap(originalBitmap, orientation)
}
```

---

## 🏗️ Technical Stack

- **Language**: Kotlin
- **UI Framework**: Jetpack Compose (Material 3)
- **Image Loading**: Coil for Compose
- **Metadata Engine**: AndroidX `ExifInterface`
- **Architecture**: Single Activity, MVVM with Unidirectional Data Flow (`StateFlow`)
- **Release Optimization**: ProGuard R8 minification, resource shrinking, debug/release AdMob safety configs

---

## 🚀 Get PixelSanitizer

PixelSanitizer is available on the Google Play Store and open-source on GitHub:

- 📱 **Google Play Store**: [Download PixelSanitizer](https://play.google.com/store/apps/details?id=dev.rrohaill.photometadata&pcampaignid=web_share)
- 💻 **GitHub Source Code**: [rrohaill/PixelSanitizer](https://github.com/rrohaill/PixelSanitizer)
