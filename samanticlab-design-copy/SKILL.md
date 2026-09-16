---
name: samanticlab-design-copy
description: Helper for samanticlab-design. Load when writing or fixing the words on a website — headlines, body copy, buttons, labels, form hints, error messages, "this sounds like AI", "rewrite this section". Not for layout or code.
---

# Copy: the words

Read `samanticlab-design` first; section 5 holds the blacklist and it applies to every word here. This file is the method.

## Where words come from

- **The gate, not the model.** Question 2 (uniquely true), question 3 (real proof), question 12 (the owner's three words). Every headline is built from those. If the gate was not run, ask for them before writing a line.
- **The owner's mouth.** Ask how they describe the work to a customer on the phone. Write that down. Their sentence usually beats the polished one.
- **Facts beat adjectives.** "Twenty-two years", "nine times out of ten", "by 15:00", "R850 call-out", a street name, a first name. If a sentence has no fact in it, ask what fact belongs there.
- **Nothing invented.** No reviews, prices, clients, years, awards or numbers the user did not give. Missing things are marked `[placeholder: real hours]` and named in the report.

## Headlines

- One idea. Say what the business does for the visitor, in their words. "Boreholes drilled to water, guaranteed in writing." Not "Water solutions for your home."
- No colon pivot. No question that answers itself. No three adjectives. No "Welcome to". No "Your trusted partner in".
- Under 12 words. `text-wrap: balance` and a bounded width; never a forced `<br>`.
- The line under it adds a new fact, not a rewording.
- **Test:** could this headline sit on a competitor's site unchanged? If yes, it is not a headline yet.

## Body copy

- One idea per sentence. One topic per paragraph. Say it once; if the heading already says it, the paragraph adds or disappears.
- Cut every sentence in half, then do it again. Remove hedging ("we believe", "we strive"), fluff, and legalese.
- Active voice, present tense. "We fit it in a morning", not "Installation can typically be completed within a morning."
- Concrete nouns and specific verbs. Name the thing: the pipe, the paint, the plate, the bookings diary.
- Numbers as digits. Local spellings, local currency, local place names as the client says them.
- Paragraphs of two to four sentences on a phone. Long paragraphs get split, not shrunk.
- No exclamation marks in body. No em-dash runs. No "Imagine…". No rhetorical questions.

## Buttons and links

- A button names what happens next. "Book Tuesday." "Send the quote request." "Call Pieter." "See the price list."
- Never: Learn more, Click here, Get started, Submit, Discover, Explore, Read more, Go, Contact us, Get in touch. These say nothing.
- One primary action per screen. Its label is the most specific sentence on the page.
- Links in body text say where they go: "the price list", not "here".

## Labels, hints, errors

- Every field has a visible label that names the thing: "Phone number", "Your suburb". Placeholders are examples ("082 555 1234"), never labels.
- Helper text answers the question the visitor is silently asking ("We only use this to confirm your booking"). It never restates the label.
- An error names what failed, why, and how to fix it: "Enter a phone number with 10 digits, like 082 555 1234." Never "Invalid input", never "Error occurred".
- Success replaces the form with what happens next: "Sent. Pieter will call you before 17:00 today."
- Do not vary words for effect. The same thing has the same name on every page. Pick "quote" or "estimate" and keep it.

## Voice

- Take the owner's three words from the gate and keep them beside you. Every paragraph should sound like a person who would say those three words.
- Plain beats clever. Warm beats slick. Specific beats everything.
- Do not patronise or over-explain. The visitor is an adult who wants the thing.
- Read it aloud. If the owner would not say it across a counter, rewrite it.

## Before handing over

- Run the checker on the file: it catches the blacklist, lazy buttons, and labels above headings.
- Read every heading in order, alone. They should tell the whole story without the paragraphs.
- Read every button in order, alone. They should read as a path, not a pile of "Learn more".
