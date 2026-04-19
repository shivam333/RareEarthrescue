# Rare Earth Rescue

## Landing Page PRD

### Document purpose
This document reverse engineers the current Rare Earth Rescue landing page into a product requirements document focused only on the homepage experience. The page is currently designed as a full-page desktop scroll journey where each major section behaves like its own screen. Each scroll screen below is captured as one product subsection.

### Product summary
Rare Earth Rescue is a B2B marketplace and digital infrastructure layer for recycled rare earth supply chains. The landing page is intended to convert industrial suppliers, recyclers, procurement teams, and strategic partners by making the platform feel credible, commercially serious, and operationally useful.

### Landing page goals
- Explain what Rare Earth Rescue is within the first screen.
- Establish trust quickly through industrial visuals, verification language, and market signals.
- Show that the product is more than a listing site: it also supports intelligence, logistics, and transaction execution.
- Drive qualified users into one of three primary conversion paths: explore marketplace, list feedstock, or join as recycler.
- Position rare earth recycling as strategically important, not just environmentally positive.

### Primary audiences
- Scrappers and feedstock suppliers
- Rare earth recyclers and processors
- OEM procurement and circularity teams
- Strategic partners, investors, and supply chain stakeholders

### Core landing page conversion actions
- Explore Marketplace
- List Feedstock
- Join as Recycler
- Request a Demo

### Experience model
On desktop, the landing page behaves like a sequence of full-screen slides. On smaller devices, the same content falls back to standard scrolling. The PRD below treats each desktop scroll panel as one discrete subsection.

---

## 1. Hero Screen

### Purpose
Introduce the company, category, and value proposition immediately. This screen should answer who the platform is for, what it does, and why it is differentiated.

### User problem addressed
Visitors need instant clarity that this is a serious industrial marketplace for rare-earth-bearing scrap, not a generic sustainability startup page.

### Core message
Trade rare-earth-bearing scrap with verified industrial buyers.

### Required content
- Brand identity for Rare Earth Rescue
- Eyebrow positioning around circular critical mineral supply chains
- Primary headline
- Short subheadline explaining suppliers, scrappers, aggregators, and processors
- Three CTAs:
  - Explore Marketplace
  - List Feedstock
  - Join as Recycler
- Supporting image strip:
  - shiny high-value metals
  - motors or industrial equipment
  - scrapyard recovery imagery
- Premium visual module showing:
  - supply network map
  - featured listing card
  - bid activity signal
  - pricing signal

### Functional requirements
- CTA buttons must route to the correct destination pages.
- Hero cards must feel live, even if powered by mocked data.
- Visual hierarchy should keep the headline dominant.
- Section should support reveal animation on load.

### Interaction requirements
- Hero reveal animation on first view
- Subtle pulsing or glowing map nodes
- Hover lift on floating cards

### Success criteria
- Users understand the marketplace model within 5 seconds.
- At least one primary CTA is visible without additional interaction.
- The screen signals premium enterprise quality and industrial credibility.

---

## 2. Credibility Metrics Screen

### Purpose
Provide immediate proof that the marketplace has depth, scale, and market participation.

### User problem addressed
Industrial users will not trust a new platform unless there are strong signals of network density and activity.

### Core message
The marketplace has enough participants, category coverage, and geographic reach to matter.

### Required content
- Verified suppliers count
- Recycler buyers count
- Feedstock category count
- Matched transaction volume
- Countries served

### Functional requirements
- Metrics must animate into view.
- Values should be readable in a single glance.
- Layout should work as a horizontal strip on desktop and stacked layout on smaller screens.

### Interaction requirements
- Count-up animation triggered on entry

### Success criteria
- Users perceive the platform as established and growing.
- Metrics support the legitimacy of the preceding hero claims.

---

## 3. Why This Matters Screen

### Purpose
Frame the industry pain and strategic urgency that justify the existence of the marketplace.

### User problem addressed
Visitors may understand rare earth value broadly but not why a dedicated feedstock marketplace is needed.

### Core message
Rare earth feedstock is valuable, fragmented, and strategically under-coordinated.

### Required content
- Intro copy on fragmented supply and inconsistent characterization
- Four pain-point cards:
  - Fragmented supply
  - Opaque quality
  - Weak price discovery
  - Critical mineral pressure

### Functional requirements
- Problem cards should be easy to scan in any order.
- Copy must remain concise and operator-focused.
- The section should visually contrast with the hero by shifting from aspiration to problem definition.

### Interaction requirements
- Staggered reveal of cards
- Hover response on individual problem cards

### Success criteria
- Users understand why the category needs structured digital infrastructure.
- The section creates urgency without feeling alarmist.

---

## 4. Marketplace Workflow Screen

### Purpose
Show how the marketplace works for both sides of the network.

### User problem addressed
Visitors need to know whether the platform fits their operational role.

### Core message
The product supports two-sided industrial sourcing for suppliers and recyclers.

### Required content
- Section headline
- Role toggle:
  - For Suppliers
  - For Recyclers
- Four-step workflow for each role

### Functional requirements
- Tab switch must update visible workflow content instantly.
- Each workflow step should be short, concrete, and operational.
- Copy should reflect real material handling, metadata, bidding, and logistics processes.

### Interaction requirements
- Smooth tab transition
- Active state styling for selected role
- Reveal animation for timeline blocks

### Success criteria
- A supplier can see how to list material.
- A recycler can see how to discover and procure feedstock.
- Users identify which path is relevant to them without confusion.

---

## 5. Feedstock Categories Screen

### Purpose
Demonstrate domain specificity by showing that the marketplace is built around actual rare-earth-bearing feedstock, not generic scrap.

### User problem addressed
Users need confidence that the platform understands category nuance and material quality variability.

### Core message
The marketplace is built around real rare-earth-bearing material streams and their commercial characteristics.

### Required content
- Intro headline
- Visual showcase block
- Feedstock cards for:
  - NdFeB magnet scrap
  - SmCo magnet scrap
  - Electric and traction motors
  - HDD magnet assemblies
  - MRI and industrial equipment magnets
  - Powders, fines, and manufacturing residues

### Card content requirements
- Category label
- Short description
- Typical source
- Form factor
- Quality note

### Functional requirements
- Cards should be reusable and data-driven.
- Content must reflect actual sourcing and processing complexity.
- The section should visually reinforce industrial specificity.

### Interaction requirements
- Reveal-on-scroll
- Hover lift on feedstock cards

### Success criteria
- Users immediately see that the product is tailored to rare earth recovery.
- The section builds trust with technical and commercial buyers.

---

## 6. Marketplace Listings Preview Screen

### Purpose
Show what actual marketplace discovery looks like in the product.

### User problem addressed
Users want to understand the interface quality and the level of listing detail before engaging.

### Core message
Rare Earth Rescue offers institutional-grade discovery for fragmented feedstock supply.

### Required content
- Headline and supporting copy
- Filter chips for category and listing attributes
- Marketplace preview table with example listings
- CTA to full marketplace page

### Listing requirements
Each listing row should show:
- Material title
- Quantity
- Location
- Form
- Verification status
- Action link

### Functional requirements
- Table must feel premium and highly readable.
- Example listings must reflect realistic rare earth recovery scenarios.
- Filter chips should show interaction affordance, even if not yet backed by full filtering logic.

### Interaction requirements
- Hover state on rows
- Chip selection state
- CTA to view marketplace

### Success criteria
- Users can visualize how they would browse or list material.
- The preview increases trust in product depth and usability.

---

## 7. Pricing Intelligence Screen

### Purpose
Position the platform as a market intelligence layer, not just a listing board.

### User problem addressed
Buyers and sellers need pricing context, supply visibility, and category demand signals to transact confidently.

### Core message
The marketplace includes procurement intelligence for rare earth recycling.

### Required content
- Headline and supporting copy
- Button to open pricing modal
- Data widgets for:
  - monthly listed tonnage
  - average bid spread
  - supplier concentration by region
  - top demanded categories

### Functional requirements
- Charts should feel institutional and credible.
- Widgets should use restrained motion and premium styling.
- The pricing modal must open and close cleanly.

### Interaction requirements
- Reveal animations
- Hover lift on widgets
- Modal open and close behavior for pricing explanation

### Success criteria
- Users understand that the company provides data advantage in addition to transaction access.
- The screen elevates brand credibility with investors and procurement teams.

---

## 8. Trust and Verification Screen

### Purpose
Reduce perceived transaction risk and reinforce operational seriousness.

### User problem addressed
B2B industrial transactions require trust in counterparties, material classification, and documentation.

### Core message
Rare Earth Rescue reduces friction across quality, credibility, and execution.

### Required content
- Verification and trust cards covering:
  - verified onboarding
  - material classification standards
  - assay and sampling support
  - traceability reporting

### Functional requirements
- Trust items should read like platform capabilities, not marketing fluff.
- Content should support both supplier trust and buyer trust.

### Interaction requirements
- Reveal on entry
- Hover response on cards

### Success criteria
- Users believe the platform is safer and more executable than informal broker networks.
- Trust becomes a product feature, not just a claim.

---

## 9. Logistics and Transactions Screen

### Purpose
Show that the platform supports execution after a match is made.

### User problem addressed
Industrial marketplaces often fail after discovery because logistics, documents, and settlement are not handled well.

### Core message
The platform supports the full transaction path, not just the match.

### Required content
- Four-step execution flow:
  - Listing
  - Pickup
  - Delivery
  - Settlement

### Functional requirements
- Flow should be visually linear and easy to parse.
- Each stage must map to a real operational support layer.

### Interaction requirements
- Reveal animation across the flow line
- Optional hover emphasis on each stage

### Success criteria
- Users understand that Rare Earth Rescue can help move deals through completion.
- The screen lowers perceived complexity around cross-party coordination.

---

## 10. Strategic Importance Screen

### Purpose
Tie the marketplace to the larger macro theme of supply resilience and critical mineral security.

### User problem addressed
Executives and strategic stakeholders need the “why now” story in one concise screen.

### Core message
Rare earth recycling matters because supply resilience matters.

### Required content
- Short strategic paragraph referencing:
  - electrification
  - wind
  - robotics
  - electronics
  - defense
  - reduced dependence on virgin extraction

### Functional requirements
- Keep this section concise and high signal.
- Tone should be strategic and commercially grounded.

### Interaction requirements
- Subtle reveal only

### Success criteria
- The platform reads as relevant to geopolitics and industrial strategy, not just recycling operations.

---

## 11. Industry Participants Screen

### Purpose
Translate the marketplace value proposition into role-specific relevance.

### User problem addressed
Different participant groups need to see themselves reflected in the product.

### Core message
The platform is purpose-built for each participant in the rare earth recycling ecosystem.

### Required content
- Participant tabs:
  - Auto dismantlers
  - E-waste recyclers
  - Motor recyclers
  - OEM procurement teams
- For each tab:
  - pain point
  - platform value
  - example use case

### Functional requirements
- Tab content should update cleanly.
- Example use cases should feel realistic and operational.
- Structure should be reusable for future participant categories.

### Interaction requirements
- Smooth tab switching
- Active state styling
- Reveal animation on panel entry

### Success criteria
- Users find a persona path that feels directly relevant.
- Stakeholders can quickly map the product to their business context.

---

## 12. Testimonials and Credibility Screen

### Purpose
Add social proof and soften the shift into conversion.

### User problem addressed
Visitors want evidence that real operators and strategic users would trust this platform.

### Core message
The platform is built for commercial operators, not generic sustainability storytelling.

### Required content
- Three testimonials from:
  - operations / scrapyard or ITAD perspective
  - recycler procurement perspective
  - OEM or sustainability perspective
- Partner / network logo row

### Functional requirements
- Testimonials should feel commercially literate.
- Placeholder logos should be visually balanced and enterprise-appropriate.

### Interaction requirements
- Card reveal
- Hover lift on testimonials

### Success criteria
- Visitors perceive adoption potential and category relevance.
- Social proof supports, rather than overwhelms, the conversion path.

---

## 13. Final CTA Screen

### Purpose
Convert intent after the narrative arc is complete.

### User problem addressed
Users who understand the product need a direct next step without friction.

### Core message
List feedstock, become a verified recycler, or request a demo.

### Required content
- Headline
- Supporting eyebrow
- CTA buttons:
  - List Your Feedstock
  - Become a Verified Recycler
  - Request a Demo

### Functional requirements
- CTAs must be visually prominent.
- The section should feel decisive and uncluttered.

### Interaction requirements
- Reveal animation
- Button hover states

### Success criteria
- Users leave the landing page through a relevant high-intent action.
- The final screen cleanly closes the narrative and invites action.

---

## 14. Footer Screen

### Purpose
Provide secondary navigation, brand reinforcement, and legal/company links.

### User problem addressed
Users arriving at the end of the page may want to navigate elsewhere or validate company legitimacy.

### Core message
Rare Earth Rescue is the digital infrastructure layer for circular critical mineral supply chains.

### Required content
- Brand block
- Marketplace links
- Participant links
- Company links
- Follow links

### Functional requirements
- Footer must be scannable and clean.
- Links should support all core site destinations.

### Success criteria
- Footer provides confidence, orientation, and access to secondary paths without competing with the primary CTA.

---

## Cross-screen UX requirements

### Motion
- Desktop should support section-by-section snap scrolling.
- Motion should remain restrained and premium.
- Use reveal, count-up, hover-lift, and tab transitions.
- Avoid overly playful or distracting effects.

### Visual direction
- Premium industrial-tech aesthetic
- Dark enterprise palette with restrained blue and teal accents
- Strong whitespace and hierarchy
- Visuals should imply materials, heavy industry, recovery, and intelligence

### Content principles
- Concise, credible, operator-focused copy
- Minimal greenwashing language
- Specificity around materials, verification, and logistics
- Messaging should balance commercial value and strategic circularity

### Accessibility
- Clear heading hierarchy
- Sufficient contrast
- Keyboard-accessible controls for tabs, buttons, and modal interactions
- Reduced-motion users should not be forced into animated section snapping

---

## Open product questions
- Should the metrics screen remain its own scroll page, or be folded into the hero for a tighter first impression?
- Should the strategic importance screen become more visual, for example with demand sectors or a map-based module?
- Should the testimonials screen remain on the landing page, or be reduced in favor of a stronger conversion screen?
- Which of the current interactive elements should remain decorative versus become data-backed in later phases?

---

## Recommended next product step
Convert this landing-page PRD into a v2 content and design brief by assigning a single primary user intent to every screen:
- trust building
- education
- role relevance
- product proof
- conversion

That will make the next iteration sharper and help us simplify any screens that are currently carrying too many jobs at once.
