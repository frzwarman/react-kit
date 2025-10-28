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
  // Explicit toggle to show/hide the right-side visual column
  showRightImage?: boolean;
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
  signupHref,
  forgotPasswordLabel = 'Forgot your password?',
  forgotPasswordLinkLabel = 'Reset Here',
  forgotPasswordHref,
  rightImageSrc,
  rightImageAlt = 'Login image',
  showRightImage = true,
  className,
  continueWith,
  children,
}: LoginProps) {
  const shouldRenderRightColumn = showRightImage;

  return (
    <div
      className={[
        'mx-auto grid min-h-dvh w-full max-w-[1920px] grid-cols-1 lg:min-h-[768px]',
        shouldRenderRightColumn
          ? 'lg:grid-cols-[minmax(0,_1fr)_minmax(384px,_1fr)]'
          : null,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Left column: form section */}
      <div className="flex min-h-0 items-center justify-center p-6 sm:p-8 lg:p-12">
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
          {signupHref ? (
            <div className="mt-6 text-center text-sm">
              {signupLabel}{' '}
              <a href={signupHref} className="underline underline-offset-4">
                {signupLinkLabel}
              </a>
            </div>
          ) : null}
        </div>
      </div>

      {/* Right column: image */}
      {shouldRenderRightColumn ? (
        <div className="hidden max-h-[1280px] lg:block">
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
      ) : null}
    </div>
  );
}

export default Login;
