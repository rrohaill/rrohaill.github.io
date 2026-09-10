# Building FitBrief: Private, On-Device AI Fitness Summaries with Health Connect & Gemini Nano

Fitness trackers and health apps generate mountains of daily numbers: steps, distance, active calories, heart rate samples, and sleep sessions. Yet navigating through raw charts and tables often fails to answer the simplest question: *“How did I actually do today, and what should I focus on next?”*

Cloud-based health services solve this by shipping your sensitive biometrics to remote servers for AI processing. But your health data is deeply personal. It shouldn't leave your phone to give you meaningful insights.

To solve this, I designed and built **FitBrief** — a modern, privacy-first Android app in **Kotlin and Jetpack Compose** that connects to Android's **Health Connect API** and turns raw activity data into plain-language summaries using **On-Device Generative AI** (Gemini Nano via the ML Kit GenAI Prompt API, with a LiteRT-LM fallback). All health metrics and AI inference stay 100% on the device.

---

## ⚡ The 30-Second Overview

> **Turn Health Connect data into private, plain-language fitness summaries without a single byte leaving your phone.**
>
> FitBrief aggregates your daily movement, workouts, heart-rate zones, and sleep sessions, constructs an intelligent activity timeline, and generates an on-device AI narrative of your day.

---

## 🛡️ Privacy-First Architecture

Unlike fitness platforms that synchronize biometric telemetry to the cloud, FitBrief operates under a strict **Zero Cloud Data** paradigm:

```
[ Android Health Connect ] 
        ↓ (Granular, Partial-Grant Permissions)
[ Health Connect Data Aggregator ] (Steps, Calories, Heart Rate, Sleep, Workouts)
        ↓
[ Activity Timeline Heuristics ] (Windowed Movement, Gaps, Heart-Rate Spikes)
        ↓
[ On-Device AI Summarizer ] (Gemini Nano / LiteRT-LM Gemma 3 1B)
        ↓
[ FitBrief Jetpack Compose UI ] (Dashboard, Intraday Zone Bands, Daily Briefs)
```

1. **Local Reads**: Health Connect data is read locally via `HealthConnectClient`.
2. **On-Device Inference**: Summaries and insights are generated locally through the system AICore service (Gemini Nano) or a lightweight local model via LiteRT-LM.
3. **No Network Dependency**: Summaries work entirely offline — on flights, during mountain hikes, or in airplane mode.

---

## 📸 App Showcase & Screenshots

| Today Dashboard | Activity Timeline | Week View | Heart Rate Zones |
|---|---|---|---|
| ![Today Dashboard](assets/fitbrief/01-dashboard-today.png) | ![Activity Timeline](assets/fitbrief/02-dashboard-timeline.png) | ![Week View](assets/fitbrief/03-dashboard-week.png) | ![Heart Rate Detail](assets/fitbrief/05-heart-rate-detail.png) |

---

## 🚀 Core Features & Architectural Highlights

### 1. Granular Health Connect Integration
- **Availability Detection**: Detects if Health Connect is installed or requires updates, providing clean user onboarding.
- **Partial-Grant Safe Permissions**: Gracefully handles partial permissions for steps, distance, active & total calories, exercise sessions, heart rate, and sleep.
- **Selectable Temporal Ranges**: Seamlessly switch between **Today**, **Week (Monday to Sunday)**, and calendar **Month** with instant ViewModel caching.

### 2. Activity Timeline with Smart Windowing
Instead of overwhelming users with raw sensor points, FitBrief constructs an intelligent timeline:
- **Movement Windows**: Walking windows are seeded when steps and distance exceed 10 minutes and 500 steps.
- **Heart-Rate Windows**: Detects sustained heart-rate elevations with 10-minute gap thresholds.
- **Calories Overlap**: Attributes calories burned to the exact activity windows they overlap with.
- **Exercise & Sleep Sessions**: Distinct, prominent timeline event cards with descriptive AI sentences.

### 3. Intraday Heart Rate Zone Bands
- The heart rate detail screen renders intraday samples plotted across distinct zone bands (Resting, Moderate, Vigorous, Peak).
- Highlights low, average, and high heart-rate extremes with targeted AI insights per biometric metric.

### 4. Background Scheduling via WorkManager
- Optional daily FitBrief reminders scheduled with Android `WorkManager`.
- Leverages background and history permissions to prepare morning and evening summaries even before you open the app.

---

## 🧠 On-Device AI Engine: Dual-Backend Inference

FitBrief selects its summarization engine dynamically at runtime:

```kotlin
interface FitnessSummarizer {
    suspend fun generateDailyBrief(context: FitnessContext): Result<String>
    suspend fun generateTimelineInsight(event: ActivityEvent): Result<String>
}
```

1. **Primary Backend — ML Kit GenAI Prompt API (Gemini Nano / AICore)**:
   - Utilizes Google's system-level AICore on supported devices (such as Pixel 8/9/10).
   - Monitors model readiness (`AVAILABLE`, `DOWNLOADABLE`, `DOWNLOADING`) before streaming inference.
2. **Fallback Backend — LiteRT-LM (Gemma 3 1B)**:
   - For devices without system AICore, FitBrief includes an optional reflection-loaded LiteRT backend running a quantized local Gemma 3 model.

---

## 💻 Open Source & GitHub

FitBrief is open-source and actively maintained on GitHub.

- **GitHub Repository**: [github.com/rrohaill/FitBrief](https://github.com/rrohaill/FitBrief)
- **Status**: Open Source on GitHub · Google Play Store Release Coming Soon
