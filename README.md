# PMP renewal tracker

Plan webinars that apply to your work and track the professional development units (PDUs) you need to renew your PMP. Use it for a year-end target or throughout your 3-year renewal cycle.

When I planned my own renewal, I gave AI a description of my consulting work and asked it to look for webinars I could apply to client projects. That gave me a watchlist of 60 sessions. If you're going to spend an hour on a webinar, it helps to know where you could use what you learn.

## Set up with ChatGPT or Claude

Copy this request into ChatGPT or Claude.

> Help me set up my PMP renewal tracker using https://github.com/techwithtam/pmp-renewal-tracker. Read the README and SKILL.md. Help me open the tracker and enter my cycle dates and posted PDUs. Ask about my work and help me find webinars I can use. After I review the list, create `pmp-watchlist.json` and show me where to import it.

- **ChatGPT.** Ask it to search for the original webinar pages so it can verify the PMP credit breakdown. [ChatGPT search](https://help.openai.com/en/articles/9237897-chatgpt-search)
- **Claude.** Use a chat with web search. To reuse the watchlist instructions in future chats, install the optional Claude skill ZIP below.

If your assistant can't open the repository, paste the contents of [SKILL.md](SKILL.md) into the chat and follow the tracker setup steps below.

## Downloads

- The tracker ZIP contains the app. Unzip it, keep the files together, and open `index.html` in Chrome. [Download pmp-renewal-tracker.zip](https://github.com/techwithtam/pmp-renewal-tracker/releases/latest/download/pmp-renewal-tracker.zip)
- The optional Claude skill ZIP contains the watchlist instructions. Upload it in Claude under **Customize > Skills** to reuse the instructions in future chats. [Download pmp-renewal-tracker-skill.zip](https://github.com/techwithtam/pmp-renewal-tracker/releases/latest/download/pmp-renewal-tracker-skill.zip) · [Claude's skill setup guide](https://support.claude.com/en/articles/12512180-use-skills-in-claude)

## Set up your tracker

1. Look up your cycle start, renewal date, and posted PDUs in [PMI's Continuing Certification Renewal System (CCRS)](https://ccrs.pmi.org/).
2. Enter those details under **Renewal cycle** and select **Save cycle**. If you later add an activity that PMI has already credited, subtract those PDUs from the starting balance so the tracker counts them once.

Select **Add activity** to enter webinars or other education activities yourself. The tracker is free and runs without an account. Webinar access depends on the provider.

## Create your watchlist

Tell ChatGPT or Claude what services you offer, who you work with, and which projects or decisions you want help with. Leave out client names and confidential details.

> Help me plan my PMP renewal. I'll give you my cycle dates, posted PDU balances, and the time I have each week. I run an operations consultancy for small manufacturers. We help clients onboard suppliers and improve inventory processes. Find webinars I can apply to those projects, especially supplier risk and handoffs. For each webinar, show the PMP credit split, any access requirements, and how I could use what I learn. After I review the list, create a downloadable file named `pmp-watchlist.json`.

Review the proposed webinars and their PDU breakdowns. If your assistant can't open a webinar page, give it the source link and the PMP credit breakdown you see on the page. Once you've approved the list, ChatGPT or Claude creates `pmp-watchlist.json` with the webinars you selected. [See a fictional example](examples/watchlist.json)

## Import the watchlist

1. Download `pmp-watchlist.json` from your chat. If your assistant returns the JSON as text, save it as a plain-text file with a `.json` extension.
2. In the tracker, go to **Webinar watchlist**, select **Import watchlist**, and choose the `.json` file.

The tracker adds new webinars as planned activities and preserves progress for webinars you've already added.

## Track completion and reconcile with PMI

Record the completed date after watching a webinar. Fill in **Posted date in CCRS** once its credits appear there. The tracker shows completed activities awaiting confirmation and uses posted credits to calculate what you still need.

PMI requires 60 PDUs per PMP renewal cycle, including at least 35 Education PDUs and at least 8 Education PDUs in each Talent Triangle area. Up to 25 PDUs can come from Giving Back. Report claims that require manual submission and complete your renewal in CCRS. [PMI renewal requirements](https://www.pmi.org/certifications/certification-resources/maintain)

## Back up your progress

The tracker saves records in the browser where you open it. Use **Download backup** before moving the folder, changing browsers, clearing browser data, or starting a new cycle. Use **Restore backup** to load a saved cycle and its activities.

## Host your tracker

### ChatGPT Sites

If you have access to Sites, open **Work** in ChatGPT and mention **@Sites**, or use the Sites plugin in Codex. Give it this repository and ask it to adapt the tracker into a private Site. A Site with ChatGPT sign-in and a Cloudflare D1 database can save progress to your account so you can access it from another device. [ChatGPT Sites setup](https://help.openai.com/en/articles/20001339-creating-and-using-chatgpt-sites)

> Build a private PMP renewal tracker website from https://github.com/techwithtam/pmp-renewal-tracker. Use ChatGPT sign-in and Cloudflare D1 to save renewal dates, PDU balances, and watchlist progress for each signed-in user. Keep the JSON watchlist import and backup. Show me a preview and test with sample data before I deploy it.

### Claude Artifacts

Give Claude `index.html`, `tracker.css`, and `tracker.js` and ask it to adapt the tracker into an Artifact. On plans with Artifact storage, ask Claude to use personal storage for dates, balances, and activities. Test with sample data and reopen the Artifact to check that your changes persist. [Claude's Artifact storage guide](https://support.claude.com/en/articles/17153992-what-are-artifacts-and-how-do-i-use-them#store-data-in-an-artifact)

## License

Created by [Tech With Tam](https://techwithtam.com). Released under the [MIT License](LICENSE). See [NOTICE.md](NOTICE.md) for source and trademark information.
