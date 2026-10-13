import { Landmark } from 'lucide-react';
import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <main className="loan-portal loan-not-found">
      <div className="loan-not-found-card">
        <span className="loan-brand-mark" aria-hidden="true">
          <Landmark size={24} />
        </span>
        <p className="loan-eyebrow">Bank not found</p>
        <h1>We couldn’t find that application portal.</h1>
        <p>
          Check the bank link and try again. The bank code may be incorrect or
          the portal may no longer be available.
        </p>
        <Link className="loan-button loan-button-primary" to="/">
          Go to home
        </Link>
      </div>
    </main>
  );
}
