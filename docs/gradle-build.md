# Gradle APK build steps (CI and local)

This document describes the steps the CI workflow uses to build the Android release APK and how you can reproduce them locally.

## CI summary
- Checkout repository (full history with `fetch-depth: 0`).
- Set up JDK 17.
- Install Android command-line tools and required SDK platforms/build-tools.
- Run `cd android && ./gradlew assembleRelease` using the Gradle wrapper.
- Upload `android/app/build/outputs/apk/release/*.apk` as a CI artifact.

## Local reproduction
1. Install Java 17 (SDKMAN or package manager).
2. Install Android SDK or Android Studio and ensure `ANDROID_SDK_ROOT` points to the SDK root.
3. From the repository root:

```bash
# ensure you have the gradle wrapper
cd android
./gradlew assembleRelease --no-daemon --stacktrace
```

4. Resulting APK is at `android/app/build/outputs/apk/release/app-release.apk` (or similar).

## Notes & troubleshooting
- If Gradle fails due to missing SDK components, install them with the SDK manager, for example:

```bash
$ANDROID_SDK_ROOT/cmdline-tools/latest/bin/sdkmanager "platform-tools" "platforms;android-33" "build-tools;33.0.2"
```

- If build fails with signing errors, ensure release signing config is provided in `android/app/build.gradle` or use `--no-sign` alternatives for debug builds.

- To speed up CI, the workflow caches `~/.gradle/caches` and `~/.gradle/wrapper`.

- The CI uses `runner.temp` to install the SDK to avoid persisting large SDK files across runs; this keeps jobs isolated.
