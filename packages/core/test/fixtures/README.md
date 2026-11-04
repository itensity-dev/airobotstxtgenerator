# Test fixtures

## `real/` — robots.txt files of large sites

46 robots.txt files of news sites, platforms, publishers and public institutions, as captured in
**October 2026** by the archive [samber/the-great-gpt-firewall](https://github.com/samber/the-great-gpt-firewall)
(MIT License, Copyright (c) 2024 Samuel Berthe), directory `2026/2026-10-robots.txt`, commit of 2026-11-01.
Files are stored byte-for-byte (BOMs, CRLF line endings and oversize files included).

## `real-expected.json` — reference verdicts

For every file, 31 user-agents (AI crawlers, search engines, an unknown bot) and a list of paths
(15 fixed paths plus up to 60 paths derived from the file's own patterns) were evaluated with
**Google's reference parser** ([google/robotstxt](https://github.com/google/robotstxt) `robots.cc`,
Apache-2.0) compiled with the batch driver in `../reference/driver.cc`:

```bash
g++ -std=c++17 -O2 -o gref robots.cc driver.cc -labsl_strings -labsl_raw_logging_internal -labsl_throw_delegate
printf 'GPTBot\thttps://example.com/path\n' | ./gref site.robots.txt   # prints 1 (allowed) or 0
```

`verdicts[agent]` is a string of `1`/`0`, one character per entry in `paths`.
`real-sites.test.ts` checks that `@airobots/core` returns exactly the same answers.
