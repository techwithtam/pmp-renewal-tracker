# PMP renewal tracker

Plan webinars that apply to your work and track the professional development units (PDUs) you need to renew your PMP. Use it for a year-end target or throughout your 3-year renewal cycle.

When I planned my own renewal, I gave AI a description of my consulting work and asked it to look for webinars I could apply to client projects. That gave me a watchlist of 60 sessions. If you're going to spend an hour on a webinar, it helps to know where you could use what you learn.

## Set up your tracker

1. [Download the tracker ZIP](https://github.com/techwithtam/pmp-renewal-tracker/releases/latest/download/pmp-renewal-tracker.zip) and unzip it. Open `index.html` in Chrome. Keep the files in the same folder.
2. Open [PMI's Continuing Certification Renewal System (CCRS)](https://ccrs.pmi.org/). In **Renewal cycle**, enter your cycle start and renewal dates and the PDUs PMI has already posted for that cycle. Include only credits you plan to keep as a starting balance. If you track one of those activities individually, remove its credits from the starting balance.
3. Select **Add activity** to enter webinars or other education activities yourself. Use **Import watchlist** if you want to add a list from your AI assistant.

The tracker saves records in the browser where you open it. Use **Download backup** before moving the folder, changing browsers, clearing browser data, or starting a new cycle. **Restore backup** loads the saved cycle and activities. The tracker itself is free and runs without an account. Webinar access depends on the provider.

## Find webinars you can use at work

Attach [SKILL.md](SKILL.md) to an AI chat that can search the web, or paste the file's contents into the chat. Start with a request like this and replace the details with your own.

> Help me plan my PMP renewal. I'll give you my cycle dates, posted PDU balances and the time I have each week. I run an operations consultancy for small manufacturers. We help clients onboard suppliers and improve inventory processes. Look for webinars I can apply to those projects, especially supplier risk and handoffs. Show me the PMP credit split, whether I can access each recording, and what I could use from it. Once I've reviewed the list, give me a JSON watchlist I can import.

Use a general description of your services, client types and current projects. Keep client names and confidential documents out of the prompt. If your AI can't open a webinar page, give it the public source link and the PMP credit breakdown you see on the page. Review the links and allocations before importing. [See an example watchlist](examples/watchlist.json). Its sessions and links are fictional.

## Use Claude

You can paste the instructions into Claude for a single renewal plan. To reuse them, [download the skill ZIP](https://github.com/techwithtam/pmp-renewal-tracker/releases/latest/download/pmp-renewal-tracker-skill.zip) and upload it under **Customize > Skills**. Give Claude your work context and ask it to create the watchlist. Download the JSON file and import it into the browser tracker. If Claude returns JSON in the chat, save it as a plain-text file with a `.json` extension. [Claude's skill setup guide](https://support.claude.com/en/articles/12512180-use-skills-in-claude)

If you want the tracker inside Claude, give it `index.html`, `tracker.css` and `tracker.js` and ask it to adapt them into an Artifact. On plans with Artifact storage, ask Claude to use personal storage for dates, balances and activities. Test with sample data and reopen the Artifact to check that your changes persist. [Claude's Artifact storage guide](https://support.claude.com/en/articles/17153992-what-are-artifacts-and-how-do-i-use-them#store-data-in-an-artifact)

## Track completion and reconcile with PMI

Record the completed date after watching a webinar. Fill in **Posted date in CCRS** once its credits appear there. The tracker shows completed activities awaiting confirmation and uses posted credits to calculate what you still need.

PMI requires 60 PDUs per PMP renewal cycle, including at least 35 Education PDUs and at least 8 Education PDUs in each Talent Triangle area. Up to 25 PDUs can come from Giving Back. Report claims that require manual submission and complete your renewal in CCRS. [PMI renewal requirements](https://www.pmi.org/certifications/certification-resources/maintain)

## License

Created by [Tech With Tam](https://techwithtam.com). Released under the [MIT License](LICENSE). See [NOTICE.md](NOTICE.md) for source and trademark information.
