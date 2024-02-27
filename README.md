# Golf-App

Cross Platform Mobile app for the OSU Men's Golf Team.

## Commands

### Install dependencies

- `yarn`

### Running App on a Physical Mobile Device

- Install Expo Go mobile app to run the app dev build
  - [iOS](https://apps.apple.com/us/app/expo-go/id982107779)
  - [Android](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en_US&gl=US)
- `yarn start`
  - If on OSU school wifi (or any other wifi that doesn't support peer-to-peer), use `yarn start --tunnel`
  - Run app, scan QR code on physical phone

### Running App on Android Emulator (Windows PC or MacOS)

- Note that Expo Go will be automatically installed on the emulated mobile device for you
- Create an Android Emulator AVD (simulated phone): https://developer.android.com/studio/run/managing-avds
- You need to run the Android Emulator from command line due to a bug with Vulkan
  - More info: https://developer.android.com/studio/run/emulator-troubleshooting#error:-%60vulkan-1.dll
- Command to run Android Emulator:
  - `C:\Users\<username>\AppData\Local\Android\Sdk\emulator\emulator -avd <emulated phone name> -feature -Vulkan`
    - Example: `C:\Users\solde\AppData\Local\Android\Sdk\emulator\emulator -avd Pixel_3a_API_34_extension_level_7_x86_64 -feature -Vulkan`
- `yarn android` to run the app
  - If on OSU school wifi (or any other wifi that doesn't support peer-to-peer), use `yarn android --tunnel`

### Running App in iOS Emulator (MacOS)

- Note that Expo Go will be automatically installed on the emulated mobile device for you
- Documentation: https://developer.apple.com/documentation/xcode/running-your-app-in-simulator-or-on-a-device
- Should be more straightforwards than Android, you shouldn't need to use command line to open iOS emulator
- `yarn ios` to run the app
  - If on OSU school wifi (or any other wifi that doesn't support peer-to-peer), use `yarn ios --tunnel`

### Formatting Script

- `yarn pretty`
  - Run Prettier script to reformat code (standardize indents etc)

### App Compilation Troubleshooting

- Hot Reload is enabled by default whenever you edit a page on the app, and you can also manually trigger a reload by entering "r" into command line
- If reloading isn't working for some reason, double swipe up on your mobile device to exit Expo Go, and restart the app from command line

## Tech Stack

- [React Native](https://reactnative.dev/)
- [Expo Go](https://expo.dev/)
- [Axios](https://axios-http.com/)
- [Prettier](https://prettier.io/)

## Other Useful Stuff

- Last year's codebase (JavaScript): https://github.com/efmmoncada/golf-drill-challenge-app
  - Check this repo's README for other useful tips on software stack
- Last year's codebase (TypeScript): https://github.com/efmmoncada/golf-app-ts
  - We are basing our codebase more on the TypeScript version from last year, but it's lacking a README
