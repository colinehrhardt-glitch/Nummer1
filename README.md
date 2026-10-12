# Nummer1 – To-do-Liste mit Expo

Eine einfache To-do-App mit Expo (SDK 57) und React Native:
Aufgaben hinzufügen, abhaken und löschen.

Es werden nur `react-native` und `expo-status-bar` verwendet – die App läuft
daher direkt in **Expo Go** (Handy) und **Expo Snack** (Browser).

## Starten

```bash
npm install
npx expo start
```

Dann den QR-Code mit der Expo-Go-App scannen.

## Dateien

- `App.js` – die komplette App (ausführlich kommentiert)
- `app.json` – Expo-Einstellungen (Name, Ausrichtung …)
- `package.json` – Abhängigkeiten und Start-Befehle

Hinweis: Die Aufgaben werden nur im Arbeitsspeicher gehalten und sind nach
einem Neustart der App wieder weg.
