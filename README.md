# Golf-App

Cross Platform Mobile app for the OSU Men's Golf Team.

## Commands

### Install dependencies

- `npm i`

### Running App on a Physical Mobile Device

- Install Expo Go mobile app to run the app dev build
  - [iOS](https://apps.apple.com/us/app/expo-go/id982107779)
  - [Android](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en_US&gl=US)
- `npm run start`
  - Run app, scan QR code on physical phone

### Running App on Android Emulator (on Windows PC)

- Note that Expo Go will be automatically installed on the emulated mobile device for you
- Create an Android Emulator AVD (simulated phone): https://developer.android.com/studio/run/managing-avds
- You need to run the Android Emulator from command line due to a bug with Vulkan
  - More info: https://developer.android.com/studio/run/emulator-troubleshooting#error:-%60vulkan-1.dll
- Command to run Android Emulator:
  - `C:\Users\<username>\AppData\Local\Android\Sdk\emulator\emulator -avd <emulated phone name> -feature -Vulkan`
    - Example: `C:\Users\solde\AppData\Local\Android\Sdk\emulator\emulator -avd Pixel_3a_API_34_extension_level_7_x86_64 -feature -Vulkan`
- `npm run android` to run the app

### Running App in iOS Emulator (on MacOS PC)

- Note that Expo Go will be automatically installed on the emulated mobile device for you
- Documentation: https://developer.apple.com/documentation/xcode/running-your-app-in-simulator-or-on-a-device
- Should be more straightforwards than Android, you shouldn't need to use command line to open iOS emulator
- `npm run ios` to run the app

### Run App as a Website

- `npm run starttunnel`
  - Go to http://localhost:19000 (default option) in browser
  - Styling may be a little wonky vs on phone, but might help for some CSS debugging with Inspect Element
  - Probably a better option for opening the app as a webpage in PC browser, due to [tunnelling](https://docs.expo.dev/more/expo-cli/?redirected#tunneling)

### Formatting Script

- `npm run format`
  - Run Prettier script to reformat code (standardize indents etc)

## Tech Stack

- [React Native](https://reactnative.dev/)
- [Expo Go](https://expo.dev/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Axios](https://axios-http.com/)
- [Prettier](https://prettier.io/)

## Other Useful Stuff

- Last year's codebase (JavaScript): https://github.com/efmmoncada/golf-drill-challenge-app
  - Check this repo's README for other useful tips on software stack
- Last year's codebase (TypeScript): https://github.com/efmmoncada/golf-app-ts
  - We are basing our codebase more on the TypeScript version from last year, but it's lacking a README
