/**
 * This layout deliberately remains public because it also wraps /admin/login.
 * Protected admin pages use AdminProtected instead, so this route can never
 * redirect to itself before the login form is rendered.
 */
export default function Layout({children}:{children:React.ReactNode}) { return children; }
