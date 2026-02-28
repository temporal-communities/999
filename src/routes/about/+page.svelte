<script lang="ts">
  import Header from "$lib/components/Header.svelte"
  import HamburgerMenu from "$lib/components/HamburgerMenu.svelte"
  import crossIcon from "$lib/assets/cross-circled.svg"
  import { locale } from "$lib/stores/locale"
  import { resolve } from "$app/paths"
</script>

<Header>
  <HamburgerMenu showSourceToggle={false} />
  <a class="absolute top-6 right-6 z-50" href={resolve("/")} aria-label={$locale === "de" ? "Zurück zur Startseite" : "Back to main page"}>
    <img src={crossIcon} alt={$locale === "de" ? "Zurück zur Startseite" : "Back to main page"} class="h-[3.2rem] w-[3.2rem]" />
  </a>

  <article class="p-8 text-left text-lg">
    {#if $locale !== "de"}
      <div lang="en">
        <h1>Credits</h1>
        <p>The “999” Drama Automaton app was developed by:</p>
        <ul>
          <li>Viktor J. Illmer (<a href="https://orcid.org/0000-0002-7334-781X">ORCID</a>)</li>
          <li>Mark Schwindt (<a href="https://orcid.org/0000-0002-4337-2467">ORCID</a>)</li>
          <li>Nele Heindorf (<a href="https://orcid.org/0009-0005-9680-3995">ORCID</a>)</li>
          <li>Jonas Rohe (<a href="https://orcid.org/0009-0002-8541-8520">ORCID</a>)</li>
          <li>Dîlan Canan Çakir (<a href="https://orcid.org/0009-0001-0013-7205">ORCID</a>)</li>
          <li>Roya Zendebudie (<a href="https://orcid.org/0009-0007-3650-5907">ORCID</a>)</li>
          <li>Frank Fischer (<a href="https://orcid.org/0000-0003-2419-6629">ORCID</a>)</li>
        </ul>

        <h2>How to Cite</h2>
        <ul>
          <li>
            Viktor J. Illmer, Frank Fischer, Mark Schwindt, Jonas Rohe:
            <strong
              >»999 und noch etliche [mehr]«. Georg Nikolaus Bärmanns »Würfel-Almanach« von 1829 als
              Web-App.</strong
            >
            In: DHd2025: »Under Construction«. 3–7 March 2025. Book of Abstracts. Bielefeld University.
            (<a href="https://doi.org/10.5281/zenodo.14943242">doi:10.5281/zenodo.14943242</a>)
            &lcub;ger&rcub;
          </li>
          <li>
            Viktor J. Illmer, Dîlan Canan Çakir, Frank Fischer, Mark Schwindt, Jonas Rohe:
            <strong
              >More Plays than Atoms in the Universe: The Digitization of a 19th-Century Generator
              for One-Act Comedies.</strong
            >
            In: IEEE Transactions on Games. 2025. (<a href="https://doi.org/10.1109/TG.2025.3608847"
              >doi:10.1109/TG.2025.3608847</a
            >) &lcub;eng&rcub;
          </li>
          <li>
            Viktor J. Illmer, Nele Heindorf, Roya Zendebudie, Mark Schwindt, Frank Fischer:
            <strong>Generating TEI Documents Through a Game of Dice.</strong> In: TEI2025: »New
            Territories«. 16–19 September 2025. Kraków. Book of Abstracts, pp.&nbsp;109–110. (<a
              href="https://doi.org/10.5281/zenodo.17312233">doi:10.5281/zenodo.17312233</a
            >) &lcub;eng&rcub;
          </li>
        </ul>

        <h2>How to Use</h2>
        <ol type="1">
          <li>
              Begin by taking a look at the
              <a
                href="https://de.wikisource.org/wiki/Neunhundert_neun_und_neunzig_und_noch_etliche_Almanachs-Lustspiele_durch_den_W%C3%BCrfel"
                >original 1829 book</a
              >
              and the associated
              <a
                href="https://commons.wikimedia.org/wiki/File:Simplicius_Wurftabelle_999_Lustspiele.pdf"
                >dice table</a
              >
              to understand what the app sets out to do.
          </li>
          <li>
              In the app, you can click on the large dice at the top. This rolls one of six variants
              for each of the 200 different scenes. This is the simplest way to generate one of the
              6<sup>200</sup> possible variants of the play.
          </li>
          <li>
              The main path highlighted in the centre of the screen represents the randomly
              generated trajectory through the play. Each of the 200 scenes can be shifted left and
              right to view all variants available for that scene.
          </li>
          <li>
              Any combination of scenes that constitutes a complete play can be shared via a unique
              link (Share button at the bottom right).
          </li>
          <li>
              Any combination of scenes can be saved in the
              <a href="https://en.wikipedia.org/wiki/Text_Encoding_Initiative">TEI format</a> (Download
              button at the bottom right).
          </li>
          <li>
              The English translation was produced with the assistance of ChatGPT (GPT-4o) and
              subsequently checked manually. The translation does not aim to be perfect; several
              historical allusions and wordplays are difficult to render. The main goal was to
              enable non-German-speaking users to make meaningful use of the app.
          </li>
        </ol>

        <h2>Acknowledgement</h2>
        <p>
          Funded by the Deutsche Forschungsgemeinschaft (DFG, German Research Foundation) under
          Germany’s Excellence Strategy in the context of the Cluster of Excellence Temporal
          Communities: Doing Literature in a Global Perspective – EXC 2020 – Project ID 390608380.
        </p>
      </div>
    {:else}
      <div lang="de">
        <h1>Credits</h1>
        <p>Die App “999” (Dramenautomat) wurde entwickelt von:</p>
        <ul>
          <li>Viktor J. Illmer (<a href="https://orcid.org/0000-0002-7334-781X">ORCID</a>)</li>
          <li>Mark Schwindt (<a href="https://orcid.org/0000-0002-4337-2467">ORCID</a>)</li>
          <li>Nele Heindorf (<a href="https://orcid.org/0009-0005-9680-3995">ORCID</a>)</li>
          <li>Jonas Rohe (<a href="https://orcid.org/0009-0002-8541-8520">ORCID</a>)</li>
          <li>Dîlan Canan Çakir (<a href="https://orcid.org/0009-0001-0013-7205">ORCID</a>)</li>
          <li>Roya Zendebudie (<a href="https://orcid.org/0009-0007-3650-5907">ORCID</a>)</li>
          <li>Frank Fischer (<a href="https://orcid.org/0000-0003-2419-6629">ORCID</a>)</li>
        </ul>

        <h2>Zitationsempfehlungen</h2>
        <ul>
          <li>
            Viktor J. Illmer, Frank Fischer, Mark Schwindt, Jonas Rohe:
            <strong
              >»999 und noch etliche [mehr]«. Georg Nikolaus Bärmanns »Würfel-Almanach« von 1829 als
              Web-App.</strong
            >
            In: DHd2025: »Under Construction«. 3.–7. März 2025. Book of Abstracts. Universität Bielefeld.
            (<a href="https://doi.org/10.5281/zenodo.14943242">doi:10.5281/zenodo.14943242</a>)
            &lcub;ger&rcub;
          </li>
          <li>
            Viktor J. Illmer, Dîlan Canan Çakir, Frank Fischer, Mark Schwindt, Jonas Rohe:
            <strong
              >More Plays than Atoms in the Universe: The Digitization of a 19th-Century Generator
              for One-Act Comedies.</strong
            >
            In: IEEE Transactions on Games. 2025. (<a href="https://doi.org/10.1109/TG.2025.3608847"
              >doi:10.1109/TG.2025.3608847</a
            >) &lcub;eng&rcub;
          </li>
          <li>
            Viktor J. Illmer, Nele Heindorf, Roya Zendebudie, Mark Schwindt, Frank Fischer:
            <strong>Generating TEI Documents Through a Game of Dice.</strong> In: TEI2025: »New
            Territories«. 16.–19. September 2025. Krakau. Book of Abstracts, S.&nbsp;109–110. (<a
              href="https://doi.org/10.5281/zenodo.17312233">doi:10.5281/zenodo.17312233</a
            >) &lcub;eng&rcub;
          </li>
        </ul>

        <h2>Kurzanleitung</h2>
        <ol type="1">
          <li>
            Wirf zunächst einen Blick auf das
            <a
              href="https://de.wikisource.org/wiki/Neunhundert_neun_und_neunzig_und_noch_etliche_Almanachs-Lustspiele_durch_den_W%C3%BCrfel"
              >Originalbuch von 1829</a
            >
            sowie die zugehörige
            <a
              href="https://commons.wikimedia.org/wiki/File:Simplicius_Wurftabelle_999_Lustspiele.pdf"
              >Wurftabelle</a
            >
            um zu erfahren, worum es in der App geht.
          </li>
          <li>
            In der App kannst du auf den großen Würfel ganz oben klicken; dadurch wird für jede der
            200 Szenen eine von sechs Varianten ausgewürfelt. Das ist der einfachste Weg, um eine
            der 6<sup>200</sup> möglichen Fassungen des Dramas zu erzeugen.
          </li>
          <li>
            Der hervorgehobene Hauptstrang in der Mitte zeigt den zufällig erzeugten Pfad durch das
            Drama. Jede der 200 Szenen kann nach links und rechts verschoben werden, um alle
            Varianten dieser Szene einzusehen.
          </li>
          <li>
            Jede Kombination von Szenen kann durch einen eindeutigen Link geteilt werden
            (Share-Button rechts unten).
          </li>
          <li>
            Jede Szenenkombination kann zudem im
            <a href="https://en.wikipedia.org/wiki/Text_Encoding_Initiative">TEI-Format</a> gespeichert
            werden. (Download-Button rechts unten)
          </li>
          <li>
            Die englische Übersetzung aller Textsegmente wurde mit Unterstützung von ChatGPT
            (GPT-4o) angefertigt und danach von uns überprüft. Sie erhebt keinen Anspruch darauf
            perfekt zu sein; einige historische Anspielungen und Wortspiele lassen sich nur schwer
            übertragen. Ziel war es vor allem, nicht-deutschsprachigen Nutzer*innen eine sinnvolle
            Verwendung der App zu ermöglichen.
          </li>
        </ol>

        <h2>Förderhinweis</h2>
        <p>
          Gefördert durch die Deutsche Forschungsgemeinschaft (DFG) im Rahmen der Exzellenzstrategie
          des Bundes und der Länder innerhalb des Exzellenzclusters Temporal Communities: Doing
          Literature in a Global Perspective – EXC 2020 – Projekt-ID 390608380.
        </p>
      </div>
    {/if}
  </article>
</Header>

<style>
  /* Rudimentary prose styling */
  article {
    line-height: 1.5em;
    max-width: 80ch;

    & h1 {
      font-size: 2em;
      margin-top: 2em;
      margin-bottom: 1em;
    }
    & h2 {
      font-size: 1.5em;
      margin-top: 2em;
      margin-bottom: 0.5em;
    }

    & ul,
    & ol {
      margin-top: 0.5em;
      margin-bottom: 0.5em;

      & li {
        margin-top: 0.5em;
        margin-bottom: 0.5em;
      }
    }

    & a {
      text-decoration: underline;
    }
  }
</style>
