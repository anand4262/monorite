"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Error boundaries must currently be class components in React — there is
 * no hook equivalent. This exists purely to make sure a WebGL/Three.js
 * failure (unsupported browser, lost context, a blocked network request,
 * a driver quirk) degrades to a calm static gradient instead of taking
 * down the entire hero section with an unhandled render error.
 */
export default class CanvasErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("[Hero3D] falling back to static gradient after a render error:", error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
