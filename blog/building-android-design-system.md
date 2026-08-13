# Building a Flexible Android Design System with Jetpack Compose

As mobile applications scale, keeping UI consistent across features and developer teams becomes a major challenge. In dynamic codebases, ad-hoc colors, custom paddings, and duplicated button logic quickly lead to design debt, accessibility gaps, and slow feature velocity.

To solve this, I designed and built an **Android Design System** library in **Kotlin and Jetpack Compose** — providing a comprehensive foundation of design tokens, reusable components, and flexible theming rules for Android applications.

---

## 🎯 Project Goals & Architecture

The primary goal of this design system is to establish a **single source of truth** for UI components, design tokens, and theming rules across Android apps.

```
[ Centralized Design Tokens ] 
        ↓ (Colors, Typography, Spacing, Shapes)
[ Custom CompositionLocals & MaterialTheme ]
        ↓
[ Core Component Library ] (Buttons, Cards, Inputs, Dialogs, Badges, Modals)
        ↓
[ Application UI Features ] (Jetpack Compose Screen Trees)
```

---

## 🎨 Core Features

1. 🎨 **Centralized Design Tokens**: Standardized definitions for colors, typography scale, spacing units (4dp/8dp grid), shape corner radiuses, and shadow elevations.
2. 🌈 **Dynamic Light & Dark Theming**: Seamless theme switching with custom color palettes and contrast enforcement.
3. 🧱 **Reusable Component Primitive Catalog**: Fully customizable Compose components (Buttons, Chips, Cards, Badges, Modals, TopBars, Inputs) built on top of Material 3 guidelines.
4. 📱 **Responsive & Adaptive Layouts**: Components that scale gracefully across phone, foldables, and tablet viewports using window size classes.
5. ♿ **Accessibility First (a11y)**: Pre-configured touch target sizes (48dp minimum), semantic properties for screen readers (TalkBack), and automated contrast ratio checks.

---

## 🧠 Code Architecture: Custom Tokens & CompositionLocals

### 1. Defining Design Tokens in Kotlin

Instead of hardcoding color hex values or pixel dimensions in individual UI composables, design tokens organize styles into unified objects:

```kotlin
data class DesignSystemColors(
    val primary: Color,
    val onPrimary: Color,
    val surface: Color,
    val onSurface: Color,
    val background: Color,
    val border: Color,
    val isDark: Boolean
)

data class DesignSystemSpacing(
    val xs: Dp = 4.dp,
    val sm: Dp = 8.dp,
    val md: Dp = 16.dp,
    val lg: Dp = 24.dp,
    val xl: Dp = 32.dp
)
```

### 2. Providing Custom CompositionLocals

Using Compose's `staticCompositionLocalOf`, tokens are made ambiently available throughout the composable tree without explicit parameter drilling:

```kotlin
val LocalAppColors = staticCompositionLocalOf { LightColors }
val LocalAppSpacing = staticCompositionLocalOf { DesignSystemSpacing() }

@Composable
fun AppDesignTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colors = if (darkTheme) DarkColors else LightColors
    val spacing = DesignSystemSpacing()

    CompositionLocalProvider(
        LocalAppColors provides colors,
        LocalAppSpacing provides spacing
    ) {
        MaterialTheme(
            colorScheme = colors.toMaterialColorScheme(),
            content = content
        )
    }
}
```

### 3. Consuming Tokens in Reusable Components

Components access tokens directly through accessor properties for clean, readable component syntax:

```kotlin
@Composable
fun PrimaryButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true
) {
    Button(
        onClick = onClick,
        modifier = modifier
            .defaultMinSize(minHeight = 48.dp)
            .semantics { role = Role.Button },
        enabled = enabled,
        shape = RoundedCornerShape(12.dp),
        colors = ButtonDefaults.buttonColors(
            containerColor = LocalAppColors.current.primary,
            contentColor = LocalAppColors.current.onPrimary
        )
    ) {
        Text(
            text = text,
            style = MaterialTheme.typography.labelLarge,
            modifier = Modifier.padding(horizontal = LocalAppSpacing.current.sm)
        )
    }
}
```

---

## 💡 Key Takeaways & Impact

- **Velocity**: Reduces time-to-market for new screens by providing ready-to-use, accessible UI primitives.
- **Consistency**: Eliminates design drift and ensures dark mode and accessibility work out-of-the-box.
- **Maintainability**: Changing primary branding or spacing scales takes seconds by updating centralized design tokens.

---

## 💻 Source Code & Repository

Check out the full repository and setup guide on GitHub:

- 💻 **GitHub Repository**: [rrohaill/Design-System](https://github.com/rrohaill/Design-System)
