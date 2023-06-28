import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Based on the getting-started on https://react.i18next.com/getting-started
i18n
  .use(initReactI18next)
  .init({
    resources: {
      de: {
        translation: {
          'Create a short URL': 'Kurz-URL erstellen',
          'Advanced options': 'Erweiterte Einstellungen',
          'Recently created URLs': 'Kürzlich erstelle URLs',
          'See all': 'Alle anzeigen',
          'Visits': 'Aufrufe',
          'Short URLs': 'Kurz-URLs',
          'Tags': 'Schlagwörter',
          'Welcome!': 'Willkommen!',
          'Add tags to the URL': 'Schlagwörter hinzufügen',
          'Overview': 'Übersicht',
          'List short URLs': 'Kurz-URLs auflisten',
          'Create short URL': 'Kurz-URL erstellen',
          'Manage tags': 'Schlagwörter verwalten',
          'Manage domains': 'Domain verwalten',
          'Edit this server': 'Server bearbeiten',
          'With tags...': 'Mit Schlagwörtern...',
          'All short URLs': 'Alle Kurz-URLs',
          'There are no visits matching current filter': 'Es gibt keine passenden Aufrufe für die aktuell gesetzten Filter',
          'Visits during time': 'Aufrufe über die Zeit',
          'Operating systems': 'Betriebssysteme',
          'Browsers': 'Browser',
          'Referrers': 'Referer',
          'Referrer name': 'Referer',
          'Visits amount': 'Anzahl Aufrufe',
          'Visited URLs': 'Aufgerufene URLs',
          'Visited URL': 'Aufgerufene URL',
          'Countries': 'Länder',
          'Country name': 'Land',
          'Cities': 'Orte',
          'City name': 'Ort',
          'All visits': 'Alle Aufrufe',
          'URL to be shortened': 'Zu kürzende URL',
          'Custom slug': 'Eigener Kurzlink',
          'Main options': 'Haupt-Einstellungen',
          'Customize the short URL': 'Kurz-Link anpassen',
          'Title': 'Titel',
          'Short code length': 'Länge des Kurz-Links',
          'Limit access to the short URL': 'Aufrufe/Funktion einschränken',
          'Maximum number of visits allowed': 'Maximale Anzahl erlaubter Aufrufe',
          'Enabled since...': 'Aktiv ab/seit...',
          'Enabled until...': 'Aktiv bis...',
          'If checked, Shlink will try to reach the long URL, failing in case it\'s not publicly accessible.': 'Wenn aktiv, wird Shlink versuchen die Lang-URL zu erreichen. Gelingt dies nicht, wird die Kurz-URL nicht veröffentlicht.',
          'Validate URL': 'URL validieren',
          'Use existing URL if found': 'Bestehende Kurz-URL verwenden',
          'Configure behavior': 'Verhalten konfigurieren',
          'This short URL will be included in the robots.txt for your Shlink instance, allowing web crawlers (like Google) to index it.': 'Diese Kurz-URL wird in die robots.txt der Shlink Installation mit aufgenommen. Dies erlaubt Crawlern (wie z. B. Google) diesen Link zu indexieren.',
          'Make it crawlable': 'Indexierbar machen',
          'When this short URL is visited, any query params appended to it will be forwarded to the long URL.': 'URL-Parameter beim Aufruf (der Kurz-URL) an die Weiterleitung (zur Lang-URL) mit anhängen.',
          'Forward query params on redirect': 'URL-Parameter mit weiterleiten',
          'Saving...': 'Wird gespeichert...',
          'Save': 'Speichern',
          'Great!': 'Großartig!',
          'The short URL is': 'Die Kurz-URL lautet',
          'Copy': 'Kopieren',
          'An error occurred while creating the URL :(': '',
          'Visit stats': '',
          'Edit short URL': '',
          'QR code': '',
          'No results found': 'Keine Ergebnisse gefunden',
          'Loading...': 'Lade...',
          'Created at': 'Erstellt am',
          'Short URL': 'Kurze URL',
          'Long URL': 'Lange URL',
          'Something went wrong while loading short URLs :(': 'Beim laden der Kurz-URLs ist etwas schiefgelaufen :(',
          'No tags found': 'Keine Schlagwörter gefunden',
          'Tag': 'Schlagwort',
          'Order by': 'Sortieren nach',
          'Order by...': 'Sortieren nach...',
          'Order by: ': 'Sortieren nach: ',
        },
      },
    },
    lng: 'de',
    fallbackLng: 'en',

    interpolation: {
      escapeValue: false,
    },
  });
