// =============================================================================
// App.js – Eine einfache To-do-Liste mit Expo / React Native
// =============================================================================
//
// Diese Datei ist der Einstiegspunkt der App. Expo lädt sie automatisch und
// zeigt die Komponente an, die hier mit "export default" exportiert wird.
//
// Was die App kann:
//   1. Aufgaben hinzufügen (Text eintippen, auf "Hinzufügen" tippen)
//   2. Aufgaben abhaken (auf die Aufgabe tippen – sie wird durchgestrichen)
//   3. Aufgaben löschen (auf das rote "✕" tippen)
//
// Wir verwenden ausschließlich Bausteine, die direkt in "react-native" und
// "expo-status-bar" enthalten sind. Dadurch läuft die App ohne Zusatzmodule
// in Expo Go (auf dem Handy) und in Expo Snack (im Browser).
// =============================================================================

// -----------------------------------------------------------------------------
// 1. Importe
// -----------------------------------------------------------------------------
// "import" holt Code aus anderen Paketen in diese Datei.

// useState ist ein sogenannter "Hook" von React. Damit kann sich eine
// Komponente Werte merken (den "Zustand", englisch "state"). Ändert sich der
// Zustand, zeichnet React die Oberfläche automatisch neu.
import { useState } from 'react';

// Das sind die fertigen Bausteine (Komponenten) von React Native:
//   - View:               ein Container, vergleichbar mit einem <div> im Web
//   - Text:               zeigt Text an (Text MUSS immer in <Text> stehen)
//   - TextInput:          ein Eingabefeld für Text
//   - Pressable:          macht beliebige Inhalte "antippbar" (wie ein Button)
//   - FlatList:           zeigt eine (auch lange) Liste effizient an
//   - StyleSheet:         hilft beim Definieren von Stilen (Farben, Abstände …)
//   - KeyboardAvoidingView: schiebt den Inhalt nach oben, wenn die Tastatur
//                         erscheint, damit das Eingabefeld sichtbar bleibt
//   - Platform:           verrät uns, ob wir auf iOS, Android oder im Web sind
//   - StatusBar (als RNStatusBar umbenannt): liefert uns auf Android die Höhe
//                         der Statusleiste, damit unser Inhalt nicht darunter
//                         verschwindet
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  StatusBar as RNStatusBar,
} from 'react-native';

// Die StatusBar ist die Leiste ganz oben mit Uhrzeit, Akku usw.
// Mit dieser Komponente legen wir fest, wie sie aussieht.
import { StatusBar } from 'expo-status-bar';

// -----------------------------------------------------------------------------
// 2. Die Haupt-Komponente "App"
// -----------------------------------------------------------------------------
// Eine Komponente ist in React einfach eine Funktion, die beschreibt, was auf
// dem Bildschirm zu sehen sein soll. Sie gibt dafür sogenanntes JSX zurück –
// das sieht aus wie HTML, ist aber JavaScript.
export default function App() {
  // ---------------------------------------------------------------------------
  // 2a. Zustand (State)
  // ---------------------------------------------------------------------------
  // useState liefert immer zwei Dinge zurück:
  //   - den aktuellen Wert (z. B. "aufgaben")
  //   - eine Funktion, um diesen Wert zu ändern (z. B. "setAufgaben")
  // Der Wert in den Klammern ist der Startwert.

  // Die Liste aller Aufgaben. Jede Aufgabe ist ein Objekt mit:
  //   id:       eine eindeutige Kennung (braucht FlatList, um Einträge
  //             auseinanderzuhalten)
  //   text:     der Text der Aufgabe
  //   erledigt: true = abgehakt, false = noch offen
  // Wir starten mit zwei Beispiel-Aufgaben, damit man gleich etwas sieht.
  const [aufgaben, setAufgaben] = useState([
    { id: '1', text: 'Expo Go auf dem Handy installieren', erledigt: true },
    { id: '2', text: 'Meine erste Aufgabe hinzufügen', erledigt: false },
  ]);

  // Der Text, der gerade im Eingabefeld steht. Am Anfang ist er leer.
  const [neuerText, setNeuerText] = useState('');

  // ---------------------------------------------------------------------------
  // 2b. Funktionen, die den Zustand ändern
  // ---------------------------------------------------------------------------
  // WICHTIG für Anfänger: In React verändert man den Zustand niemals direkt
  // (also z. B. NICHT aufgaben.push(...)). Stattdessen erzeugt man immer eine
  // NEUE Liste und übergibt sie an setAufgaben. Nur so merkt React, dass sich
  // etwas geändert hat, und zeichnet die Oberfläche neu.

  // Fügt eine neue Aufgabe hinzu.
  function aufgabeHinzufuegen() {
    // .trim() entfernt Leerzeichen am Anfang und Ende.
    // So verhindern wir, dass jemand eine "leere" Aufgabe aus Leerzeichen anlegt.
    const text = neuerText.trim();

    // Ist nach dem Trimmen nichts übrig, brechen wir einfach ab.
    if (text === '') {
      return;
    }

    // Die neue Aufgabe als Objekt.
    // Date.now() liefert die aktuelle Zeit in Millisekunden – das ist eine
    // einfache Möglichkeit, eine eindeutige ID zu erzeugen.
    // Math.random() hängen wir an, falls zweimal in derselben Millisekunde
    // eine Aufgabe angelegt wird.
    const neueAufgabe = {
      id: Date.now().toString() + Math.random().toString(),
      text: text,
      erledigt: false,
    };

    // Neue Liste = alle bisherigen Aufgaben + die neue Aufgabe am Ende.
    // Die drei Punkte "..." nennt man "Spread-Operator": Sie kopieren alle
    // Elemente der alten Liste in die neue Liste.
    // Wir übergeben hier eine Funktion (vorherige => ...). React ruft sie mit
    // dem garantiert aktuellen Stand der Liste auf – das ist die sichere Art,
    // einen neuen Zustand aus dem alten zu berechnen.
    setAufgaben((vorherige) => [...vorherige, neueAufgabe]);

    // Eingabefeld wieder leeren, damit man gleich die nächste Aufgabe tippen kann.
    setNeuerText('');
  }

  // Hakt eine Aufgabe ab – oder entfernt den Haken wieder (umschalten).
  // "id" sagt uns, welche Aufgabe gemeint ist.
  function aufgabeUmschalten(id) {
    setAufgaben((vorherige) =>
      // .map() geht jede Aufgabe durch und erzeugt daraus eine neue Liste.
      vorherige.map((aufgabe) =>
        aufgabe.id === id
          ? // Das ist die gesuchte Aufgabe: Wir kopieren sie (...aufgabe) und
            // drehen "erledigt" um (aus true wird false und umgekehrt).
            { ...aufgabe, erledigt: !aufgabe.erledigt }
          : // Alle anderen Aufgaben bleiben unverändert.
            aufgabe
      )
    );
  }

  // Löscht eine Aufgabe.
  function aufgabeLoeschen(id) {
    setAufgaben((vorherige) =>
      // .filter() behält nur die Aufgaben, für die die Bedingung "true" ergibt.
      // Hier: alle Aufgaben, deren id NICHT die zu löschende id ist.
      vorherige.filter((aufgabe) => aufgabe.id !== id)
    );
  }

  // Kleine Statistik für die Überschrift: Wie viele Aufgaben sind noch offen?
  const anzahlOffen = aufgaben.filter((aufgabe) => !aufgabe.erledigt).length;

  // ---------------------------------------------------------------------------
  // 2c. Wie eine einzelne Aufgabe in der Liste aussieht
  // ---------------------------------------------------------------------------
  // FlatList ruft diese Funktion für jeden Eintrag der Liste auf.
  // Sie bekommt ein Objekt, aus dem wir mit { item } den Eintrag herausholen
  // (das nennt man "Destrukturierung").
  function renderAufgabe({ item }) {
    return (
      <View style={styles.aufgabeZeile}>
        {/* Linker Teil: Checkbox + Text. Antippen schaltet "erledigt" um. */}
        <Pressable
          style={styles.aufgabeInhalt}
          onPress={() => aufgabeUmschalten(item.id)}
          // Hilfreiche Angaben für Screenreader (Barrierefreiheit).
          accessibilityRole="checkbox"
          accessibilityState={{ checked: item.erledigt }}
        >
          {/* Die "Checkbox" ist einfach ein kleines Quadrat (View).
              Ist die Aufgabe erledigt, bekommt es zusätzlich den Stil
              "checkboxErledigt" und zeigt ein Häkchen. */}
          <View
            style={[styles.checkbox, item.erledigt && styles.checkboxErledigt]}
          >
            {item.erledigt && <Text style={styles.haekchen}>✓</Text>}
          </View>

          {/* Der Aufgabentext. Erledigte Aufgaben werden grau und
              durchgestrichen dargestellt.
              Ein Array von Stilen [a, b] kombiniert mehrere Stile.
              "item.erledigt && styles.textErledigt" bedeutet: Nur wenn
              erledigt true ist, wird der zweite Stil verwendet. */}
          <Text
            style={[styles.aufgabeText, item.erledigt && styles.textErledigt]}
          >
            {item.text}
          </Text>
        </Pressable>

        {/* Rechter Teil: Löschen-Knopf */}
        <Pressable
          style={styles.loeschenKnopf}
          onPress={() => aufgabeLoeschen(item.id)}
          // hitSlop vergrößert die antippbare Fläche, ohne dass der Knopf
          // größer aussieht – praktisch für kleine Knöpfe.
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel={`Aufgabe "${item.text}" löschen`}
        >
          <Text style={styles.loeschenText}>✕</Text>
        </Pressable>
      </View>
    );
  }

  // ---------------------------------------------------------------------------
  // 2d. Die eigentliche Oberfläche (JSX)
  // ---------------------------------------------------------------------------
  // Alles, was hier zurückgegeben wird, erscheint auf dem Bildschirm.
  // Kommentare innerhalb von JSX schreibt man in geschweiften Klammern: {/* … */}
  return (
    <View style={styles.container}>
      {/* Statusleiste mit dunkler Schrift (passt zum hellen Hintergrund). */}
      <StatusBar style="dark" />

      {/* KeyboardAvoidingView sorgt dafür, dass die Tastatur das
          Eingabefeld nicht verdeckt. iOS und Android verhalten sich hier
          unterschiedlich, deshalb wählen wir das Verhalten je nach Plattform. */}
      <KeyboardAvoidingView
        style={styles.inhalt}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* ----- Überschrift ----- */}
        <Text style={styles.titel}>Meine To-dos</Text>
        <Text style={styles.untertitel}>
          {anzahlOffen === 0
            ? 'Alles erledigt! 🎉'
            : `${anzahlOffen} ${anzahlOffen === 1 ? 'Aufgabe' : 'Aufgaben'} offen`}
        </Text>

        {/* ----- Eingabebereich ----- */}
        <View style={styles.eingabeZeile}>
          <TextInput
            style={styles.eingabe}
            placeholder="Neue Aufgabe …"
            // "value" + "onChangeText" verbinden das Eingabefeld mit dem
            // Zustand "neuerText". Das nennt man ein "kontrolliertes" Feld:
            // Bei jedem Tastendruck wird setNeuerText mit dem neuen Text
            // aufgerufen.
            value={neuerText}
            onChangeText={setNeuerText}
            // Wird auf der Tastatur "Enter"/"Fertig" gedrückt, fügen wir die
            // Aufgabe ebenfalls hinzu.
            onSubmitEditing={aufgabeHinzufuegen}
            returnKeyType="done"
            // Die Tastatur bleibt nach dem Hinzufügen offen, damit man
            // direkt weitertippen kann.
            submitBehavior="submit"
          />
          <Pressable
            // "style" kann auch eine Funktion sein: { pressed } ist true,
            // solange der Finger auf dem Knopf liegt. So geben wir
            // optisches Feedback beim Tippen.
            style={({ pressed }) => [
              styles.hinzufuegenKnopf,
              pressed && styles.knopfGedrueckt,
            ]}
            onPress={aufgabeHinzufuegen}
            accessibilityRole="button"
          >
            <Text style={styles.hinzufuegenText}>Hinzufügen</Text>
          </Pressable>
        </View>

        {/* ----- Die Liste der Aufgaben ----- */}
        <FlatList
          // Die Daten, die angezeigt werden sollen.
          data={aufgaben}
          // Woran FlatList jeden Eintrag eindeutig erkennt.
          keyExtractor={(item) => item.id}
          // Wie jeder Eintrag aussieht (siehe Funktion oben).
          renderItem={renderAufgabe}
          // Was angezeigt wird, wenn die Liste leer ist.
          ListEmptyComponent={
            <Text style={styles.leerText}>
              Noch keine Aufgaben. Tippe oben eine ein!
            </Text>
          }
          // Erlaubt das Antippen der Liste, auch wenn die Tastatur offen ist.
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.listeInhalt}
        />
      </KeyboardAvoidingView>
    </View>
  );
}

// -----------------------------------------------------------------------------
// 3. Stile (Aussehen)
// -----------------------------------------------------------------------------
// In React Native schreibt man Stile ähnlich wie CSS, aber:
//   - als JavaScript-Objekt
//   - Eigenschaften in "camelCase" (z. B. backgroundColor statt background-color)
//   - Zahlen ohne "px" (die Einheit ist automatisch geräteunabhängig)
// Layouts werden mit "Flexbox" gebaut. Standardrichtung ist "column", also
// von oben nach unten. Mit flexDirection: 'row' ordnet man Dinge nebeneinander an.
const styles = StyleSheet.create({
  // Der äußerste Container: füllt den ganzen Bildschirm (flex: 1).
  container: {
    flex: 1,
    backgroundColor: '#f4f6fb',
  },
  // Innerer Bereich mit Abstand zum Rand.
  inhalt: {
    flex: 1,
    paddingHorizontal: 20,
    // Abstand nach oben, damit nichts unter der Statusleiste bzw. der
    // "Notch" (Kamera-Aussparung) beim iPhone verschwindet:
    //   - Android: Höhe der Statusleiste + etwas Luft
    //   - iOS:     fester Wert, der für iPhones mit Notch passt
    //   - Web:     kleiner Abstand reicht
    paddingTop: Platform.select({
      android: (RNStatusBar.currentHeight ?? 24) + 16,
      ios: 60,
      default: 24,
    }),
  },
  titel: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  untertitel: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 4,
    marginBottom: 20,
  },
  // Eingabefeld und Knopf nebeneinander.
  eingabeZeile: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  eingabe: {
    flex: 1, // nimmt den restlichen Platz neben dem Knopf ein
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginRight: 10,
  },
  hinzufuegenKnopf: {
    backgroundColor: '#4f46e5',
    borderRadius: 10,
    paddingHorizontal: 16,
    justifyContent: 'center', // Text vertikal mittig
  },
  knopfGedrueckt: {
    opacity: 0.7, // etwas durchsichtig, solange gedrückt
  },
  hinzufuegenText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  listeInhalt: {
    paddingBottom: 40,
  },
  // Eine Zeile in der Liste: Inhalt links, Löschen-Knopf rechts.
  aufgabeZeile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 10,
    // Leichter Schatten (shadow* für iOS/Web, elevation für Android).
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  aufgabeInhalt: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#4f46e5',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxErledigt: {
    backgroundColor: '#4f46e5',
  },
  haekchen: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  aufgabeText: {
    flex: 1, // langer Text bricht um, statt den Löschen-Knopf zu verdrängen
    fontSize: 16,
    color: '#1f2937',
  },
  textErledigt: {
    color: '#9ca3af',
    textDecorationLine: 'line-through', // durchgestrichen
  },
  loeschenKnopf: {
    marginLeft: 12,
    paddingHorizontal: 6,
  },
  loeschenText: {
    fontSize: 18,
    color: '#ef4444',
    fontWeight: 'bold',
  },
  leerText: {
    textAlign: 'center',
    color: '#9ca3af',
    marginTop: 40,
    fontSize: 16,
  },
});
