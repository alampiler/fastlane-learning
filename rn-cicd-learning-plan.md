# Навчальний план: CI/CD для React Native (~12 годин)

2026-09-17 · Вадим Вознюк

## Мета і підготовка

За 6 сесій по 2 години побудувати реальний CI/CD для RN-проєкту без платних акаунтів. Кожна сесія дає робочий результат і історію для співбесіди.

```mermaid
flowchart LR
  A[PR: lint, tsc, jest] --> B[Merge в main]
  B --> C[Android: signed AAB/APK]
  B --> D[iOS: simulator build]
  C --> E[Fastlane beta]
  E --> F[Firebase App Distribution]
  C --> G[Maestro E2E]
```

**Підготовка (15 хв):**

- [ ] Створити **публічний** репозиторій на GitHub: стандартні раннери, включно з macOS, для публічних репо безкоштовні
- [ ] Взяти AI Collection Manager або свіжий `npx @react-native-community/cli init`
- [ ] Expo managed → `npx expo prebuild`, щоб з'явились `android/` та `ios/`
- [ ] Завести файл `STORIES.md` для запису кожної поломки

## Сесія 1. PR-пайплайн (2 год)

Результат: PR неможливо змерджити без зелених перевірок.

- [ ] `.github/workflows/pr.yml`: тригер `pull_request`, `actions/setup-node` з `cache: 'yarn'`, кроки lint → `tsc --noEmit` → `jest`
- [ ] Branch protection на `main`: мердж лише з зеленим CI
- [ ] PR з навмисною TS-помилкою, переконатись, що він червоніє
- [ ] `concurrency` з `cancel-in-progress: true`

**Розумієш після:** тригери, jobs/steps, кеш за lock-файлом, навіщо concurrency.

## Сесія 2. Android signing і release-білд (2 год)

Результат: підписані AAB і APK лежать в artifacts після кожного push у `main`.

- [ ] Згенерувати keystore через `keytool`
- [ ] `base64 -i release.keystore` → GitHub Secrets разом з паролями
- [ ] `signingConfigs.release` у `build.gradle`, значення з env або gradle properties
- [ ] Workflow: декодування keystore → `./gradlew bundleRelease assembleRelease` → `actions/upload-artifact`
- [ ] Кеш Gradle через `gradle/actions/setup-gradle`, записати час білда до і після

**Розумієш після:** upload key проти app signing key (Play App Signing), чому keystore не комітять, AAB проти APK. Цифри «до/після кешу» ідуть у `STORIES.md`.

## Сесія 3. Fastlane + Firebase App Distribution (2 год)

Результат: після мерджу нова збірка сама приходить тобі на пошту як тестувальнику.

- [ ] `Gemfile` з fastlane, запуск через `bundle exec`
- [ ] `fastlane/Fastfile`, lane `android beta`: `gradle(task: "assemble", build_type: "Release")` → `firebase_app_distribution`
- [ ] Проєкт у Firebase (безкоштовно), service account JSON у secrets
- [ ] `versionCode` з `GITHUB_RUN_NUMBER`
- [ ] Workflow викликає лише `bundle exec fastlane android beta`

**Розумієш після:** навіщо Fastlane поверх голого CI (логіка в lanes, однаково локально і на CI), автоінкремент версій.

## Сесія 4. Оточення dev/prod (2 год)

Результат: на телефоні одночасно стоять dev і prod версії апки.

- [ ] Android: `productFlavors` dev і prod з різними `applicationIdSuffix` та назвами
- [ ] `react-native-config`: `.env.dev`, `.env.prod`; на CI `.env` генерується з secrets, в репо лише `.env.example`
- [ ] iOS: окрема scheme і build configuration для dev (один раз руками)
- [ ] Lanes `beta_dev` і `beta_prod`

**Розумієш після:** flavors проти schemes/configurations, як секрети потрапляють у білд і чому секрет у JS-бандлі насправді не секрет.

## Сесія 5. iOS на CI без $99 (2 год)

Результат: зелений iOS-білд під симулятор і схема signing, яку пояснюєш за 2 хвилини без підглядання.

- [ ] Job на `macos-latest`, пінінг Xcode через `maxim-lobanov/setup-xcode`
- [ ] Кеш `ios/Pods` за ключем `Podfile.lock`, `bundle exec pod install`
- [ ] `xcodebuild -workspace ... -scheme ... -sdk iphonesimulator -configuration Release CODE_SIGNING_ALLOWED=NO`
- [ ] Запуск лише на push у `main` (macOS-хвилини в приватних репо множаться на 10)
- [ ] Теорія, 40 хв: документація `fastlane match` і App Store Connect API key

Потік signing на CI, який треба вміти розповісти:

```mermaid
flowchart LR
  A[Приватне git-репо<br/>certs + profiles] --> B[match розшифровує<br/>MATCH_PASSWORD]
  B --> C[setup_ci<br/>тимчасовий keychain]
  C --> D[build_app]
  D --> E[upload_to_testflight<br/>API key .p8]
```

**Розумієш після:** чому macOS-хвилини дорогі, чому Xcode пінять, чому API key кращий за Apple ID (2FA), як працює match.

## Сесія 6. OTA, E2E, фіналізація (2 год)

Результат: E2E-тест у CI і README, який працює як доказ на співбесіді.

- [ ] **Maestro, 45 хв:** один flow (відкрити апку → натиснути кнопку → перевірити текст), локально, потім у CI на Android-емуляторі (`reactivecircus/android-emulator-runner`)
- [ ] **OTA, 30 хв, теорія:** App Center закрито; альтернативи EAS Update і self-hosted CodePush; `runtimeVersion` і правило «нативна зміна = стор-реліз»
- [ ] **README, 45 хв:** діаграма пайплайна + розділ «Проблеми, які я вирішив» з `STORIES.md`

Якщо часу нема, сесію можна скоротити до теорії OTA і README.

## Результат і підготовка до співбесіди

Після 12 годин: публічне репо з 3 workflows (PR, Android beta, iOS build), Fastfile і 4–5 реальних історій про поломки.

**Пріоритети:** сесії 1–3 обов'язкові, 4–5 дуже бажані, 6 можна скоротити.

**Формат історії в `STORIES.md`:** що зламалось → як знайшов причину → що зробив → цифри.

**Питання, які реально ставлять:**

| Питання | Де закриваєш |
| --- | --- |
| Як влаштовано iOS signing на CI і навіщо match? | Сесія 5 |
| Як безпечно зберігати keystore і секрети? | Сесії 2, 4 |
| Що робити, якщо втратили Android-ключ? | Сесія 2 |
| Як прискорити білд? | Сесії 1, 2, 5 |
| Коли OTA, а коли стор-реліз? | Сесія 6 |
| Як ведете версіонування? | Сесія 3 |
| Як організувати dev/staging/prod? | Сесія 4 |
| EAS, Bitrise чи GitHub Actions: які trade-offs? | Сесії 3, 5 |

**Як економити час:**

- Не вилизуй YAML: працює, то далі.
- Застряг довше 30 хв → скидай лог і розбирай з Claude.

**Формулювання на співбесіді:** «У комерційних проєктах працював з готовим CI, свій пайплайн налаштував з нуля, ось репо».
