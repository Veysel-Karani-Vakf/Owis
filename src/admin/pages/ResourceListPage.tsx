// The old /admin/r/:key list address. Lists now live inside the site-page
// hubs, so this only redirects — which also carries the record editor's
// "back to the list" button into the right hub tab. Filters in the query
// string (?q=, ?status=) survive the redirect.

import { Navigate, useLocation, useParams } from 'react-router-dom';
import { areaForResource, hubPath } from '../lib/siteMap';

export default function ResourceListPage() {
  const { key = '' } = useParams();
  const location = useLocation();
  const found = areaForResource(key);
  if (!found) return <Navigate to="/admin" replace />;
  return (
    <Navigate to={{ pathname: hubPath(found.area, found.part), search: location.search }} replace />
  );
}
