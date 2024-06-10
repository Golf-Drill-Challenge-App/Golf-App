# Golf-App

Cross Platform Mobile app for the OSU Men's Golf Team.

## Landing Page

- https://golf-drill-challenge-app.github.io/
  - Will add more user-facing documentation pages (FAQ) here in the future if needed

## Tech Stack

- [React Native](https://reactnative.dev/)
- [React Native Paper](https://reactnativepaper.com/)
- [Gorhom/bottom-sheet](https://ui.gorhom.dev/components/bottom-sheet/)
- [React Native SVG Charts](https://www.npmjs.com/package/react-native-svg-charts)
- [Expo](https://expo.dev/)
- [TanStack Query](https://tanstack.com/query/latest/docs/framework/react/overview)
- [Firestore](https://firebase.google.com/docs/firestore)

See [package.json](package.json) for more details on libraries used

### Architecture Diagram

![architectural_diagram](https://i.imgur.com/t1Y4ARm.png)

## Design References

- [Figma](https://www.figma.com/file/8fP7vgmQ9kNhYeyFIS5guP/OSU-Golf-App-Prototype?type=design&node-id=1840%3A1676&mode=design&t=vQ8CIjrhrU7uoO9z-1)
  - Mock-ups of overall visual styling of each page, as well as how navigation is intended to work
  - Currently on "Prototype V2" of the Figma prototype
- Golf Coach's Spreadsheets (sample golf drills / calculations)
  - [Approach Shots / Line Tests](https://docs.google.com/spreadsheets/d/1ZufXjRCTzbIqJln_fJ5NDvNo0ahHIM-bkv9ZB8a6Drw/edit#gid=259638677)
  - [Putting](https://docs.google.com/spreadsheets/d/12gnHaMyzP0eGAi3MGVBYaG5obCJ0xri9d0RiqiWKfuA/edit#gid=865463318)
  - [Full List of Golf Drills](https://docs.google.com/spreadsheets/d/1wzSL7WhsdgXudPROZLy6gyYUY910k_wEY-bWuKE_brk/edit#gid=0)
- [Data Golf](https://datagolf.com/player-profiles?dg_id=18841)
  - Example of graph logic / styling, for golf stats

## Database Specifications

- Database Schema: [db_spec.jsonc](db_spec.jsonc)
  - Overview / template of database design and structure
- NOTE: The latest database / database specifications are now on Google Firestore (not public)

## Commands

### Install dependencies

- `yarn`

### Dev Mode Instructions for Physical Mobile Device

Compatible with both MacOS and Windows PC for app compilation. After compilation, app can be run on either iOS or Android phone.

- Install Expo Go mobile app to run the app dev build
  - [iOS](https://apps.apple.com/us/app/expo-go/id982107779)
  - [Android](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en_US&gl=US)
- `yarn start`
  - Run app, scan QR code on physical phone

### Dev Mode Instructions for Android Emulator

Compatible with both MacOS and Windows PC for app compilation.

- Note that Expo Go will be automatically installed on the emulated mobile device for you
- Create an Android Emulator AVD (simulated phone): https://developer.android.com/studio/run/managing-avds
- You need to run the Android Emulator from command line due to a bug with Vulkan
  - More info: https://developer.android.com/studio/run/emulator-troubleshooting#error:-%60vulkan-1.dll
- Command to run Android Emulator:
  - `C:\Users\<username>\AppData\Local\Android\Sdk\emulator\emulator -avd <emulated phone name> -feature -Vulkan`
    - Example: `C:\Users\solde\AppData\Local\Android\Sdk\emulat-or\emulator -avd Pixel_3a_API_34_extension_level_7_x86_64 -feature -Vulkan`
    - Add `-no-snapshot-load` flag to start emulator from "cold boot" (if emulator keeps crashing upon turning on)
- `yarn a` to run the app

### Dev Mode Instructions for iOS Emulator

Needs MacOS for app compilation (to run XCode) / iOS Emulator.

- Note that Expo Go will be automatically installed on the emulated mobile device for you
- Documentation: https://developer.apple.com/documentation/xcode/running-your-app-in-simulator-or-on-a-device
- Should be more straightforwards than Android, you shouldn't need to use command line to open iOS emulator
- `yarn i` to run the app

### WiFi / Tunneling (Dev Mode)

- In general, if running the app on a physical mobile device, the mobile device and the PC compiling the app should be on the same WiFi network
- If on OSU WiFi, or any other WiFi that disables peer-to-peer, use the `--tunnel` argument, e.g:
  - `yarn start --tunnel`
  - `yarn i -tunnel`
  - `yarn a --tunnel`
- Using a mobile hotspot is another potential solution, if the other WiFi networks nearby disable peer-to-peer

### Login Bypass (Dev Mode)

- `yarn test`
  - Bypass login for testing purposes, will log you in as a dummy user "John Doe"
  - If you logged out of app, reload / restart app to automatically log back in as dummy user
  - Optional arguments:
    - `--tunnel`
      - For WiFi tunneling as described above
    - `--ios` or `--android`
      - For running app on iOS or Android emulator
    - Note that arguments can be combined, e.g. `yarn test --android --tunnel`

### Prebuild Instructions for Android (Production Mode)

Compatible with both MacOS and Windows PC for building the project in Android Studio.

- `yarn prebuild`
- `yarn android`
- Steps (to be fleshed out later):
  - Open Android Studio and build APK
  - Load it onto your phone

### Prebuild Instructions for iOS (Production Mode, needs MacOS)

Needs a MacOS for building the project in XCode.

- `yarn prebuild`
- `yarn ios`
- Steps (to be fleshed out later):
  - Open `xcworkspace` in XCode
  - Go to `Product` > `Archive`
  - View archive in folder, open package content
  - Find `.app` file, put in folder `Payload`
  - Zip `Payload` folder and call it `<name>.ipa`
  - Sideload `<name>.ipa` folder with AltStore

### Formatting Script

- `yarn pretty`
  - Runs Prettier + ESLint script to catch any code formatting or linting errors
  - NOTE: This will automatically update any files with the reformatted version; if you just want to check for possible formatting issues, run `yarn pretty:check` (see below)
- `yarn pretty:check`
  - Runs Prettier + ESLint, but only reports formatting / linting issues and does not edit any files yet
  - Run via GitHub Actions in `.github/workflows/main.yml`, so that each PR gets its formatting / linting automatically checked before merge

### App Compilation Troubleshooting

- Hot Reload is enabled by default whenever you edit a page on the app, and you can also manually trigger a reload by entering `r` into command line
- If reloading isn't working for some reason, double swipe up on your mobile device to exit Expo Go, and restart the app from command line

## Last Year's Codebase

A different team of students worked on this projects last year, linked here for reference.

- Last year's codebase (JavaScript): https://github.com/efmmoncada/golf-drill-challenge-app
  - Check this repo's README for other useful tips on software stack
- Last year's codebase (TypeScript): https://github.com/efmmoncada/golf-app-ts
  - We are basing our codebase more on the TypeScript version from last year, but it's lacking a README
