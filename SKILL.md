---
name: pmp-renewal-tracker
description: Plan a PMP renewal, find webinars that apply to the user's work, and create a JSON watchlist for the PMP renewal tracker.
---

# Plan a PMP renewal

Help the user find education they can apply to their work and check whether it covers their outstanding PMP renewal requirements.

## Get the dates, balances and work context

Ask for the missing details that affect the plan.

- The cycle start and renewal dates from PMI's Continuing Certification Renewal System (CCRS). Ask when the user wants to finish if that date is earlier, such as a year-end target.
- Posted Education PDUs in Ways of Working, Power Skills and Business Acumen, plus posted Giving Back PDUs for the same cycle. Use confirmed credits once. List completed activities awaiting posting separately and check for activities the user has already claimed or included in the tracker.
- The user's role, the services they deliver, the types of clients or teams they work with and the projects or decisions they want help with. A short description is enough. Use general descriptions and public information. Leave client names, confidential files and account credentials out of the request.
- Time available per week and any access limits, such as free recordings only or an existing PMI membership.

If the user only wants to record progress, help them set up the tracker with their dates and posted balances. Webinar research is optional.

## Check the credit gaps

Check [PMI's current PMP renewal requirements](https://www.pmi.org/certifications/certification-resources/maintain). PMI currently requires 60 total PDUs, at least 35 Education PDUs and at least 8 Education PDUs in each of the 3 Talent Triangle areas. Giving Back can contribute up to 25 PDUs.

Show the posted amount and the remaining gap for each requirement. For an education-only plan, the minimum additional Education PDUs is the largest of the total PDU gap, the Education PDU gap and the sum of the three Talent Triangle gaps. The watchlist still needs to cover each individual area. Show projected totals separately from posted balances.

## Verify and rank webinars

Search the [ProjectManagement.com on-demand catalog](https://www.projectmanagement.com/webinars/webinarmainondemand.cfm) or other providers the user can access. Turn the user's work context into search topics. For example, someone who coordinates contractors and struggles with handoffs might look for stakeholder communication and supplier risk.

Open each session's original page. Record its title, direct link, duration, PMP eligibility, PDU total and allocation across the 3 areas. Check the PMP or PMP/PgMP row when the provider lists more than one credential. Use the published PDU amounts. If the page or credit split is unavailable, list the session as a candidate outside the credit plan. Ask the user to confirm access when it depends on their account.

Prioritize sessions that cover an outstanding requirement and help with a specific project, decision or recurring problem. For each one, explain one way the user could apply it. Use the provider description as evidence of the topic and frame the application as a suggestion. Deduplicate sessions by title and source link.

Propose dates within the cycle and the user's available time. Leave time for reporting and follow-up. ProjectManagement.com asks users to allow 7 to 10 business days for eligible auto-reported PDUs to appear. Check how each provider reports credits. If the schedule or verified sessions can't cover the gaps, show the shortfall. [ProjectManagement.com reporting guidance](https://www.projectmanagement.com/pages/246882/pdus-on-projectmanagement-com)

## Create the import file

Show the proposed list and category totals for review. After the user confirms which sessions to include, create `pmp-watchlist.json` as a file or return the raw JSON so they can save it.

Use this format. The entry below is fictional.

```json
{
  "format": "pmp-watchlist-v1",
  "activities": [
    {
      "title": "Reducing supplier handoff delays",
      "url": "https://example.com/webinars/supplier-handoffs",
      "waysOfWorking": 0.75,
      "powerSkills": 0.25,
      "businessAcumen": 0,
      "application": "Use the handoff checklist to review how new suppliers are onboarded."
    }
  ]
}
```

Use nonnegative JSON numbers with at most 2 decimal places. Include all 3 credit fields, even when a value is 0. Use the verified source URL. Include `plannedDate` in `YYYY-MM-DD` format if the user wants a specific date. Omit it if the schedule is undecided. The tracker imports each row as planned and keeps any progress already recorded for duplicate activities.

Have the user select **Import watchlist** in the tracker and choose the file. They record the completed date after the activity and the posted date after checking CCRS. The user submits any manual claims and completes renewal in CCRS.
