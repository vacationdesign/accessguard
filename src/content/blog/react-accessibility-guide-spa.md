---
title: "React Accessibility: How to Build Accessible Single-Page Applications"
description: "Build accessible React apps with proper focus management, ARIA patterns, and keyboard navigation. A practical guide to SPA accessibility for developers."
date: 2026-02-25
author: A11yScope Team
tags: [React, Accessibility, SPA, JavaScript]
---

# React Accessibility: How to Build Accessible Single-Page Applications

Single-page applications built with React deliver fast, fluid user experiences by updating the DOM in place rather than loading full pages from the server. That architectural choice is also the source of nearly every accessibility problem SPAs introduce. When navigation happens without a page reload, the browser does not fire the events that assistive technologies depend on to announce new content, reset focus, or update the reading position. The result is that a screen reader user clicking a link in a React app may hear nothing at all  Eno page title announcement, no shift in context, no indication that anything changed.

This is not a niche concern. According to the WebAIM Million analysis, React-based sites consistently show higher rates of detected accessibility errors than the average across all sites surveyed. The framework itself is not the problem  EReact supports accessible markup as well as any UI library can  Ebut the patterns that developers reach for by default tend to break accessibility in ways that are invisible during sighted, mouse-driven testing.

This guide covers the specific accessibility challenges that React single-page applications create and provides concrete patterns to solve each one. It is written for agency developers building client projects where WCAG 2.1 AA compliance is a deliverable, not a nice-to-have.

## Why Single-Page Applications Break Accessibility

Traditional multi-page websites get a significant amount of accessibility behavior for free from the browser. When a user clicks a link and the browser loads a new page, several things happen automatically: the page title is announced by screen readers, focus moves to the top of the document, the browser's loading indicator fires, and the scroll position resets. Users who rely on assistive technology have decades of muscle memory built around this navigation model.

React applications using client-side routing  Ewhether through React Router, Next.js, or any other routing library  Ereplace that entire sequence with a JavaScript-driven DOM update. The URL changes via the History API, the component tree re-renders, and the new content appears on screen. But from the perspective of a screen reader, nothing happened. The browser did not navigate. The assistive technology received no navigation event. The user's focus remains wherever it was before they activated the link.

This creates three core problems that every React SPA must solve explicitly.

### Silent Route Changes

When a sighted user clicks a navigation link in a React app, they see the page content change and understand that navigation occurred. A screen reader user hears nothing. The link activation event fires, but because no real page load occurs, the screen reader has no reason to announce anything new. The user is left wondering whether their action had any effect.

### Orphaned Focus

After a client-side route change, the user's keyboard focus remains on the element they just activated  Eoften a navigation link that is still present in the DOM. If the navigation link is removed during the route change (because it was part of a mobile menu that closed, for example), focus falls to the `<body>` element, which means the user must Tab through the entire page from the beginning to reach the new content.

### Dynamic Content Without Context

React applications frequently update portions of the page without any user-initiated action  Eloading spinners, toast notifications, real-time data updates, form validation messages. When these changes happen in the DOM but are not communicated to assistive technology, users miss critical information. A form error message that appears visually below an input field is useless to a screen reader user if nothing announces its arrival.

## Managing Focus on Route Changes

Focus management after client-side navigation is the single most important accessibility fix for any React SPA. Without it, keyboard and screen reader users lose their place in the document on every page transition.

### The Focus-on-Content Pattern

The most reliable pattern is to move focus to the main content area after each route change. This mimics what the browser does on a full page load  Eplacing the user at the beginning of the new content  Eand it works consistently across screen readers.

```jsx
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

function MainContent({ children }) {
  const contentRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.focus();
    }
  }, [location.pathname]);

  return (
    <main ref={contentRef} tabIndex={-1} id="main-content">
      {children}
    </main>
  );
}
```

The `tabIndex={-1}` attribute makes the `<main>` element programmatically focusable without adding it to the Tab order. When the route changes, the `useEffect` hook fires and moves focus to the start of the new content. Screen readers will begin reading from this point.

A few important details make this pattern work correctly:

- **Remove the focus outline on the main element.** Since this is a non-interactive element receiving programmatic focus, add `outline: none` to avoid a visible focus ring that would confuse sighted users. Only do this for elements with `tabIndex={-1}` that receive focus programmatically  Enever remove focus outlines from interactive elements.
- **Set focus after the content has rendered.** If the new route loads data asynchronously, move the focus call to after the data has loaded and the content is in the DOM. Focusing an empty container provides no useful context to screen reader users.
- **Use the pathname as the dependency, not the full location object.** Query parameter changes usually represent filter or sort updates on the same page, not full navigations, and should not trigger a focus reset.

### Announcing Route Changes with a Live Region

In addition to moving focus, you should announce the new page context to screen reader users. A visually hidden live region that updates with the page title on each route change handles this cleanly.

```jsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function RouteAnnouncer() {
  const [announcement, setAnnouncement] = useState("");
  const location = useLocation();

  useEffect(() => {
    const pageTitle = document.title;
    setAnnouncement(pageTitle);
  }, [location.pathname]);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      style={{
        position: "absolute",
        width: "1px",
        height: "1px",
        overflow: "hidden",
        clip: "rect(0, 0, 0, 0)",
        whiteSpace: "nowrap",
      }}
    >
      {announcement}
    </div>
  );
}
```

Place this component once at the root of your application. Every time the route changes, it updates with the current page title, and screen readers announce the text through the `aria-live="polite"` region. This gives the user the same context they would receive from a traditional page load announcement.

Note that some frameworks handle this for you. Next.js has built-in route announcements as of recent versions. If you are using Next.js, verify that the built-in announcer is working before adding your own  Ehaving two live region updates on each navigation will cause duplicate announcements.

### Updating the Document Title

Every route in your application should set a descriptive `document.title`. This is the value that screen readers announce on page load in traditional sites, and it is what your route announcer will broadcast. A common pattern is to set the title inside each page component or via a custom hook.

```jsx
import { useEffect } from "react";

function useDocumentTitle(title) {
  useEffect(() => {
    document.title = `${title} | Your App Name`;
  }, [title]);
}

// Usage in a page component
function ProductsPage() {
  useDocumentTitle("Products");

  return (
    <section aria-labelledby="products-heading">
      <h1 id="products-heading">Products</h1>
      {/* Page content */}
    </section>
  );
}
```

Titles should be specific and unique for each route. "Dashboard" is better than "Home." "Order #4521 Details" is better than "Order." The title is often the first piece of information a screen reader user receives about the page, so it needs to orient them immediately.

## Accessible Forms in React

Forms are where React accessibility problems concentrate most heavily. The controlled component pattern that React encourages is actually a good foundation for accessibility  Eit gives you precise control over field values, validation state, and error messaging  Ebut only if you wire up the ARIA attributes and announcement patterns correctly.

### Labeling Form Controls

Every form input must have a programmatically associated label. In React, the `htmlFor` attribute on `<label>` elements connects the label to the input's `id`.

```jsx
function EmailField() {
  const [email, setEmail] = useState("");

  return (
    <div>
      <label htmlFor="email-input">Email address</label>
      <input
        id="email-input"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-required="true"
      />
    </div>
  );
}
```

Do not rely on `placeholder` text as a substitute for labels. Placeholder text disappears as soon as the user types, leaving no visible label to confirm what the field expects. Screen readers may or may not read placeholder text depending on the browser and AT combination.

For fields where a visible label is genuinely not appropriate  Ea search input with a search button next to it, for example  Euse `aria-label` to provide an accessible name.

```jsx
<input
  type="search"
  aria-label="Search products"
  value={query}
  onChange={(e) => setQuery(e.target.value)}
/>
```

### Error Handling and Validation Messages

When a user submits a form with validation errors, three things need to happen for screen reader users to understand the problem: the error must be announced, the error must be associated with the relevant field, and focus must move to the first field with an error.

```jsx
function RegistrationForm() {
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const nameRef = useRef(null);
  const emailRef = useRef(null);

  const fieldRefs = { name: nameRef, email: emailRef };

  function validate() {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    }
    if (!formData.email.includes("@")) {
      newErrors.email = "Enter a valid email address.";
    }
    return newErrors;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);

    const firstErrorField = Object.keys(newErrors)[0];
    if (firstErrorField && fieldRefs[firstErrorField]?.current) {
      fieldRefs[firstErrorField].current.focus();
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div>
        <label htmlFor="reg-name">Full name</label>
        <input
          id="reg-name"
          ref={nameRef}
          type="text"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
          aria-required="true"
        />
        {errors.name && (
          <p id="name-error" role="alert">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="reg-email">Email address</label>
        <input
          id="reg-email"
          ref={emailRef}
          type="email"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          aria-required="true"
        />
        {errors.email && (
          <p id="email-error" role="alert">
            {errors.email}
          </p>
        )}
      </div>

      <button type="submit">Create account</button>
    </form>
  );
}
```

Key points in this pattern:

- **`aria-invalid`** is set to `true` when the field has a validation error. Screen readers announce this state when the field receives focus.
- **`aria-describedby`** links the input to its error message element. When the user focuses the input, the screen reader reads the label first and then the error description.
- **`role="alert"`** on the error message element causes screen readers to announce the error immediately when it appears in the DOM. This is critical for users who are not currently focused on the field with the error.
- **Focus moves to the first invalid field** after submission. Without this, the user has no way to locate which field needs correction.

### Live Regions for Asynchronous Feedback

For feedback that occurs without a page reload  Ea successful form submission, an item added to a cart, a save confirmation  Euse `aria-live` regions to announce the change.

```jsx
function SaveButton({ onSave }) {
  const [status, setStatus] = useState("");

  async function handleSave() {
    setStatus("Saving...");
    try {
      await onSave();
      setStatus("Changes saved successfully.");
    } catch {
      setStatus("Save failed. Please try again.");
    }
  }

  return (
    <>
      <button onClick={handleSave}>Save changes</button>
      <div aria-live="polite" role="status" className="sr-only">
        {status}
      </div>
    </>
  );
}
```

The `aria-live="polite"` attribute tells screen readers to announce the content when there is a natural pause in speech, avoiding interruption of whatever the user is currently doing. Use `aria-live="assertive"` only for urgent messages that require immediate attention, such as session timeout warnings or data loss alerts.

A critical implementation detail: the live region element must already be present in the DOM before its content changes. If you conditionally render the `<div aria-live="polite">` element at the same time as its content, some screen readers will not detect the change. Always render the container on mount and update its text content.

## Common React Anti-Patterns That Break Accessibility

React's flexibility makes it easy to build custom components that look correct on screen but are completely broken for keyboard and screen reader users. The following anti-patterns appear in virtually every React codebase that has not been explicitly reviewed for accessibility.

### The `<div>` as Button

This is the most pervasive accessibility anti-pattern in React applications. Developers style a `<div>` or `<span>` with a click handler and call it a button.

```jsx
// Inaccessible - do not use
<div className="btn-primary" onClick={handleClick}>
  Submit
</div>
```

This element is invisible to screen readers as an interactive control. It cannot receive keyboard focus. It does not respond to Enter or Space key presses. It has no implicit ARIA role. A user navigating with a keyboard will skip right past it.

The fix is to use a `<button>` element.

```jsx
// Accessible
<button className="btn-primary" onClick={handleClick}>
  Submit
</button>
```

The `<button>` element provides focus management, keyboard activation (Enter and Space), an implicit `role="button"`, and an accessible name derived from its text content  Eall for free, with no additional code. There is no legitimate reason to build a custom button from a `<div>` in a React application. If the element needs to look different from the browser's default button, style it with CSS. If it needs to navigate somewhere, use an `<a>` element with an `href`.

If you are working with a component library that renders `<div>` elements as buttons internally, file a bug or wrap the component with the correct semantic element. Applying `role="button"` and `tabIndex={0}` to a `<div>` technically exposes it to assistive technology, but you then need to manually handle `onKeyDown` for Enter and Space, which is reimplementing behavior that `<button>` provides natively. It is more code, more brittle, and easy to get wrong.

### Misusing `tabIndex`

The `tabIndex` attribute controls whether and in what order an element participates in keyboard Tab navigation. Its correct usage is narrow:

- **`tabIndex={0}`** adds a non-focusable element to the natural Tab order. Use this for custom interactive widgets that are built from non-interactive elements (and first ask yourself whether you should be using a native interactive element instead).
- **`tabIndex={-1}`** makes an element programmatically focusable via JavaScript but keeps it out of the Tab order. Use this for elements that need to receive focus in response to specific events, like the main content area after a route change.
- **`tabIndex` with a positive value** overrides the natural document Tab order. Never use this. Positive `tabIndex` values create a custom Tab sequence that almost always confuses users because it disconnects the visual layout from the keyboard navigation order. Screen reader users rely on the DOM order matching the visual order, and positive `tabIndex` values break that expectation.

A pattern that surfaces frequently in React codebases is adding `tabIndex={0}` to non-interactive container elements  Ea card component, a list item, a section  Eto make them "focusable" without any clear reason. If the element does not have a click handler or perform an interactive action, it should not be in the Tab order. Adding unnecessary tab stops makes keyboard navigation slower and more confusing.

### Incomplete Keyboard Event Handling

When developers do build custom interactive components, they often attach an `onClick` handler and forget that keyboard users need equivalent access. React's `onClick` on a `<button>` element already fires on Enter and Space key presses, but custom components built from non-interactive elements need explicit keyboard handling.

```jsx
// Incomplete - only works with mouse
<div role="tab" onClick={() => setActiveTab(index)}>
  {tab.label}
</div>

// Complete - works with mouse and keyboard
<div
  role="tab"
  tabIndex={0}
  onClick={() => setActiveTab(index)}
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setActiveTab(index);
    }
  }}
  aria-selected={activeTab === index}
>
  {tab.label}
</div>
```

Even with the keyboard handler added, this is more code and more fragile than using a `<button>` with `role="tab"`. The principle is always the same: use native HTML elements when they exist, and only build custom ARIA widgets when no native element provides the semantics you need.

### Missing Skip Navigation in SPAs

Multi-page websites commonly include a "Skip to main content" link as the first focusable element, allowing keyboard users to bypass the navigation header on every page. React SPAs need this too, but developers often forget it because the navigation does not reload on route changes.

```jsx
function SkipLink() {
  return (
    <a
      href="#main-content"
      className="skip-link"
    >
      Skip to main content
    </a>
  );
}
```

```css
.skip-link {
  position: absolute;
  left: -9999px;
  top: auto;
  width: 1px;
  height: 1px;
  overflow: hidden;
}

.skip-link:focus {
  position: fixed;
  top: 10px;
  left: 10px;
  width: auto;
  height: auto;
  padding: 0.75rem 1.5rem;
  background: #fff;
  color: #000;
  z-index: 9999;
  font-size: 1rem;
  text-decoration: underline;
}
```

Place the `SkipLink` component at the very top of your layout, before the header and navigation. Make sure the `#main-content` target has `tabIndex={-1}` so that focus actually moves to it when the skip link is activated. Test by pressing Tab immediately after a route change  Ethe skip link should be the first thing a keyboard user encounters.

## ARIA Patterns for Common React Components

Certain UI patterns appear in nearly every React application and have well-defined ARIA specifications. Implementing these correctly is the difference between a component that works for everyone and one that only works with a mouse.

### Modal Dialogs

Modals must trap focus inside the dialog while it is open and return focus to the triggering element when it closes. React portals handle the DOM placement, but the focus management is your responsibility.

```jsx
import { useEffect, useRef } from "react";

function Modal({ isOpen, onClose, title, children }) {
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement;
      modalRef.current?.focus();
    }
    return () => {
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [isOpen]);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        onClose();
      }
      if (e.key === "Tab" && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement =
          focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (
          !e.shiftKey &&
          document.activeElement === lastElement
        ) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () =>
        document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="modal-title">{title}</h2>
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
```

The critical requirements for an accessible modal dialog are: `role="dialog"` and `aria-modal="true"` to identify it to screen readers, `aria-labelledby` pointing to the dialog's heading, focus trapped inside the dialog while it is open, Escape key closes the dialog, and focus returns to the element that opened the dialog on close.

### Tab Components

Tab interfaces require coordinated ARIA roles across three levels: the tab list container, the individual tabs, and the tab panels.

```jsx
function Tabs({ tabs }) {
  const [activeIndex, setActiveIndex] = useState(0);

  function handleKeyDown(e, index) {
    let newIndex;
    if (e.key === "ArrowRight") {
      newIndex = (index + 1) % tabs.length;
    } else if (e.key === "ArrowLeft") {
      newIndex = (index - 1 + tabs.length) % tabs.length;
    } else if (e.key === "Home") {
      newIndex = 0;
    } else if (e.key === "End") {
      newIndex = tabs.length - 1;
    }

    if (newIndex !== undefined) {
      e.preventDefault();
      setActiveIndex(newIndex);
    }
  }

  return (
    <div>
      <div role="tablist" aria-label="Account settings">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={activeIndex === index}
            aria-controls={`panel-${tab.id}`}
            tabIndex={activeIndex === index ? 0 : -1}
            onClick={() => setActiveIndex(index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab, index) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`panel-${tab.id}`}
          aria-labelledby={`tab-${tab.id}`}
          hidden={activeIndex !== index}
          tabIndex={0}
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
```

The keyboard pattern for tabs uses Arrow keys to move between tabs within the tablist, not the Tab key. Only the active tab has `tabIndex={0}`, so pressing Tab moves focus into the active tab panel. This is called the roving tabindex pattern and it matches the WAI-ARIA Authoring Practices specification for tab widgets.

## Tooling: Catching Accessibility Issues Before They Ship

Manual testing with screen readers and keyboards is irreplaceable, but automated tooling catches a large category of issues during development before they ever reach production. Two tools are particularly valuable in React projects.

### eslint-plugin-jsx-a11y

This ESLint plugin analyzes your JSX at the linting stage and flags accessibility violations in your component markup. It catches issues like missing alt text, click handlers on non-interactive elements, missing ARIA attributes on form controls, and elements with conflicting or invalid ARIA roles.

Install it alongside your existing ESLint configuration:

```bash
npm install eslint-plugin-jsx-a11y --save-dev
```

Then add it to your ESLint config:

```json
{
  "plugins": ["jsx-a11y"],
  "extends": ["plugin:jsx-a11y/recommended"]
}
```

The `recommended` preset is a sensible default for most projects. It will flag things like `<img>` elements without `alt` attributes, `onClick` handlers on `<div>` elements without keyboard equivalents, `<a>` elements without `href` attributes, form inputs without associated labels, and redundant ARIA roles (such as `role="link"` on an `<a>` element).

This plugin runs at lint time, which means developers see violations in their editor as they write code. This is by far the cheapest point to fix accessibility problems. Integrate it into your CI pipeline so that accessibility-violating code cannot merge.

### React Testing Library Accessibility Queries

React Testing Library is built around the principle that tests should interact with components the same way users do. Its query hierarchy prioritizes accessible queries:

1. **`getByRole`**  Equeries elements by their ARIA role and accessible name. This is the preferred query for nearly all cases.
2. **`getByLabelText`**  Efinds form controls by their associated label. Perfect for testing that inputs are properly labeled.
3. **`getByPlaceholderText`, `getByText`, `getByDisplayValue`**  Efallback queries for content text.
4. **`getByTestId`**  Ea last resort when no accessible query is available. If you find yourself reaching for `getByTestId`, that often indicates an accessibility problem in the component itself.

```jsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RegistrationForm } from "./RegistrationForm";

test("displays validation errors and moves focus to first invalid field", async () => {
  const user = userEvent.setup();
  render(<RegistrationForm />);

  // Query by role  Econfirms the button has the right accessible name
  const submitButton = screen.getByRole("button", {
    name: /create account/i,
  });
  await user.click(submitButton);

  // Query by role with name  Econfirms error alerts are announced
  const nameError = await screen.findByRole("alert");
  expect(nameError).toHaveTextContent("Name is required");

  // Check that focus moved to the first invalid field
  const nameInput = screen.getByLabelText(/full name/i);
  expect(nameInput).toHaveFocus();
  expect(nameInput).toHaveAttribute("aria-invalid", "true");
});
```

By using `getByRole` and `getByLabelText` as your primary queries, your tests inherently verify that components have correct ARIA roles and label associations. If a test cannot find a button using `getByRole("button")`, that tells you the component is not rendering a semantic button, and a screen reader user will face the same problem.

### jest-axe for Automated ARIA Checks

For broader automated scanning in your test suite, `jest-axe` runs the axe-core accessibility engine against your rendered components.

```jsx
import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { ContactForm } from "./ContactForm";

expect.extend(toHaveNoViolations);

test("ContactForm has no accessibility violations", async () => {
  const { container } = render(<ContactForm />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

This catches structural violations like missing landmarks, heading hierarchy issues, color contrast problems in inline styles, and invalid ARIA attribute combinations. It does not catch focus management issues or dynamic interaction problems  Ethose require the manual testing patterns described earlier and dedicated [screen reader testing](/blog/screen-reader-testing-guide-for-developers).

## Scanning React Applications in Production

Development-time linting and test-time assertions catch issues before code ships, but they cannot test the full, rendered application as users actually experience it. Client-side routing, lazy-loaded components, dynamic data, and third-party scripts all introduce accessibility issues that only surface in the production environment.

This is where production scanning becomes essential. An automated scanner crawls your rendered pages, executes JavaScript, and tests the actual DOM that users encounter. It catches the issues that slip through development tooling: contrast violations introduced by dynamically loaded themes, missing alt text on CMS-managed images, keyboard traps in third-party chat widgets, and ARIA attribute conflicts between component libraries.

If you have not scanned your React application recently, start with [A11yScope's free scanner](/). It runs against your live site, evaluates each page against WCAG 2.1 Level AA criteria, and generates a prioritized report of violations with specific remediation guidance. For agency teams managing multiple client SPAs, the [Pro plan](/#pricing) supports continuous monitoring across all your projects with scheduled weekly scans and alerts when new issues appear.

Automated scanners catch roughly 30-40% of all possible WCAG violations. The issues they detect tend to be the most common and most impactful, making scanner reports the highest-leverage starting point for accessibility improvements. For guidance on acting on those reports, see [how to fix accessibility issues found by automated scanners](/blog/fix-accessibility-issues-automated-scanners).

## Building Accessibility Into Your React Workflow

Accessibility in React SPAs is not a feature you bolt on at the end of a project. It is a set of patterns you apply from the first component you build. The good news is that the patterns are well-defined and largely mechanical once you know them.

To summarize the essential practices covered in this guide:

- **Manage focus on every route change.** Move focus to the main content area and announce the new page title through a live region.
- **Use semantic HTML elements.** Buttons should be `<button>` elements. Links should be `<a>` elements with `href` attributes. Inputs should have associated `<label>` elements. This single practice eliminates the largest category of accessibility bugs in React applications.
- **Handle keyboard interaction for every custom component.** If a component responds to clicks, it must also respond to keyboard events. Test every interactive element with Tab, Enter, Space, Escape, and Arrow keys.
- **Associate error messages with form fields.** Use `aria-invalid`, `aria-describedby`, and `role="alert"` to ensure validation messages reach screen reader users.
- **Announce dynamic content changes.** Use `aria-live` regions for any content that updates without a full page navigation  Eloading states, success confirmations, real-time data.
- **Lint, test, and scan.** Run `eslint-plugin-jsx-a11y` in development, query by role in React Testing Library tests, and scan your production site regularly.

Every React application your agency ships will be used by people with disabilities. Baking these patterns into your component library and project scaffolding means accessibility is not an extra cost on each project  Eit is how your components work by default. Start by scanning your current projects with [A11yScope's free scanner](/) to establish a baseline, and work through the violations using the patterns in this guide.
