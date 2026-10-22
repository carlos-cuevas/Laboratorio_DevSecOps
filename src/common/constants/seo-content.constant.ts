import { IToolSeoContent } from '@/common/interfaces';

/**
 * Long-form SEO content rendered below each tool and emitted as FAQPage
 * structured data. Keyed by tool id from nav.constant.ts. Every claim here
 * must stay truthful to what the tool actually does.
 */
export const toolSeoContent: Record<string, IToolSeoContent> = {
  'uuid-generator': {
    overview: [
      'A UUID (universally unique identifier) is a 128-bit value used to identify records, resources, and entities without needing a central authority. This free online UUID generator creates version 1, 4, 6, and 7 UUIDs directly in your browser — no signup, no limits, and nothing is ever sent to a server.',
      'Version 4 UUIDs are built from random data and are the most common choice for general use. Versions 1 and 6 embed a timestamp, and version 7 combines a Unix timestamp with random bits, making it ideal for database primary keys that should sort by creation time.',
    ],
    features: [
      'Generate UUID versions 1, 4, 6, and 7',
      'One-click copy to clipboard',
      'Runs entirely in your browser — nothing is uploaded',
      'Free, unlimited, and open source',
    ],
    faqs: [
      {
        question: 'What is a UUID?',
        answer:
          'A UUID (universally unique identifier) is a 128-bit identifier, usually written as 36 characters in the form 8-4-4-4-12, e.g. 550e8400-e29b-41d4-a716-446655440000. UUIDs can be generated independently on any machine with a negligible chance of collision.',
      },
      {
        question: 'Which UUID version should I use?',
        answer:
          'Use version 4 for general-purpose random identifiers. Use version 7 when you want IDs that sort by creation time, such as database primary keys. Versions 1 and 6 are timestamp-based formats used by older systems.',
      },
      {
        question: 'Are the generated UUIDs really unique?',
        answer:
          'A version 4 UUID contains 122 random bits, so the probability of two generated UUIDs colliding is vanishingly small — you can treat them as unique for any practical purpose.',
      },
      {
        question: 'Is it safe to generate UUIDs online?',
        answer:
          'Yes. This tool generates UUIDs locally in your browser using the JavaScript uuid library; the values are never transmitted to or stored on a server.',
      },
    ],
  },

  'password-generator': {
    overview: [
      'Create strong, random passwords in one click. Choose the length and which character sets to include — uppercase letters, lowercase letters, numbers, and symbols — and this free password generator produces a new password instantly, entirely in your browser.',
      'Because generation happens locally on your device, the password is never sent over the network, logged, or stored anywhere. Pair a long random password with a password manager for the best protection against brute-force and credential-stuffing attacks.',
    ],
    features: [
      'Adjustable password length',
      'Toggle uppercase, lowercase, numbers, and symbols',
      'Generated locally — never transmitted or stored',
      'One-click copy to clipboard',
    ],
    faqs: [
      {
        question: 'What makes a password strong?',
        answer:
          'Length and randomness matter most. A randomly generated password of 16 or more characters mixing uppercase, lowercase, numbers, and symbols is impractical to brute-force with current hardware.',
      },
      {
        question: 'Is it safe to use an online password generator?',
        answer:
          'This tool is safe because the password is generated locally in your browser using the Web Crypto API. It is never sent to a server, and nothing is stored after you leave the page.',
      },
      {
        question: 'Should I use a different password for every account?',
        answer:
          'Yes. Reusing passwords lets a single data breach compromise every account that shares the password. Generate a unique password per account and keep them in a password manager.',
      },
    ],
  },

  'json-formatter': {
    overview: [
      'Format, beautify, validate, and minify JSON online. Paste raw or minified JSON and get cleanly indented, readable output — choose between 2 spaces, 4 spaces, tab indentation, or full minification for the smallest payload.',
      'The formatter parses your input with the browser’s native JSON engine, so invalid JSON is caught immediately with an error message. Everything runs client-side: your API responses, configs, and payloads never leave your device.',
    ],
    features: [
      'Beautify JSON with 2-space, 4-space, or tab indentation',
      'Minify JSON to a single compact line',
      'Instant validation with clear syntax errors',
      'Handles large documents, entirely in your browser',
    ],
    faqs: [
      {
        question: 'How do I format JSON online?',
        answer:
          'Paste your JSON into the editor, pick an indentation style, and the formatted result appears instantly. Use the copy button to grab the output.',
      },
      {
        question: 'Can this tool minify JSON?',
        answer:
          'Yes. Select the Minify option to strip all whitespace and produce the most compact valid JSON, which reduces payload size for APIs and storage.',
      },
      {
        question: 'What happens if my JSON is invalid?',
        answer:
          'The tool validates your input as it parses it and shows a syntax error instead of output, so you can spot missing commas, unquoted keys, or trailing characters quickly.',
      },
      {
        question: 'Is my JSON data private?',
        answer:
          'Yes. Formatting happens entirely in your browser — the JSON you paste is never uploaded, logged, or stored on any server.',
      },
    ],
  },

  'sql-formatter': {
    overview: [
      'Beautify SQL queries for readability and consistent style. Paste any query — from a quick SELECT to a long report query with joins, subqueries, and CTEs — choose your SQL dialect, and get neatly indented, consistently cased output.',
      'Dialect-aware formatting (including MySQL and PostgreSQL) keeps keywords, identifiers, and operators formatted correctly for your database. Formatting only changes whitespace and layout, never the meaning of your query, and it all runs locally in your browser.',
    ],
    features: [
      'Supports multiple SQL dialects, including MySQL and PostgreSQL',
      'Consistent indentation for joins, subqueries, and CTEs',
      'Formatting never alters query semantics',
      'Client-side processing — queries never leave your device',
    ],
    faqs: [
      {
        question: 'Which SQL dialects are supported?',
        answer:
          'You can format standard SQL as well as popular dialects such as MySQL and PostgreSQL — pick the language that matches your database from the settings.',
      },
      {
        question: 'Does formatting change what my query does?',
        answer:
          'No. The formatter only rearranges whitespace, line breaks, and indentation. The logic and results of your query stay exactly the same.',
      },
      {
        question: 'Is it safe to paste production queries here?',
        answer:
          'Yes. The formatter runs entirely in your browser, so your queries — including table names and business logic — are never sent to a server.',
      },
    ],
  },

  'base64-text-encoder-decoder': {
    overview: [
      'Encode text to Base64 or decode Base64 back to plain text instantly. Base64 represents binary data using 64 printable ASCII characters, which makes it the standard way to embed data in JSON, XML, email (MIME), data URIs, and HTTP headers.',
      'This tool converts in both directions as you type and runs entirely client-side, so tokens, credentials, and payloads you paste are never transmitted anywhere.',
    ],
    features: [
      'Encode text to Base64 and decode Base64 to text',
      'Instant conversion as you type',
      'One-click copy of the result',
      'Fully client-side for privacy',
    ],
    faqs: [
      {
        question: 'What is Base64 encoding?',
        answer:
          'Base64 is a scheme that represents binary data using 64 printable characters (A–Z, a–z, 0–9, + and /). It lets arbitrary data travel safely through systems designed for plain text, such as email and JSON.',
      },
      {
        question: 'Is Base64 a form of encryption?',
        answer:
          'No. Base64 is an encoding, not encryption — anyone can decode it. Never rely on Base64 to protect secrets; use real encryption for sensitive data.',
      },
      {
        question: 'Why is Base64 output longer than the input?',
        answer:
          'Base64 encodes every 3 bytes of input as 4 characters of output, so encoded data is roughly 33% larger than the original.',
      },
    ],
  },

  'base64-file-encoder-decoder': {
    overview: [
      'Convert any file to a Base64 string, or decode a Base64 string back into a downloadable file. Base64-encoded files are commonly embedded in JSON APIs, data URIs, CSS, and email attachments.',
      'Images decoded from Base64 can be previewed directly in the tool. All reading, encoding, and decoding happens in your browser — files are never uploaded to a server.',
    ],
    features: [
      'Encode any file type to a Base64 string',
      'Decode Base64 back to a downloadable file',
      'Preview Base64-encoded images instantly',
      'Local processing — files are never uploaded',
    ],
    faqs: [
      {
        question: 'How do I convert a file to Base64?',
        answer:
          'Select or drop a file into the tool and it is read locally and converted to a Base64 string you can copy — for example to embed it in JSON or a data URI.',
      },
      {
        question: 'Can I turn a Base64 string back into a file?',
        answer:
          'Yes. Paste the Base64 string, and the tool decodes it into a file you can download. If the data is an image, you can preview it right in the browser.',
      },
      {
        question: 'Are my files uploaded anywhere?',
        answer:
          'No. Files are read with the browser’s FileReader API and processed entirely on your device — nothing is sent over the network.',
      },
      {
        question: 'Why is the Base64 version larger than my file?',
        answer:
          'Base64 represents every 3 bytes as 4 text characters, so the encoded string is about 33% larger than the original file. That is normal and expected.',
      },
    ],
  },

  'jwt-encoder-decoder': {
    overview: [
      'Decode, verify, and create JSON Web Tokens (JWTs) online. Paste a token to instantly inspect its header and payload as formatted JSON, verify its signature against your HMAC secret, or build and sign a new token from a JSON payload.',
      'Unlike server-based JWT tools, everything here happens in your browser — tokens and secrets are never transmitted, which makes it a safer way to debug authentication issues.',
    ],
    features: [
      'Decode JWT header and payload to readable JSON',
      'Verify token signatures with an HMAC shared secret',
      'Create and sign new tokens from a JSON payload',
      'Tokens and secrets never leave your browser',
    ],
    faqs: [
      {
        question: 'What is a JWT?',
        answer:
          'A JSON Web Token is a compact, URL-safe token made of three Base64Url-encoded parts — header, payload, and signature — commonly used for authentication and secure information exchange between services.',
      },
      {
        question: 'Is it safe to paste my JWT into this tool?',
        answer:
          'The token is decoded locally in your browser and never sent to a server. As general hygiene, still avoid sharing production tokens and secrets anywhere you don’t control.',
      },
      {
        question: 'Can this tool verify a JWT signature?',
        answer:
          'Yes. Enter the shared secret used to sign the token and the tool verifies the HMAC signature locally, telling you whether the token is authentic and untampered.',
      },
      {
        question: 'Why does my decoded JWT show readable data?',
        answer:
          'JWT payloads are Base64Url-encoded, not encrypted — anyone with the token can read its claims. The signature only proves integrity, so never put secrets in a JWT payload.',
      },
    ],
  },

  'url-encoder-decoder': {
    overview: [
      'Encode and decode URLs and URL components using percent-encoding. Special characters like spaces, ampersands, and question marks have reserved meanings in URLs — encoding converts them to %XX sequences so they can travel safely in query strings and paths.',
      'Choose Component mode (encodeURIComponent) for query-string values and path segments, or Full URL mode (encodeURI) to encode a complete URL while preserving its structure. Both directions run instantly and entirely in your browser.',
    ],
    features: [
      'Component mode using encodeURIComponent / decodeURIComponent',
      'Full URL mode using encodeURI / decodeURI',
      'Instant two-way conversion',
      'Client-side only — URLs are never logged',
    ],
    faqs: [
      {
        question: 'What is the difference between encodeURI and encodeURIComponent?',
        answer:
          'encodeURIComponent encodes every reserved character, making it right for individual values like query parameters. encodeURI leaves characters that are structurally meaningful in URLs (like /, ?, and &) intact, making it right for encoding a whole URL.',
      },
      {
        question: 'When do I need to URL-encode a value?',
        answer:
          'Whenever you place user data in a URL — query parameters, path segments, or fragments. Unencoded special characters can break the URL or change its meaning.',
      },
      {
        question: 'What is percent-encoding?',
        answer:
          'Percent-encoding replaces a character with a % followed by its byte value in hexadecimal — for example, a space becomes %20. It is the standard way (RFC 3986) to represent special characters in URLs.',
      },
    ],
  },

  'epoch-converter': {
    overview: [
      'Convert Unix epoch timestamps to human-readable dates and back. The tool supports both seconds and milliseconds, shows the live current epoch time, and can build a timestamp from individual date and time components in your local timezone or GMT.',
      'Epoch time — the number of seconds since 00:00:00 UTC on 1 January 1970 — is how most systems, databases, and APIs store time. This converter runs fully in your browser for instant results.',
    ],
    features: [
      'Convert epoch to date and date to epoch',
      'Supports seconds and milliseconds precision',
      'Live current epoch timestamp with one-click copy',
      'Build dates in local time or GMT',
    ],
    faqs: [
      {
        question: 'What is Unix epoch time?',
        answer:
          'Unix epoch time is the number of seconds elapsed since 00:00:00 UTC on January 1, 1970. It is a compact, timezone-independent way to represent a moment in time.',
      },
      {
        question: 'Is my timestamp in seconds or milliseconds?',
        answer:
          'Current Unix timestamps in seconds have 10 digits, while millisecond timestamps have 13. JavaScript’s Date.now() returns milliseconds; most Unix systems and APIs use seconds.',
      },
      {
        question: 'Does the converter handle timezones?',
        answer:
          'Yes. You can interpret and build dates in your local timezone or GMT, and the tool converts correctly between the two — the underlying epoch value is always UTC-based.',
      },
    ],
  },

  'json-to-csv-converter': {
    overview: [
      'Convert JSON to CSV online in seconds. Paste a JSON array of objects and get a CSV table with columns derived from your object keys — ready to download and open in Excel, Google Sheets, or any data pipeline.',
      'The conversion runs entirely in your browser, so exported API responses, database dumps, and reports stay on your device.',
    ],
    features: [
      'Converts JSON arrays of objects into CSV rows',
      'Column headers generated from object keys',
      'Download the result as a .csv file',
      'Private, client-side conversion',
    ],
    faqs: [
      {
        question: 'What JSON structure can be converted to CSV?',
        answer:
          'The natural fit is an array of objects, where each object becomes a row and its keys become the column headers — the typical shape of API responses and exports.',
      },
      {
        question: 'Can I open the result in Excel or Google Sheets?',
        answer:
          'Yes. Download the generated .csv file and open it directly in Excel, Google Sheets, Numbers, or any spreadsheet application.',
      },
      {
        question: 'Is my data uploaded during conversion?',
        answer:
          'No. The JSON you paste is parsed and converted to CSV locally in your browser and never sent to a server.',
      },
    ],
  },

  'yaml-json-converter': {
    overview: [
      'Convert YAML to JSON and JSON to YAML instantly. Essential for DevOps work where configuration moves between formats — Kubernetes manifests, Docker Compose files, CI/CD pipelines, Ansible playbooks, and Helm charts on one side; APIs and JavaScript tooling on the other.',
      'Both directions validate your input and report parse errors, so the converter doubles as a quick YAML/JSON syntax checker. Everything runs locally in your browser.',
    ],
    features: [
      'Two-way conversion: YAML → JSON and JSON → YAML',
      'Validates input and surfaces parse errors',
      'Great for Kubernetes, Docker Compose, and CI configs',
      'Client-side only — configs never leave your machine',
    ],
    faqs: [
      {
        question: 'What is the difference between YAML and JSON?',
        answer:
          'Both represent the same kinds of structured data. YAML is indentation-based and easier for humans to read and write (hence its use in config files), while JSON is stricter and universally supported by APIs and programming languages.',
      },
      {
        question: 'Will my data survive the conversion unchanged?',
        answer:
          'Values and structure are preserved in both directions. Note that YAML comments have no JSON equivalent, so they are dropped when converting YAML to JSON.',
      },
      {
        question: 'Is it safe to paste infrastructure configs here?',
        answer:
          'Yes. Conversion happens entirely in your browser — your manifests and configuration files are never uploaded or stored.',
      },
    ],
  },

  'html-preview': {
    overview: [
      'Write HTML and see the rendered result instantly. This live HTML previewer is a zero-setup sandbox for testing markup, inline CSS, and JavaScript snippets — ideal for prototyping components, checking email markup, or teaching HTML basics.',
      'Your code renders in an isolated preview right in the page. Nothing is uploaded: the editor and the preview both run locally in your browser.',
    ],
    features: [
      'Instant live preview as you type',
      'Supports HTML, CSS, and JavaScript snippets',
      'No account, setup, or build step required',
      'Runs fully in your browser',
    ],
    faqs: [
      {
        question: 'Can I use CSS and JavaScript in the preview?',
        answer:
          'Yes. Include <style> and <script> tags (or inline styles) in your snippet and they render and execute in the live preview.',
      },
      {
        question: 'Is my code sent to a server?',
        answer:
          'No. The preview is rendered locally in your browser, so your code never leaves your device.',
      },
      {
        question: 'What is an HTML previewer useful for?',
        answer:
          'Quickly testing snippets without creating files, prototyping layout ideas, debugging markup, checking HTML email fragments, and learning HTML/CSS interactively.',
      },
    ],
  },

  'markdown-preview': {
    overview: [
      'Write Markdown and see it rendered live. The previewer supports the everyday Markdown you use in READMEs and docs — headings, emphasis, lists, links, images, blockquotes, tables, and code blocks.',
      'It is a fast way to draft GitHub READMEs, documentation, and notes with immediate visual feedback, all rendered locally in your browser.',
    ],
    features: [
      'Live rendering as you type',
      'Supports headings, lists, tables, links, and code blocks',
      'Great for drafting READMEs and documentation',
      'Client-side only — your text is never uploaded',
    ],
    faqs: [
      {
        question: 'What Markdown syntax is supported?',
        answer:
          'The common Markdown building blocks: headings, bold and italic text, ordered and unordered lists, links, images, blockquotes, inline code, fenced code blocks, and tables.',
      },
      {
        question: 'Can I preview a GitHub README here?',
        answer:
          'Yes. Paste your README.md content to check structure, tables, and code blocks before committing. Rendering may differ slightly from GitHub for advanced GitHub-specific extensions.',
      },
      {
        question: 'Is my text stored anywhere?',
        answer:
          'No. Rendering happens locally in your browser and your text is never transmitted or saved to a server.',
      },
    ],
  },

  'regex-tester': {
    overview: [
      'Test and debug regular expressions in real time. Enter a pattern and a test string to see matches highlighted instantly, along with detailed match information including capture groups.',
      'The tester uses the JavaScript (ECMAScript) regex engine — the same one that runs in Node.js and every browser — so what works here works in your JS code. Patterns and test data stay on your device.',
    ],
    features: [
      'Live match highlighting as you type',
      'Shows capture groups and match details',
      'Standard JavaScript regex flags',
      'Client-side only — test data never leaves your browser',
    ],
    faqs: [
      {
        question: 'Which regex flavor does this tester use?',
        answer:
          'The JavaScript (ECMAScript) flavor, as implemented by your browser. Patterns validated here behave identically in Node.js and frontend JavaScript.',
      },
      {
        question: 'What are regex flags?',
        answer:
          'Flags modify how a pattern matches — for example g finds all matches instead of the first, i makes matching case-insensitive, and m changes how ^ and $ behave across lines.',
      },
      {
        question: 'What are capture groups?',
        answer:
          'Parentheses in a pattern create capture groups that extract sub-parts of a match — like pulling the year, month, and day out of a date string. The tester shows each group’s captured value.',
      },
    ],
  },

  'json-compare': {
    overview: [
      'Compare two JSON documents and see exactly what changed. The diff highlights added, removed, and modified values, making it easy to spot differences between API responses, configuration versions, or environment settings.',
      'Comparison is structural — it understands JSON objects and arrays rather than raw text — and runs entirely in your browser, so both documents stay private.',
    ],
    features: [
      'Structural diff of two JSON documents',
      'Highlights added, removed, and changed values',
      'Useful for API responses and config drift',
      'Private, client-side comparison',
    ],
    faqs: [
      {
        question: 'How does JSON compare differ from a text diff?',
        answer:
          'A text diff compares lines, so formatting changes create noise. A JSON compare parses both documents and diffs their actual structure, showing only real changes to keys and values.',
      },
      {
        question: 'What can I use a JSON diff for?',
        answer:
          'Comparing API responses across versions or environments, reviewing configuration changes, debugging serialization issues, and verifying data migrations.',
      },
      {
        question: 'Is my JSON kept private?',
        answer:
          'Yes. Both documents are parsed and compared locally in your browser — nothing is uploaded or stored.',
      },
    ],
  },
};
