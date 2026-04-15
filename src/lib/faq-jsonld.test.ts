import assert from "node:assert/strict";
import test from "node:test";
import { buildFaqPageJsonLd } from "./faq-jsonld";

test("buildFaqPageJsonLd: FAQPage con mainEntity Question/Answer (shape Rich Results)", () => {
  const obj = buildFaqPageJsonLd([
    {
      question: "¿Pregunta?",
      answer: "<p>Respuesta <strong>negrita</strong> y fin.</p>",
    },
  ]);
  assert.equal(obj["@context"], "https://schema.org");
  assert.equal(obj["@type"], "FAQPage");
  assert.ok(Array.isArray(obj.mainEntity));
  assert.equal(obj.mainEntity.length, 1);
  const q = obj.mainEntity[0] as Record<string, unknown>;
  assert.equal(q["@type"], "Question");
  assert.equal(q.name, "¿Pregunta?");
  const aa = q.acceptedAnswer as Record<string, unknown>;
  assert.equal(aa["@type"], "Answer");
  assert.equal(typeof aa.text, "string");
  assert.match(aa.text as string, /negrita/);
  assert.ok(
    !(aa.text as string).includes("<"),
    "Answer.text debe ser texto plano sin tags",
  );
});

test("buildFaqPageJsonLd: lista vacía sigue siendo FAQPage válido estructuralmente", () => {
  const obj = buildFaqPageJsonLd([]);
  assert.equal(obj["@type"], "FAQPage");
  assert.deepEqual(obj.mainEntity, []);
});
