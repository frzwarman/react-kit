import type * as React from 'react';

export type LoginProps = {
  // Application title shown above the form (e.g., "Acme Inc")
  appTitle?: string;
  // Optional subtitle under the app title
  subtitle?: string;
  // Customizable signup label and link
  signupLabel?: string; // e.g., "Don't have an account?"
  signupLinkLabel?: string; // e.g., "Sign up"
  signupHref?: string;
  // Optional: render a "Forgot password" link under the form
  forgotPasswordLabel?: string; // e.g., "Forgot your password?"
  forgotPasswordLinkLabel?: string; // e.g., "Forgot your password?"
  forgotPasswordHref?: string; // when provided, the link will render
  // Right-side image URL and alt
  rightImageSrc?: string;
  rightImageAlt?: string;
  // Optional className for the outer container
  className?: string;
  // Optional continue-with slot (renders below the submit action area)
  continueWith?: React.ReactNode;
  // Children used as the form area
  children?: React.ReactNode;
};

/**
 * Login layout container.
 *
 * Responsibilities:
 * - Provides a two-column layout (form + optional right-side image)
 * - Renders an app title and optional subtitle above the form
 * - Renders optional separator and custom `continueWith` content (e.g., social buttons)
 * - Renders a footer with configurable signup CTA
 * - Leaves the actual form implementation to children, so you can use FormBuilder or any custom form
 */
export function Login({
  appTitle = 'Acme Inc',
  subtitle,
  signupLabel = "Don't have an account?",
  signupLinkLabel = 'Sign up',
  signupHref = '#',
  forgotPasswordLabel = 'Forgot your password?',
  forgotPasswordLinkLabel = 'Reset Here',
  forgotPasswordHref,
  rightImageSrc,
  rightImageAlt = 'Login image',
  className,
  continueWith,
  children,
}: LoginProps) {
  return (
    <div
      className={['grid min-h-dvh grid-cols-1 md:grid-cols-2', className]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Left column: form section */}
      <div className="flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          {/* Title */}
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold leading-tight tracking-tight">
              {appTitle}
            </h1>
            {subtitle ? (
              <p className="text-muted-foreground mt-1 text-sm">{subtitle}</p>
            ) : null}
          </div>

          {/* Form area (children) */}
          <div className="grid gap-6">
            {children}

            {/* Optional: Forgot password link */}
            {forgotPasswordHref ? (
              <div className="text-center text-sm">
                {forgotPasswordLabel}{' '}
                <a
                  href={forgotPasswordHref}
                  className="underline underline-offset-4"
                >
                  {forgotPasswordLinkLabel}
                </a>
              </div>
            ) : null}

            {/* Optional separator + continueWith slot */}
            {continueWith ? (
              <>
                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                  <span className="bg-background text-muted-foreground relative z-10 px-2">
                    Or continue with
                  </span>
                </div>
                <div className="grid gap-3">{continueWith}</div>
              </>
            ) : null}
          </div>

          {/* Signup footer */}
          <div className="mt-6 text-center text-sm">
            {signupLabel}{' '}
            <a href={signupHref} className="underline underline-offset-4">
              {signupLinkLabel}
            </a>
          </div>
        </div>
      </div>

      {/* Right column: image */}
      <div className="hidden md:block">
        {rightImageSrc ? (
          <img
            src={rightImageSrc}
            alt={rightImageAlt}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full bg-muted" />
        )}
      </div>
    </div>
  );
}

export default Login;
