# Evidence-first prompt contract

[Case study](../README.md) · [Approval and automation](approval-and-automation.md) · [Verification evidence](verification-evidence.md)

Research Studio treats prompting as a versioned product contract, not an editable paragraph. The private alpha.24 contract is identified as `research-studio.enrichment.v3`.

## What the prompt receives

For each record, the app supplies only bounded catalog evidence:

- the primary Chinese title;
- the existing short catalog description;
- an app-assigned record number for batch correlation; and
- the expected output contract and local canonical tag vocabulary.

The title and description are explicitly marked untrusted. Embedded commands, URLs, Markdown tasks, or requests to change output rules are treated as story text rather than instructions.

The prompt does not grant file, database, browser-profile, or export authority. It tells the assistant never to ask for a SQLite path, attachment, login, confirmation, or permission and never to claim that it saved or updated data.

## Research method requested

1. Search the exact Chinese title first; add short-drama identity terms only when needed.
2. Extract distinctive anchors such as character relationships, occupations, organizations, unusual identities, locations, and the inciting conflict.
3. Prefer official distributor/streaming pages, verified descriptions, and recognized drama catalogs.
4. Treat copied snippets repeated across scraper pages as one source.
5. Require the title plus at least two distinctive anchors when two anchors are available.
6. Omit disputed cast, dates, platforms, episode counts, credits, endings, and alternate titles.
7. Fall back to `catalog_only` with lower confidence when public identity remains uncertain.

## Required evidence envelope

```json
{
  "contract_version": "research-studio.enrichment.v3",
  "research": {
    "resolved_title_zh": "",
    "identity_basis": "multi_source_web | single_source_web | catalog_only",
    "confidence": "high | medium | low",
    "evidence_anchors": [],
    "source_domains": [],
    "uncertainties": []
  },
  "best_english_title": "",
  "detailed_description_zh": "",
  "detailed_description_en": "",
  "tag_ids": []
}
```

Source entries are hostnames only—never full paths, query strings, credentials, or fabricated citations. High confidence requires a coherent multi-source match. Catalog-only results use no source domains.

## Metadata quality rules

- The English title should be natural title case, usually 2–10 words, and avoid episode/platform labels, pinyin without explanation, slogans, or “Short Drama.”
- The Simplified Chinese synopsis should be roughly 100–180 Chinese characters.
- The English synopsis should be roughly 80–130 words and adapt the same supported facts.
- Both should establish the protagonist, starting situation, inciting change, central relationship/opposition, stakes, and dramatic direction.
- Both are storage-ready catalog prose—not reviews, recommendations, research notes, source lists, trope essays, or ending summaries.
- Unsupported names, cast, platforms, production facts, pregnancy/child twists, supernatural mechanics, identity reveals, and outcomes must be omitted.
- Generic filler and promotional claims are rejected.

## Canonical tag contract

The assistant returns 6–10 canonical IDs such as `genre.romance`, `trope.contract_marriage`, `setting.urban`, or `theme.truth_seeking`. Research Studio validates the IDs and derives the Chinese/English labels from its local 184-entry taxonomy.

This removes several model-controlled failure modes:

- independently translated tag pairs drifting out of alignment;
- unknown spellings or near-duplicate concepts;
- different ordering between languages;
- output padded with generic tags; and
- high-concept tags inferred from a dramatic title rather than supported premise evidence.

Rebirth, transmigration, time travel, systems, mind reading, supernatural mechanics, pregnancy, secret children, campus, military, wartime, and historical settings require direct premise support.

## Output discipline

The final answer must be one complete JSON object for a single record or one complete array for a batch. It cannot include Markdown fences, commentary, citations, URLs, `tags_zh`, `tags_en`, database claims, or unlisted fields.

Research Studio still treats a contract-valid response as untrusted. It correlates record identity, runs domain gates, stages the result on the job, and requires explicit human approval.

## Evaluation cases

The alpha.24 suite includes four synthetic prompt evaluations:

| Case | Expected behavior |
| --- | --- |
| Catalog-only identity | Conservative metadata, low confidence, no source domains |
| Unsupported high-concept premise | Reject tag claims not supported by the supplied story evidence |
| Confidence/source mismatch | Reject high confidence without coherent multi-source evidence |
| Coherent multi-source result | Accept aligned evidence, bilingual prose, and known canonical IDs |

These evaluations test contract and safety behavior. They do not establish factual accuracy for every real title or replace reviewer judgment.
