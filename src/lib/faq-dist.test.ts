/**
 * Contrato SSR del acordeón FAQ sobre el HTML generado (`dist/`).
 * Requiere `npm run build` previo; sin `dist/` los tests se saltean.
 */
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";
import { templatesFaqEntries } from "../data/templates-faq";
import type { FaqItem } from "./faq-taxonomy";

const DIST = new URL("../../dist/", import.meta.url);
const skip = existsSync(DIST) ? false : "sin dist/: correr `npm run build`";

const servicesFaq = (
  JSON.parse(
    readFileSync(
      new URL("../content/faq/entries.json", import.meta.url),
      "utf8",
    ),
  ) as FaqItem[]
).sort((a, b) => a.order - b.order);

const hubFaq = [
  {
    question: "¿Qué incluye el hub?",
    questionEn: "What does the hub include?",
  },
  {
    question: "¿Puedo sumar chatbot después?",
    questionEn: "Can I add a chatbot later?",
  },
];

type Route = {
  path: string;
  lang: "es" | "en";
  idPrefix: string;
  data: {
    question: string;
    questionEn: string;
    answer?: string;
    answerEn?: string;
  }[];
  open: number[];
  singleOpen: boolean;
  hasFaqJsonLd: boolean;
};

const ROUTES: Route[] = [
  {
    path: "servicios",
    lang: "es",
    idPrefix: "services-faq",
    data: servicesFaq,
    open: [0],
    singleOpen: false,
    hasFaqJsonLd: true,
  },
  {
    path: "en/services",
    lang: "en",
    idPrefix: "services-faq",
    data: servicesFaq,
    open: [0],
    singleOpen: false,
    hasFaqJsonLd: true,
  },
  {
    path: "plantillas",
    lang: "es",
    idPrefix: "templates-faq",
    data: templatesFaqEntries,
    open: [0],
    singleOpen: true,
    hasFaqJsonLd: true,
  },
  {
    path: "en/templates",
    lang: "en",
    idPrefix: "templates-faq",
    data: templatesFaqEntries,
    open: [0],
    singleOpen: true,
    hasFaqJsonLd: true,
  },
  {
    path: "oferta/hub-creadores",
    lang: "es",
    idPrefix: "creator-hub-faq",
    data: hubFaq,
    open: [],
    singleOpen: false,
    hasFaqJsonLd: false,
  },
  {
    path: "en/offer/creator-hub",
    lang: "en",
    idPrefix: "creator-hub-faq",
    data: hubFaq,
    open: [],
    singleOpen: false,
    hasFaqJsonLd: false,
  },
];

function decode(s: string): string {
  return s
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#x([0-9a-f]+);/gi, (_, h) =>
      String.fromCodePoint(parseInt(h, 16)),
    )
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&amp;/g, "&");
}
const text = (html: string) =>
  decode(html.replace(/<[^>]+>/g, ""))
    .replace(/\s+/g, " ")
    .trim();
const attr = (tag: string, name: string) => {
  const m = tag.match(new RegExp(`\\s${name}(?:="([^"]*)")?(?=[\\s>/])`, "i"));
  return m ? decode(m[1] ?? "") : null;
};

function parse(route: Route) {
  const html = readFileSync(new URL(`${route.path}/index.html`, DIST), "utf8");
  const items = [
    ...html.matchAll(
      /<details\b[^>]*class="faq-accordion__item"[^>]*>[\s\S]*?<\/details>/g,
    ),
  ].map(([block]) => {
    const tag = block.match(/^<details\b[^>]*>/)![0];
    return {
      tag,
      block,
      question: text(
        block.match(
          /<span class="faq-accordion__question"[^>]*>([\s\S]*?)<\/span>/,
        )![1],
      ),
      answer: text(
        block.match(
          /<div class="faq-accordion__answer"[^>]*>([\s\S]*?)<\/div>/,
        )![1],
      ),
    };
  });
  const faqPage = [
    ...html.matchAll(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
    ),
  ]
    .map((m) => JSON.parse(m[1]))
    .find((d) => d["@type"] === "FAQPage");
  return { html, items, faqPage };
}

for (const route of ROUTES) {
  test(
    `${route.path}: preguntas y respuestas visibles coinciden con los datos (${route.lang})`,
    { skip },
    () => {
      const { items } = parse(route);
      const en = route.lang === "en";
      assert.deepEqual(
        items.map((i) => i.question),
        route.data.map((d) => (en ? d.questionEn : d.question)),
      );
      for (const [i, d] of route.data.entries()) {
        const expected = en ? d.answerEn : d.answer;
        if (expected) assert.equal(items[i].answer, expected);
        else assert.ok(items[i].answer.length > 0);
      }
    },
  );

  test(`${route.path}: <html lang> = ${route.lang}`, { skip }, () => {
    assert.match(
      parse(route).html,
      new RegExp(`<html[^>]*\\slang="${route.lang}"`),
    );
  });

  test(`${route.path}: ids únicos y deterministas`, { skip }, () => {
    const { html, items } = parse(route);
    const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
    assert.deepEqual(
      ids.filter((id, i) => ids.indexOf(id) !== i),
      [],
    );
    assert.match(
      html,
      new RegExp(`<div[^>]*id="${route.idPrefix}"[^>]*data-faq-accordion`),
    );
    items.forEach((it, i) =>
      assert.equal(attr(it.tag, "id"), `${route.idPrefix}-item-${i}`),
    );
  });

  test(`${route.path}: estado inicial y apertura exclusiva`, { skip }, () => {
    const { items } = parse(route);
    assert.deepEqual(
      items.flatMap((it, i) => (attr(it.tag, "open") !== null ? [i] : [])),
      route.open,
    );
    for (const it of items)
      assert.equal(
        attr(it.tag, "name"),
        route.singleOpen ? route.idPrefix : null,
      );
  });

  test(
    `${route.path}: ícono decorativo y data-* solo en nodos hoja`,
    { skip },
    () => {
      const { items } = parse(route);
      for (const { block } of items) {
        const svgs = block.match(/<svg\b[^>]*>/g) ?? [];
        assert.equal(svgs.length, 1);
        assert.equal(attr(svgs[0], "aria-hidden"), "true");
        assert.equal(attr(svgs[0], "focusable"), "false");
        // nhLang.apply() reemplaza textContent de [data-en][data-es]: no puede tener hijos elemento.
        for (const m of block.matchAll(
          /<(\w+)\b[^>]*\sdata-en="[^"]*"[^>]*>([\s\S]*?)<\/\1>/g,
        ))
          assert.doesNotMatch(
            m[2],
            /<\w/,
            `data-en con hijos: ${m[0].slice(0, 80)}`,
          );
      }
    },
  );

  if (route.hasFaqJsonLd && route.lang === "es") {
    test(
      `${route.path}: FAQ visible = mainEntity del JSON-LD`,
      { skip },
      () => {
        const { items, faqPage } = parse(route);
        assert.ok(faqPage, "falta FAQPage");
        assert.deepEqual(
          faqPage.mainEntity.map(
            (q: { name: string; acceptedAnswer: { text: string } }) => [
              q.name,
              q.acceptedAnswer.text,
            ],
          ),
          items.map((i) => [i.question, i.answer]),
        );
      },
    );
  }

  if (route.hasFaqJsonLd && route.lang === "en") {
    test(
      `${route.path}: FAQ visible = mainEntity del JSON-LD`,
      {
        skip,
        todo: "R1 deuda técnica: el FAQPage de /en/* se genera en español",
      },
      () => {
        const { items, faqPage } = parse(route);
        assert.deepEqual(
          faqPage.mainEntity.map((q: { name: string }) => q.name),
          items.map((i) => i.question),
        );
      },
    );
  }
}
