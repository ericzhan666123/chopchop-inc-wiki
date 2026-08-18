import Link from "next/link";
import { notFound } from "next/navigation";
import { Shell } from "./Shell";
import { Breadcrumbs } from "./Breadcrumbs";
import { AchievementTable } from "./AchievementTable";
import {
  achievementData,
  updateData,
  type Rarity,
} from "@/lib/steam";
import {
  categoryLabel,
  itemCategories,
  pathFor,
  recipeCategories,
} from "@/lib/content";
import type { Locale } from "@/lib/types";

const rarityLabels: Record<Locale, Record<Rarity, string>> = {
  en: {
    common: "Common",
    uncommon: "Uncommon",
    rare: "Rare",
    "very-rare": "Very rare",
  },
  de: {
    common: "Häufig",
    uncommon: "Ungewöhnlich",
    rare: "Selten",
    "very-rare": "Sehr selten",
  },
};

const gameInfo = (locale: Locale) =>
  locale === "de" ? "Spielinfo" : "Game Info";

export function AchievementsPage({ locale }: { locale: Locale }) {
  const de = locale === "de";
  const sorted = [...achievementData.achievements].sort(
    (a, b) => a.globalPercent - b.globalPercent,
  );
  const rarest = sorted[0];
  const common = sorted.at(-1)!;

  return (
    <Shell locale={locale}>
      <Breadcrumbs
        locale={locale}
        items={[
          { name: gameInfo(locale), path: "/game-info" },
          { name: de ? "Errungenschaften" : "Achievements" },
        ]}
      />

      <h1>
        {de
          ? "Chop Chop Inc. Errungenschaften – alle 21 Steam-Errungenschaften"
          : "Chop Chop Inc. Achievements - All 21 Steam Achievements"}
      </h1>

      {de && (
        <p className="muted">
          Namen und Beschreibungen der Errungenschaften werden unverändert auf
          Englisch angezeigt, da Steam sie nur auf Englisch bereitstellt.
        </p>
      )}

      <div className="achievement-stats">
        <div className="stat">
          <strong>{de ? "Gesamt" : "Total"}</strong>
          <br />
          {achievementData.totalAchievements}
        </div>

        <div className="stat">
          <strong>{de ? "Seltenste" : "Rarest"}</strong>
          <br />
          {rarest.displayName} · {rarest.globalPercent.toFixed(1)}%
        </div>

        <div className="stat">
          <strong>{de ? "Häufigste" : "Most common"}</strong>
          <br />
          {common.displayName} · {common.globalPercent.toFixed(1)}%
        </div>
      </div>

      <AchievementTable
        achievements={achievementData.achievements}
        locale={locale}
      />

      <p className="source-note">
        {de
          ? "Freischaltraten von Steam, aktualisiert am"
          : "Unlock rates from Steam, updated"}{" "}
        {new Date(achievementData.fetchedAt).toLocaleDateString(
          de ? "de-DE" : "en-US",
        )}
        .{" "}
        <a href={achievementData.source}>
          {de ? "Quelle auf Steam" : "Source on Steam"} ↗
        </a>
      </p>
    </Shell>
  );
}

export function AchievementPage({
  locale,
  slug,
}: {
  locale: Locale;
  slug: string;
}) {
  const achievement = achievementData.achievements.find(
    (entry) => entry.slug === slug,
  );

  if (!achievement) notFound();

  const de = locale === "de";

  return (
    <Shell locale={locale}>
      <Breadcrumbs
        locale={locale}
        items={[
          { name: gameInfo(locale), path: "/game-info" },
          {
            name: de ? "Errungenschaften" : "Achievements",
            path: "/achievements",
          },
          { name: achievement.displayName },
        ]}
      />

      {de && (
        <p className="muted">
          Name und Beschreibung werden im englischen Steam-Original angezeigt.
        </p>
      )}

      <article className="achievement-detail">
        <img
          src={achievement.icon}
          width="184"
          height="184"
          alt=""
        />

        <div>
          <span className={`rarity ${achievement.rarity}`}>
            {rarityLabels[locale][achievement.rarity]}
          </span>

          <h1>{achievement.displayName}</h1>

          <p>
            {achievement.description ??
              (de ? "Verborgene Errungenschaft" : "Hidden achievement")}
          </p>

          <strong className="unlock-rate">
            {achievement.globalPercent.toFixed(1)}%
          </strong>

          <p>
            {de
              ? `Nur ${achievement.globalPercent.toFixed(1)} % der Spieler haben diese Errungenschaft freigeschaltet.`
              : `Only ${achievement.globalPercent.toFixed(1)}% of players have unlocked this achievement.`}
          </p>
        </div>
      </article>
    </Shell>
  );
}

export function UpdatesPage({ locale }: { locale: Locale }) {
  const de = locale === "de";
  const latest = updateData.updates[0];

  return (
    <Shell locale={locale}>
      <Breadcrumbs
        locale={locale}
        items={[
          { name: gameInfo(locale), path: "/game-info" },
          { name: "Updates" },
        ]}
      />

      <h1>
        {de
          ? "Chop Chop Inc. Updates & Patchnotes"
          : "Chop Chop Inc. Updates & Patch Notes"}
      </h1>

      {de && (
        <p className="muted">
          Titel und Zusammenfassungen bleiben im englischen Original.
        </p>
      )}

      <div className="stats">
        <div className="stat">
          <strong>{de ? "Letztes Update" : "Latest update"}</strong>
          <br />
          {latest?.date ?? "—"}
        </div>

        <div className="stat">
          <strong>{de ? "Versionsstatus" : "Version status"}</strong>
          <br />
          {latest?.title ?? "—"}
        </div>
      </div>

      <div className="timeline">
        {updateData.updates.map((update) => (
          <article className="card update-card" key={update.gid}>
            <time dateTime={update.date}>{update.date}</time>
            <h2>{update.title}</h2>
            <p>{update.excerpt}</p>
            <a href={update.url}>
              {de
                ? "Vollständige Patchnotes auf Steam lesen"
                : "Read full patch notes on Steam"}{" "}
              →
            </a>
            <small>
              {de ? "Quelle" : "Source"}: Steam · {update.author}
            </small>
          </article>
        ))}
      </div>

      <p className="source-note">
        {de
          ? "Diese Seite zeigt kurze Auszüge aus öffentlichen Steam-Mitteilungen. Die vollständigen Patchnotes bleiben bei Steam."
          : "This page shows brief excerpts from public Steam announcements. Full patch notes remain on Steam."}
      </p>
    </Shell>
  );
}

export function RequirementsPage({ locale }: { locale: Locale }) {
  const de = locale === "de";

  const rows = [
    ["OS", "Windows 10/11 64-bit"],
    ["CPU", "Intel Core i5-6700 / AMD Ryzen 5 1600"],
    ["RAM", "8 GB"],
    ["GPU", "NVIDIA GTX 1070 Ti / AMD RX 5600 XT"],
    ["DirectX", "Version 12"],
    [de ? "Speicher" : "Storage", "5 GB, SSD required"],
  ];

  return (
    <Shell locale={locale}>
      <Breadcrumbs
        locale={locale}
        items={[
          { name: gameInfo(locale), path: "/game-info" },
          {
            name: de ? "Systemanforderungen" : "System Requirements",
          },
        ]}
      />

      <h1>
        {de
          ? "Chop Chop Inc. Systemanforderungen"
          : "Chop Chop Inc. System Requirements"}
      </h1>

      <div className="ssd-callout">
        <strong>SSD required</strong>
        <span>
          {de
            ? "Eine SSD ist zwingend erforderlich."
            : "An SSD is a hard requirement."}
        </span>
      </div>

      <div className="snapshot card">
        {rows.map(([key, value]) => (
          <div className="snapshot-row" key={key}>
            <strong>{key}</strong>
            <span>{value}</span>
          </div>
        ))}
      </div>
    </Shell>
  );
}

type Hub = "database" | "world" | "game-info";

export function HubPage({
  locale,
  hub,
}: {
  locale: Locale;
  hub: Hub;
}) {
  const de = locale === "de";

  const data = {
    database: {
      title: de ? "Datenbank" : "Database",
      description: de
        ? "Rezepte und Gegenstände aus den Spieldateien durchsuchen."
        : "Browse recipes and items extracted from the game files.",
      links: [
        [de ? "Alle Rezepte" : "All Recipes", "/recipes", "132"],
        [de ? "Alle Gegenstände" : "All Items", "/items", "236"],
      ],
    },
    world: {
      title: de ? "Welt" : "World",
      description: de
        ? "Bäume, Sammelobjekte, Figuren und Zielgruppen entdecken."
        : "Explore trees, collectibles, characters and customer factions.",
      links: [
        [de ? "Bäume" : "Trees", "/trees", "8"],
        [de ? "Gummienten" : "Rubber Ducks", "/ducks", "13"],
        ["NPCs", "/npcs", "16"],
        [de ? "Zielgruppen" : "Audiences", "/audiences", "10"],
      ],
    },
    "game-info": {
      title: de ? "Spielinfo" : "Game Info",
      description: de
        ? "Steam-Errungenschaften, Updates und PC-Anforderungen."
        : "Steam achievements, updates and PC requirements.",
      links: [
        [
          de ? "Errungenschaften" : "Achievements",
          "/achievements",
          "21",
        ],
        ["Updates", "/updates", updateData.updates.length.toString()],
        [
          de ? "Systemanforderungen" : "System Requirements",
          "/system-requirements",
          "PC",
        ],
      ],
    },
  }[hub];

  return (
    <Shell locale={locale}>
      <Breadcrumbs
        locale={locale}
        items={[{ name: data.title }]}
      />

      <h1>{data.title}</h1>
      <p className="lead">{data.description}</p>

      <div className="grid">
        {data.links.map(([name, path, count]) => (
          <Link
            className="card browse-card"
            href={pathFor(locale, path)}
            key={path}
          >
            <strong>{count}</strong>
            <h2>{name}</h2>
          </Link>
        ))}
      </div>

      {hub === "database" && <DatabaseCategories locale={locale} />}
    </Shell>
  );
}

function DatabaseCategories({ locale }: { locale: Locale }) {
  const de = locale === "de";

  return (
    <>
      <section id="recipe-categories" className="home-section">
        <h2>{de ? "Rezeptkategorien" : "Recipe Categories"}</h2>
        <div className="tag-cloud">
          {recipeCategories.map((category) => (
            <Link
              href={pathFor(
                locale,
                `/recipes/category/${category}`,
              )}
              key={category}
            >
              {categoryLabel(category, locale)}
            </Link>
          ))}
        </div>
      </section>

      <section id="item-categories" className="home-section">
        <h2>
          {de ? "Gegenstandskategorien" : "Item Categories"}
        </h2>
        <div className="tag-cloud">
          {itemCategories.map((category) => (
            <Link
              href={pathFor(
                locale,
                `/items/category/${category}`,
              )}
              key={category}
            >
              {categoryLabel(category, locale)}
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

export function LegalPage({
  locale,
  type,
}: {
  locale: Locale;
  type: "about" | "terms" | "privacy";
}) {
  const de = locale === "de";

  const titles = {
    about: de ? "Über dieses Wiki" : "About this wiki",
    terms: de ? "Nutzungsbedingungen" : "Terms of Service",
    privacy: de ? "Datenschutz" : "Privacy Policy",
  };

  return (
    <Shell locale={locale}>
      <Breadcrumbs
        locale={locale}
        items={[
          {
            name: de ? "Über" : "About",
            path: "/about",
          },
          { name: titles[type] },
        ]}
      />

      <article className="legal">
        <h1>{titles[type]}</h1>

        {type === "about" && (
          <>
            <p>
              {de
                ? "Chop Chop Inc. Wiki ist ein inoffizielles Fanprojekt und steht in keiner Verbindung zu NullRef Entertainment oder rokaplay select."
                : "Chop Chop Inc. Wiki is an unofficial fan resource and is not affiliated with NullRef Entertainment or rokaplay select."}
            </p>
            <p>
              {de
                ? "Die Daten stammen aus extrahierten Spieldateien und öffentlich zugänglichen Steam-Daten."
                : "Data is sourced from extracted game files and publicly available Steam data."}
            </p>
          </>
        )}

        {type === "terms" && (
          <>
            <p>
              {de
                ? "Dieses Wiki wird als inoffizielle Informationsquelle ohne Gewähr bereitgestellt. Spielnamen und Marken gehören ihren jeweiligen Eigentümern."
                : "This wiki is provided as an unofficial informational resource without warranty. Game names and trademarks belong to their respective owners."}
            </p>
            <p>
              {de
                ? "Verwende die Angaben auf eigene Verantwortung und prüfe aktuelle Änderungen anhand der verlinkten offiziellen Steam-Quellen."
                : "Use the information at your own discretion and verify current changes through the linked official Steam sources."}
            </p>
          </>
        )}

        {type === "privacy" &&
          (de ? (
            <>
              <p>
                Diese Website verwendet Google Tag Manager und Google
                Analytics, um den Websiteverkehr zu messen.
              </p>
              <p>
                Diese Dienste setzen Cookies und können die besuchten Seiten,
                den ungefähren aus der IP-Adresse abgeleiteten Standort, den
                Geräte- und Browsertyp sowie die verweisende Website erfassen.
              </p>
              <p>
                Wir erheben keine Namen, E-Mail-Adressen oder
                Kontoinformationen. Diese Website bietet keine Benutzerkonten
                und keine Anmeldung.
              </p>
              <p>
                Die Daten werden von Google verarbeitet. Weitere Informationen
                enthält die{" "}
                <a href="https://policies.google.com/privacy">
                  Datenschutzerklärung von Google
                </a>
                .
              </p>
              <p>
                Besucher können die Erfassung durch Google Analytics mit dem{" "}
                <a href="https://tools.google.com/dlpage/gaoptout">
                  Browser-Add-on zur Deaktivierung von Google Analytics
                </a>{" "}
                deaktivieren.
              </p>
            </>
          ) : (
            <>
              <p>
                This site uses Google Tag Manager and Google Analytics to
                measure traffic.
              </p>
              <p>
                These services set cookies and may collect pages visited,
                approximate location derived from IP, device and browser type,
                and the referring site.
              </p>
              <p>
                We do not collect names, email addresses, or account
                information. This site has no accounts and no login.
              </p>
              <p>
                Data is processed by Google. Read{" "}
                <a href="https://policies.google.com/privacy">
                  Google&apos;s privacy policy
                </a>{" "}
                for more information.
              </p>
              <p>
                Visitors can opt out through{" "}
                <a href="https://tools.google.com/dlpage/gaoptout">
                  Google&apos;s browser add-on
                </a>
                .
              </p>
            </>
          ))}

        <h2>{de ? "Hinweise und Kontakt" : "Notice and contact"}</h2>

        <p>
          {de
            ? "Diese Website ist nicht mit NullRef Entertainment oder rokaplay select verbunden. Spielnamen, Inhalte und Marken gehören ihren jeweiligen Eigentümern."
            : "This site is not affiliated with NullRef Entertainment or rokaplay select. Game names, content and trademarks belong to their respective owners."}
        </p>

        <p>
          {de ? "Kontakt" : "Contact"}:{" "}
          <a href="mailto:contact@chopchop-inc.wiki">
            contact@chopchop-inc.wiki
          </a>
        </p>
      </article>
    </Shell>
  );
}