"use client";

// =============================================================================
// TemplateErrorBoundary — isolates a single template render.
//
// Card templates are large, data-driven components. If one throws during
// render (null dereference on a missing field, a bad sample, etc.) it would
// otherwise crash the entire client subtree it lives in — e.g. blanking the
// whole template carousel or the editor's live preview. Wrapping each template
// render in this boundary degrades a failing template to a quiet fallback
// instead, so one bad design can never take down the surrounding UI.
//
// Error boundaries must be class components — there is no hook equivalent.
// =============================================================================

import * as React from "react";

interface Props {
  /** Rendered in place of the children once a child render throws. */
  fallback: React.ReactNode;
  /** Optional hook for logging the offending template (e.g. to auto-hide it). */
  onError?: (error: Error) => void;
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export class TemplateErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    this.props.onError?.(error);
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}
